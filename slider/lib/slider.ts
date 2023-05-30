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

import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {stringConverter} from '../../controller/string-converter.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
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

interface Action {
  canFlip: boolean;
  flipped: boolean;
  target: HTMLInputElement;
  fixed: HTMLInputElement;
  values: Map<HTMLInputElement|undefined, number|undefined>;
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
   * @export
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
  @property({type: Number}) max = 100;

  /**
   * The slider value displayed when range is false.
   */
  @property({type: Number}) value = 50;

  /**
   * The slider start value displayed when range is true.
   */
  @property({type: Number}) valueStart = 25;

  /**
   * The slider end value displayed when range is true.
   */
  @property({type: Number}) valueEnd = 75;

  /**
   * An optional label for the slider's value displayed when range is
   * false; if not set, the label is the value itself.
   */
  @property() valueLabel?: string|undefined;

  /**
   * An optional label for the slider's start value displayed when
   * range is true; if not set, the label is the valueStart itself.
   */
  @property() valueStartLabel?: string|undefined;

  /**
   * An optional label for the slider's end value displayed when
   * range is true; if not set, the label is the valueEnd itself.
   */
  @property() valueEndLabel?: string|undefined;

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
   * Whether or not to show a value range. When false, the slider displays
   * a slideable handle for the value property; when true, it displays
   * slideable handles for the valueStart and valueEnd properties.
   */
  @property({type: Boolean}) range = false;

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

