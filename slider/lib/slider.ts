/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {when} from 'lit/directives/when.js';

import {ARIAMixinStrict} from '../../aria/aria.js';
import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {stringConverter} from '../../controller/string-converter.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';


// Disable warning for classMap with destructuring
// tslint:disable:quoted-properties-on-dictionary

function inBounds({x, y}: PointerEvent, element?: HTMLElement|null) {
  if (!element) {
    return false;
  }
  const {top, left, bottom, right} = element.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
}

// parse values like: foo or foo,bar
function tupleConverter(attr: string|null) {
  const [, v, e] =
      attr?.match(/\s*\[?\s*([^,]+)(?:(?:\s*$)|(?:\s*,\s*(.*)\s*))/) ?? [];
  return e !== undefined ? [v, e] : v;
}

function toNumber(value: string) {
  return Number(value) || 0;
}

function tupleAsString(value: unknown|[unknown, unknown]) {
  return Array.isArray(value) ? value.join() : String(value ?? '');
}

function valueConverter(attr: string|null) {
  const value = tupleConverter(attr);
  return Array.isArray(value) ? value.map(i => toNumber(i)) : toNumber(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function isOverlapping(elA: Element|null, elB: Element|null) {
  if (!(elA && elB)) {
    return false;
  }
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  return !(
      a.top > b.bottom || a.right < b.left || a.bottom < b.top ||
      a.left > b.right);
}

/**
 * Slider component.
 */
export class Slider extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  static override shadowRootOptions:
      ShadowRootInit = {...LitElement.shadowRootOptions, delegatesFocus: true};

  /**
   * @nocollapse
   */
  static formAssociated = true;

  /**
   * Whether or not the slider is disabled.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * The slider minimum value
   */
  @property({type: Number}) min = 0;

  /**
   * The slider maximum value
   */
  @property({type: Number}) max = 10;

  /**
   * The slider value, can be a single number, or an array tuple indicating
   * a start and end value.
   */
  @property({converter: valueConverter}) value: number|[number, number] = 0;

  /**
   * An optinoal label for the slider's value; if not set, the label is the
   * value itself. This can be a string or string tuple when start and end
   * values are used.
   */
  @property({converter: tupleConverter})
  valueLabel?: string|[string, string]|undefined;

  /**
   * The step between values.
   */
  @property({type: Number}) step = 1;

  /**
   * Whether or not to show tick marks.
   */
  @property({type: Boolean}) withTickMarks = false;

  /**
   * Whether or not to show a value label when activated.
   */
  @property({type: Boolean}) withLabel = false;

  /**
   * The HTML name to use in form submission.
   */
  @property({reflect: true, converter: stringConverter}) name = '';

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.closest('form');
  }


  /**
   * Read only computed value representing the fraction between 0 and 1
   * respresenting the value's position between min and max. This is a
   * single fraction or a tuple if the value specifies start and end values.
   */
  get valueAsFraction() {
    const {lowerFraction, upperFraction} = this.getMetrics();
    return this.allowRange ? [lowerFraction, upperFraction] : upperFraction;
  }

  private getMetrics() {
    const step = Math.max(this.step, 1);
    const range = Math.max(this.max - this.min, step);
    const lower = Math.min(this.valueA, this.valueB);
    const upper = Math.max(this.valueA, this.valueB);
    const lowerFraction = (lower - this.min) / range;
    const upperFraction = (upper - this.min) / range;
    return {
      step,
      range,
      lower,
      upper,
      lowerFraction,
      upperFraction,
    };
  }

  @query('input.a') private readonly inputA!: HTMLInputElement|null;
  @query('.handle.a') private readonly handleA!: HTMLDivElement|null;
  @queryAsync('md-ripple.a') private readonly rippleA!: Promise<MdRipple|null>;

  @query('input.b') private readonly inputB!: HTMLInputElement|null;
  @query('.handle.b') private readonly handleB!: HTMLDivElement|null;
  @queryAsync('md-ripple.b') private readonly rippleB!: Promise<MdRipple|null>;

  @state() private valueA = 0;
  @state() private valueB = 0;

  @state() private rippleAShowing = false;
  @state() private rippleBShowing = false;

  // handle hover/pressed states are set manually since the handle
  // does not receive pointer events so that the native inputs are
  // interaction targets.
  @state() private handleAHover = false;
  @state() private handleBHover = false;

  @state() private onTopId = 'b';
  @state() private handlesOverlapping = false;

  constructor() {
    super();
    this.addController(new FormController(this));
    if (!isServer) {
      this.addEventListener('click', (event: MouseEvent) => {
        if (!isActivationClick(event) || !this.inputB) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.inputB);
      });
    }
  }

  override focus() {
    this.inputB?.focus();
  }

  get valueAsString() {
    return tupleAsString(this.value);
  }

  // value coerced to a string
  [getFormValue]() {
    return this.valueAsString;
  }

  // If range should be allowed (detected via value format).
  private allowRange = false;

  // indicates input values are crossed over each other from initial rendering.
  private isFlipped() {
    return this.valueA > this.valueB;
  }

  protected override willUpdate(changed: PropertyValues) {
    if (changed.has('value') || changed.has('min') || changed.has('max') ||
        changed.has('step')) {
      this.allowRange = Array.isArray(this.value);
      const step = Math.max(this.step, 1);
      let lower =
          this.allowRange ? (this.value as [number, number])[0] : this.min;
      lower = clamp(lower - (lower % step), this.min, this.max);
      let upper = this.allowRange ? (this.value as [number, number])[1] :
                                    this.value as number;
      upper = clamp(upper - (upper % step), this.min, this.max);
      const isFlipped = this.isFlipped() && this.allowRange;
      this.valueA = isFlipped ? upper : lower;
      this.valueB = isFlipped ? lower : upper;
    }

    // manually handle ripple hover state since the handle is pointer events
    // none.
    if (changed.get('handleAHover') !== undefined) {
      this.rippleAShowing = true;
      this.toggleRippleHover(this.rippleA, this.handleAHover);
    } else if (changed.get('handleBHover') !== undefined) {
      this.rippleBShowing = true;
      this.toggleRippleHover(this.rippleB, this.handleBHover);
    }
  }

  protected override async updated(changed: PropertyValues) {
    if (changed.has('value') || changed.has('valueA') ||
        changed.has('valueB')) {
      await this.updateComplete;
      this.handlesOverlapping = isOverlapping(this.handleA, this.handleB);
    }
  }

  protected override render() {
    const {step, range, lowerFraction, upperFraction} = this.getMetrics();
    const isFlipped = this.isFlipped();
    const containerStyles = {
      // for clipping inputs and active track.
      '--slider-lower-fraction': String(lowerFraction),
      '--slider-upper-fraction': String(upperFraction),
      // for generating tick marks
      '--slider-tick-count': String(range / step),
    };
    const containerClasses = {ranged: this.allowRange};

    // optional label values to show in place of the value.
    const labelA = String(this.valueLabel?.[isFlipped ? 1 : 0] ?? this.valueA);
    const labelB = String(
        (this.allowRange ? this.valueLabel?.[isFlipped ? 0 : 1] :
                           this.valueLabel) ??
        this.valueB);

    const inputAProps = {
      id: 'a',
      lesser: !isFlipped,
      value: this.valueA,
      label: labelA,
      getRipple: this.getRippleA
    };

    const inputBProps = {
      id: 'b',
      lesser: isFlipped,
      value: this.valueB,
      label: labelB,
      getRipple: this.getRippleB
    };

    const handleAProps = {
      id: 'a',
      lesser: !isFlipped,
      showRipple: this.rippleAShowing,
      hover: this.handleAHover,
      label: labelA
    };

    const handleBProps = {
      id: 'b',
      lesser: isFlipped,
      showRipple: this.rippleBShowing,
      hover: this.handleBHover,
      label: labelB
    };

    const handleContainerClasses = {
      hover: this.handleAHover || this.handleBHover
    };

    return html`
      <div
        class="container ${classMap(containerClasses)}"
        style=${styleMap(containerStyles)}
      >
        ${when(this.allowRange, () => this.renderInput(inputAProps))}
        ${this.renderInput(inputBProps)}
        ${this.renderTrack()}
        <div class="handleContainerPadded">
          <div class="handleContainerBlock">
            <div class="handleContainer ${classMap(handleContainerClasses)}">
              ${when(this.allowRange, () => this.renderHandle(handleAProps))}
              ${this.renderHandle(handleBProps)}
            </div>
          </div>
        </div>
      </div>`;
  }

  private renderTrack() {
    const trackClasses = {'tickMarks': this.withTickMarks};
    return html`<div class="track ${classMap(trackClasses)}"></div>`;
  }

  private renderLabel(value: string) {
    return html`<div class="label">
        <span class="labelContent" part="label">${value}</span>
      </div>`;
  }

  private renderHandle({id, lesser, showRipple, hover, label}: {
    id: string,
    lesser: boolean,
    showRipple: boolean,
    hover: boolean,
    label: string
  }) {
    const onTop = !this.disabled && id === this.onTopId;
    const isOverlapping = !this.disabled && this.handlesOverlapping;
    return html`<div class="handle ${classMap({
      [id]: true,
      lesser,
      hover,
      onTop,
      isOverlapping
    })}">
        <div class="handleNub"><md-elevation></md-elevation></div>
        ${when(this.withLabel, () => this.renderLabel(label))}
      ${when(showRipple, () => this.renderRipple(id))}
      <md-focus-ring for=${id}></md-focus-ring>
    </div>`;
  }

  private renderInput({id, lesser, value, label, getRipple}: {
    id: string,
    lesser: boolean,
    value: number,
    label: string,
    getRipple: () => Promise<MdRipple|null>| null
  }) {
    // when ranged, ensure announcement includes value info.
    const ariaLabelDescriptor =
        this.allowRange ? ` - ${lesser ? `start` : `end`} handle` : '';
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<input type="range"
      class="${classMap({
      lesser,
      [id]: true
    })}"
      @focus=${this.handleFocus}
      @pointerdown=${this.handleDown}
      @pointerenter=${this.handleEnter}
      @pointermove=${this.handleMove}
      @pointerleave=${this.handleLeave}
      @input=${this.handleInput}
      @change=${this.handleChange}
      id=${id}
      .disabled=${this.disabled}
      .min=${String(this.min)}
      .max=${String(this.max)}
      .step=${String(this.step)}
      .value=${String(value)}
      .tabIndex=${lesser ? 1 : 0}
      aria-label=${`${ariaLabel}${ariaLabelDescriptor}` || nothing}
      aria-valuetext=${label}
      ${ripple(getRipple)}>`;
  }

  private readonly renderRipple = (id: string) => html`<md-ripple class=${
      id} ?disabled=${this.disabled} unbounded></md-ripple>`;

  private readonly getRippleA = () => {  // bind to this
    if (!this.handleAHover) {
      return null;
    }
    this.rippleAShowing = true;
    return this.rippleA;
  };

  private readonly getRippleB = () => {  // bind to this
    if (!this.handleBHover) {
      return null;
    }
    this.rippleBShowing = true;
    return this.rippleB;
  };

  private async toggleRippleHover(
      ripple: Promise<MdRipple|null>, hovering: boolean) {
    const rippleEl = await ripple;
    if (!rippleEl) {
      return;
    }
    // TODO(b/269799771): improve slider ripple connection
    if (hovering) {
      rippleEl.handlePointerenter(new PointerEvent(
          'pointerenter', {isPrimary: true, pointerId: this.ripplePointerId}));
    } else {
      rippleEl.handlePointerleave(new PointerEvent(
          'pointerleave', {isPrimary: true, pointerId: this.ripplePointerId}));
    }
  }

  private isEventOnA({target}: Event) {
    return target === this.inputA;
  }

  private handleFocus(e: Event) {
    this.updateOnTop(e);
  }

  // used in synthetic events generated to control ripple hover state.
  private ripplePointerId = 1;

  private handleDown(e: PointerEvent) {
    this.ripplePointerId = e.pointerId;
    const isA = this.isEventOnA(e);
    // Since handle moves to pointer on down and there may not be a move,
    // it needs to be considered hovered..
    this.handleAHover = !this.disabled && isA && Boolean(this.handleA);
    this.handleBHover = !this.disabled && !isA && Boolean(this.handleB);
    // Force Safari to focus input so the label stays displayed; note,
    // Macs don't normally focus non-text type inputs.
    const target = (e.target as HTMLElement);
    requestAnimationFrame(() => {
      target.focus();
    });
  }

  /**
   * The move handler tracks handle hovering to facilitate proper ripple
   * behavior on the slider handle. This is needed because user interaction with
   * the native input is leveraged to position the handle. Because the separate
   * displayed handle element has pointer events disabled (to allow interaction
   * with the input) and the input's handle is a pseudo-element, neither can be
   * the ripple's interactive element. Therefore the input is the ripple's
   * interactive element and has a `ripple` directive; however the ripple
   * is gated on the handle being hovered. In addition, because the ripple
   * hover state is being specially handled, it must be triggered independent
   * of the directive. This is done based on the hover state when the
   * slider is updated.
   */
  private handleMove(e: PointerEvent) {
    this.handleAHover = !this.disabled && inBounds(e, this.handleA);
    this.handleBHover = !this.disabled && inBounds(e, this.handleB);
  }

  private handleEnter(e: PointerEvent) {
    this.handleMove(e);
  }

  private handleLeave() {
    this.handleAHover = false;
    this.handleBHover = false;
  }

  private updateOnTop(e: Event) {
    this.onTopId = (e.target as Element).classList.contains('a') ? 'a' : 'b';
  }

  private handleInput(e: InputEvent) {
    if (this.inputA) {
      this.valueA = this.inputA.valueAsNumber ?? 0;
    }
    this.valueB = this.inputB!.valueAsNumber;
    this.updateOnTop(e);
    // update value only on interaction
    const lower = Math.min(this.valueA, this.valueB);
    const upper = Math.max(this.valueA, this.valueB);
    this.value = this.allowRange ? [lower, upper] : this.valueB;
  }

  private handleChange(event: Event) {
    redispatchEvent(this, event);
  }
}