  private getMetrics() {
    const step = Math.max(this.step, 1);
    const range = Math.max(this.max - this.min, step);
    const lower = this.valueA;
    const upper = this.valueB;
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

  // value coerced to a string
  [getFormValue]() {
    return this.range ? `${this.valueStart}, ${this.valueEnd}` :
                        `${this.value}`;
  }

  protected override willUpdate(changed: PropertyValues) {
    const step = Math.max(this.step, 1);
    let lower = this.range ? this.valueStart : this.min;
    lower = clamp(lower - (lower % step), this.min, this.max);
    let upper = this.range ? this.valueEnd : this.value;
    upper = clamp(upper - (upper % step), this.min, this.max);
    this.valueA = lower;
    this.valueB = upper;

    // manually handle ripple hover state since the handle is pointer events
    // none.
    if (changed.get('handleAHover') !== undefined) {
      this.toggleRippleHover(this.rippleA, this.handleAHover);
    } else if (changed.get('handleBHover') !== undefined) {
      this.toggleRippleHover(this.rippleB, this.handleBHover);
    }
  }

  protected override async updated(changed: PropertyValues) {
    if (changed.has('range') || changed.has('valueA') ||
        changed.has('valueB')) {
      await this.updateComplete;
      this.handlesOverlapping = isOverlapping(this.handleA, this.handleB);
    }
  }

  protected override render() {
    const {step, range, lowerFraction, upperFraction} = this.getMetrics();
    const containerStyles = {
      // for clipping inputs and active track.
      '--slider-lower-fraction': String(lowerFraction),
      '--slider-upper-fraction': String(upperFraction),
      // for generating tick marks
      '--slider-tick-count': String(range / step),
    };
    const containerClasses = {ranged: this.range};

    // optional label values to show in place of the value.
    const labelA = this.valueStartLabel ?? String(this.valueA);
    const labelB = (this.range ? this.valueEndLabel : this.valueLabel) ??
        String(this.valueB);

    const inputAProps = {
      id: 'a',
      lesser: true,
      value: this.valueA,
      label: labelA,
    };

    const inputBProps = {
      id: 'b',
      lesser: false,
      value: this.valueB,
      label: labelB,
    };

    const handleAProps =
        {id: 'a', lesser: true, hover: this.handleAHover, label: labelA};

    const handleBProps =
        {id: 'b', lesser: false, hover: this.handleBHover, label: labelB};

    const handleContainerClasses = {
      hover: this.handleAHover || this.handleBHover
    };

    return html`
      <div
        class="container ${classMap(containerClasses)}"
        style=${styleMap(containerStyles)}
      >
        ${when(this.range, () => this.renderInput(inputAProps))}
        ${this.renderInput(inputBProps)}
        ${this.renderTrack()}
        <div class="handleContainerPadded">
          <div class="handleContainerBlock">
            <div class="handleContainer ${classMap(handleContainerClasses)}">
              ${when(this.range, () => this.renderHandle(handleAProps))}
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

  private renderHandle(
      {id, lesser, hover, label}:
          {id: string, lesser: boolean, hover: boolean, label: string}) {
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
      <md-focus-ring for=${id}></md-focus-ring>
      <md-ripple for=${id} class=${id} ?disabled=${this.disabled}></md-ripple>
    </div>`;
  }

  private renderInput({id, lesser, value, label}: {
    id: string,
    lesser: boolean,
    value: number,
    label: string,
  }) {
    // when ranged, ensure announcement includes value info.
    const ariaLabelDescriptor =
        this.range ? ` - ${lesser ? `start` : `end`} handle` : '';
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<input type="range"
      class="${classMap({
      lesser,
      [id]: true
    })}"
      @focus=${this.handleFocus}
      @pointerdown=${this.handleDown}
      @pointerup=${this.handleUp}
      @pointerenter=${this.handleEnter}
      @pointermove=${this.handleMove}
      @pointerleave=${this.handleLeave}
      @keydown=${this.handleKeydown}
      @keyup=${this.handleKeyup}
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
      aria-valuetext=${label}>`;
  }

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
    this.updateOnTop(e.target as HTMLInputElement);
  }

  // used in synthetic events generated to control ripple hover state.
  private ripplePointerId = 1;

  // flag to prvent processing of re-dispatched input event.
  private isRedisptchingEvent = false;

  private action?: Action;

  private startAction(e: Event) {
    const target = e.target as HTMLInputElement;
    const fixed = (target === this.inputA) ? this.inputB! : this.inputA!;
    this.action = {
      canFlip: e.type === 'pointerdown',
      flipped: false,
      target,
      fixed,
      values: new Map(
          [[target, target.valueAsNumber], [fixed, fixed?.valueAsNumber]])
    };
  }

  private finishAction(e: Event) {
    this.action = undefined;
  }

  private handleKeydown(e: KeyboardEvent) {
    this.startAction(e);
  }

  private handleKeyup(e: KeyboardEvent) {
    this.finishAction(e);
  }

  private handleDown(e: PointerEvent) {
    this.startAction(e);
    this.ripplePointerId = e.pointerId;
    const isA = this.isEventOnA(e);
    // Since handle moves to pointer on down and there may not be a move,
    // it needs to be considered hovered..
    this.handleAHover = !this.disabled && isA && Boolean(this.handleA);
    this.handleBHover = !this.disabled && !isA && Boolean(this.handleB);
  }

  private async handleUp(e: PointerEvent) {
    const {target, values, flipped} = this.action ?? {};
    //  Async here for Firefox because input can be after pointerup
    //  when value is calmped.
    await new Promise(requestAnimationFrame);
    if (target !== undefined) {
      // Ensure Safari focuses input so label renders.
      // Ensure any flipped input is focused so the tab order is right.
      target.focus();
      // When action is flipped, change must be fired manually since the
      // real event target did not change.
      if (flipped && target.valueAsNumber !== values!.get(target)!) {
        target.dispatchEvent(new Event('change', {bubbles: true}));
      }
    }
    this.finishAction(e);
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

  private updateOnTop(input: HTMLInputElement) {
    this.onTopId = input.classList.contains('a') ? 'a' : 'b';
  }

  private needsClamping() {
    const {target, fixed} = this.action!;
    const isStart = target === this.inputA;
    return isStart ? target.valueAsNumber > fixed.valueAsNumber :
                     target.valueAsNumber < fixed.valueAsNumber;
  }

  // if start/end start coincident and the first drag input would e.g. move
  // start > end, avoid clamping and "flip" to use the other input
  // as the action target.
  private isActionFlipped() {
    const action = this.action!;
    const {target, fixed, values} = action;
    if (action.canFlip) {
      const coincident = values.get(target) === values.get(fixed);
      if (coincident && this.needsClamping()) {
        action.canFlip = false;
        action.flipped = true;
        action.target = fixed;
        action.fixed = target;
      }
    }
    return action.flipped;
  }

  // when flipped, apply the drag input to the flipped target and reset
  // the actual target.
  private flipAction() {
    const {target, fixed, values} = this.action!;
    const changed = target.valueAsNumber !== fixed.valueAsNumber;
    target.valueAsNumber = fixed.valueAsNumber;
    fixed.valueAsNumber = values.get(fixed)!;
    return changed;
  }

  // clamp such that start does not move beyond end and visa versa.
  private clampAction() {
    if (!this.needsClamping()) {
      return false;
    }
    const {target, fixed} = this.action!;
    target.valueAsNumber = fixed.valueAsNumber;
    return true;
  }

  private handleInput(e: InputEvent) {
    // avoid processing a re-dispatched event
    if (this.isRedisptchingEvent) {
      return;
    }
    let stopPropagation = false, redispatch = false;
    if (this.range) {
      if (this.isActionFlipped()) {
        stopPropagation = true;
        redispatch = this.flipAction();
      }
      if (this.clampAction()) {
        stopPropagation = true;
        redispatch = false;
      }
      this.valueA = this.inputA!.valueAsNumber;
    }
    this.valueB = this.inputB!.valueAsNumber;
    const {target} = this.action!;
    this.updateOnTop(target);
    // update value only on interaction
    if (this.range) {
      this.valueStart = this.valueA;
      this.valueEnd = this.valueB;
    } else {
      this.value = this.valueB;
    }
    // control external visibility of input event
    if (stopPropagation) {
      e.stopPropagation();
    }
    // ensure event path is correct when flipped.
    if (redispatch) {
      this.isRedisptchingEvent = true;
      redispatchEvent(target, e);
      this.isRedisptchingEvent = false;
    }
  }

  private handleChange(e: Event) {
    // prevent keyboard triggered changes from dispatching for
    // clamped values; note, this only occurs for keyboard
    const changeTarget = e.target as HTMLInputElement;
    const {target, values} = this.action ?? {};
    const squelch =
        (target && (target.valueAsNumber === values!.get(changeTarget)!));
    if (!squelch) {
      redispatchEvent(this, e);
    }
    // ensure keyboard triggered change clears action.
    this.finishAction(e);
  }
}
