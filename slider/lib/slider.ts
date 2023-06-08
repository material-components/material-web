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

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../internal/controller/events.js';
import {MdRipple} from '../../ripple/ripple.js';

// Disable warning for classMap with destructuring
// tslint:disable:quoted-properties-on-dictionary


/**
 * Slider component.
 */
export class Slider extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  static override shadowRootOptions:
      ShadowRootInit = {...LitElement.shadowRootOptions, delegatesFocus: true};

  /** @nocollapse */
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
  @property({type: Number}) value?: number;

  /**
   * The slider start value displayed when range is true.
   */
  @property({type: Number, attribute: 'value-start'}) valueStart?: number;

  /**
   * The slider end value displayed when range is true.
   */
  @property({type: Number, attribute: 'value-end'}) valueEnd?: number;

  /**
   * An optional label for the slider's value displayed when range is
   * false; if not set, the label is the value itself.
   */
  @property() valueLabel?: string;

  /**
   * An optional label for the slider's start value displayed when
   * range is true; if not set, the label is the valueStart itself.
   */
  @property() valueStartLabel?: string;

  /**
   * An optional label for the slider's end value displayed when
   * range is true; if not set, the label is the valueEnd itself.
   */
  @property() valueEndLabel?: string;

  /**
   * Aria label for the slider's start value displayed when
   * range is true.
   */
  @property({attribute: 'aria-label-start'}) ariaLabelStart?: string;

  /**
   * Aria label for the slider's end value displayed when
   * range is true.
   */
  @property({attribute: 'aria-label-end'}) ariaLabelEnd?: string;

  /**
   * The step between values.
   */
  @property({type: Number}) step = 1;

  /**
   * Whether or not to show tick marks.
   */
  @property({type: Boolean}) tickmarks = false;

  /**
   * Whether or not to show a value label when activated.
   */
  @property({type: Boolean}) labeled = false;

  /**
   * Whether or not to show a value range. When false, the slider displays
   * a slideable handle for the value property; when true, it displays
   * slideable handles for the valueStart and valueEnd properties.
   */
  @property({type: Boolean}) range = false;

  /**
   * The HTML name to use in form submission.
   */
  get name() {
    return this.getAttribute('name') ?? '';
  }
  set name(name: string) {
    this.setAttribute('name', name);
  }

  /**
   * The HTML name to use in form submission for a range slider's starting
   * value. Use `name` instead if both the start and end values should use the
   * same name.
   */
  get nameStart() {
    return this.getAttribute('name-start') ?? this.name;
  }
  set nameStart(name: string) {
    this.setAttribute('name-start', name);
  }

  /**
   * The HTML name to use in form submission for a range slider's ending value.
   * Use `name` instead if both the start and end values should use the same
   * name.
   */
  get nameEnd() {
    return this.getAttribute('name-end') ?? this.nameStart;
  }
  set nameEnd(name: string) {
    this.setAttribute('name-end', name);
  }

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.internals.form;
  }

  /**
   * The labels this element is associated with.
   */
  get labels() {
    return this.internals.labels;
  }

  @query('input.start') private readonly inputStart!: HTMLInputElement|null;
  @query('.handle.start') private readonly handleStart!: HTMLDivElement|null;
  @queryAsync('md-ripple.start')
  private readonly rippleStart!: Promise<MdRipple|null>;

  @query('input.end') private readonly inputEnd!: HTMLInputElement|null;
  @query('.handle.end') private readonly handleEnd!: HTMLDivElement|null;
  @queryAsync('md-ripple.end')
  private readonly rippleEnd!: Promise<MdRipple|null>;


  // handle hover/pressed states are set manually since the handle
  // does not receive pointer events so that the native inputs are
  // interaction targets.
  @state() private handleStartHover = false;
  @state() private handleEndHover = false;

  @state() private startOnTop = false;
  @state() private handlesOverlapping = false;

  @state() private renderValueStart?: number;
  @state() private renderValueEnd?: number;

  // used in synthetic events generated to control ripple hover state.
  private ripplePointerId = 1;

  // flag to prvent processing of re-dispatched input event.
  private isRedisptchingEvent = false;

  private action?: Action;

  private readonly internals =
      (this as HTMLElement /* needed for closure */).attachInternals();

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', (event: MouseEvent) => {
        if (!isActivationClick(event) || !this.inputEnd) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.inputEnd);
      });
    }
  }

  override focus() {
    this.inputEnd?.focus();
  }

  protected override willUpdate(changed: PropertyValues) {
    this.renderValueStart = changed.has('valueStart') ?
        this.valueStart :
        this.inputStart?.valueAsNumber;
    const endValueChanged =
        (changed.has('valueEnd') && this.range) || changed.has('value');
    this.renderValueEnd = endValueChanged ?
        (this.range ? this.valueEnd : this.value) :
        this.inputEnd?.valueAsNumber;
    // manually handle ripple hover state since the handle is pointer events
    // none.
    if (changed.get('handleStartHover') !== undefined) {
      this.toggleRippleHover(this.rippleStart, this.handleStartHover);
    } else if (changed.get('handleEndHover') !== undefined) {
      this.toggleRippleHover(this.rippleEnd, this.handleEndHover);
    }
  }

  protected override update(changed: PropertyValues<Slider>) {
    if (changed.has('value') || changed.has('range') ||
        changed.has('valueStart') || changed.has('valueEnd')) {
      if (this.range) {
        const data = new FormData();
        data.append(this.nameStart, String(this.valueStart));
        data.append(this.nameEnd, String(this.valueEnd));
        this.internals.setFormValue(data);
      } else {
        this.internals.setFormValue(String(this.value));
      }
    }

    super.update(changed);
  }

  protected override updated(changed: PropertyValues) {
    // Validate input rendered value and re-render if necessary. This ensures
    // the rendred handle stays in sync with the input thumb which is used for
    // interaction. These can get out of sync if a supplied value does not
    // map to an exactly stepped value between min and max.
    if (this.range) {
      this.renderValueStart = this.inputStart!.valueAsNumber;
    }
    this.renderValueEnd = this.inputEnd!.valueAsNumber;
    // update values if they are unset
    // when using a range, default to equi-distant between
    // min - valueStart - valueEnd - max
    if (this.range) {
      const segment = (this.max - this.min) / 3;
      if (this.valueStart === undefined) {
        this.inputStart!.valueAsNumber = this.min + segment;
        // read actual value from input
        const v = this.inputStart!.valueAsNumber;
        this.valueStart = this.renderValueStart = v;
      }
      if (this.valueEnd === undefined) {
        this.inputEnd!.valueAsNumber = this.min + 2 * segment;
        // read actual value from input
        const v = this.inputEnd!.valueAsNumber;
        this.valueEnd = this.renderValueEnd = v;
      }
    } else {
      this.value ??= this.renderValueEnd;
    }
    if (changed.has('range') || changed.has('renderValueStart') ||
        changed.has('renderValueEnd') || this.isUpdatePending) {
      this.handlesOverlapping = isOverlapping(this.handleStart, this.handleEnd);
    }
    // called to finish the update imediately;
    // note, this is a no-op unless an update is scheduled
    this.performUpdate();
  }

  protected override render() {
    const step = this.step === 0 ? 1 : this.step;
    const range = Math.max(this.max - this.min, step);
    const startFraction = this.range ?
        (((this.renderValueStart ?? this.min) - this.min) / range) :
        0;
    const endFraction = ((this.renderValueEnd ?? this.min) - this.min) / range;
    const containerStyles = {
      // for clipping inputs and active track.
      '--slider-start-fraction': String(startFraction),
      '--slider-end-fraction': String(endFraction),
      // for generating tick marks
      '--slider-tick-count': String(range / step),
    };
    const containerClasses = {ranged: this.range};

    // optional label values to show in place of the value.
    const labelStart = this.valueStartLabel ?? String(this.renderValueStart);
    const labelEnd = (this.range ? this.valueEndLabel : this.valueLabel) ??
        String(this.renderValueEnd);

    const inputStartProps = {
      start: true,
      value: this.renderValueStart,
      label: labelStart
    };

    const inputEndProps = {
      start: false,
      value: this.renderValueEnd,
      label: labelEnd
    };

    const handleStartProps = {
      start: true,
      hover: this.handleStartHover,
      label: labelStart
    };

    const handleEndProps = {
      start: false,
      hover: this.handleEndHover,
      label: labelEnd
    };

    const handleContainerClasses = {
      hover: this.handleStartHover || this.handleEndHover
    };

    return html`
      <div
        class="container ${classMap(containerClasses)}"
        style=${styleMap(containerStyles)}
      >
        ${when(this.range, () => this.renderInput(inputStartProps))}
        ${this.renderInput(inputEndProps)}
        ${this.renderTrack()}
        <div class="handleContainerPadded">
          <div class="handleContainerBlock">
            <div class="handleContainer ${classMap(handleContainerClasses)}">
              ${when(this.range, () => this.renderHandle(handleStartProps))}
              ${this.renderHandle(handleEndProps)}
            </div>
          </div>
        </div>
      </div>`;
  }

  private renderTrack() {
    const trackClasses = {'tickmarks': this.tickmarks};
    return html`<div class="track ${classMap(trackClasses)}"></div>`;
  }

  private renderLabel(value: string) {
    return html`<div class="label">
        <span class="labelContent" part="label">${value}</span>
      </div>`;
  }

  private renderHandle({start, hover, label}:
                           {start: boolean, hover: boolean, label: string}) {
    const onTop = !this.disabled && start === this.startOnTop;
    const isOverlapping = !this.disabled && this.handlesOverlapping;
    const name = start ? 'start' : 'end';
    return html`<div class="handle ${classMap({
      [name]: true,
      hover,
      onTop,
      isOverlapping
    })}">
      <div class="handleNub"><md-elevation></md-elevation></div>
      ${when(this.labeled, () => this.renderLabel(label))}
      <md-focus-ring for=${name}></md-focus-ring>
      <md-ripple for=${name} class=${name} ?disabled=${
        this.disabled}></md-ripple>
    </div>`;
  }

  private renderInput({start, value, label}:
                          {start: boolean; value?: number; label: string;}) {
    const name = start ? `start` : `end`;
    // when ranged, ensure announcement includes value info.
    // Needed for closure conformance
    let {ariaLabel} = this as ARIAMixinStrict;
    const {range, ariaLabelStart, ariaLabelEnd} = this;
    if (range) {
      ariaLabel = (start ? ariaLabelStart : ariaLabelEnd) ?? null;
    }
    return html`<input type="range"
      class="${classMap({
      start,
      end: !start
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
      id=${name}
      .disabled=${this.disabled}
      .min=${String(this.min)}
      .max=${String(this.max)}
      .step=${String(this.step)}
      .value=${String(value)}
      .tabIndex=${start ? 1 : 0}
      aria-label=${ariaLabel || nothing}
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

  private handleFocus(e: Event) {
    this.updateOnTop(e.target as HTMLInputElement);
  }

  private startAction(e: Event) {
    const target = e.target as HTMLInputElement;
    const fixed =
        (target === this.inputStart) ? this.inputEnd! : this.inputStart!;
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
    const isStart = e.target as HTMLInputElement === this.inputStart;
    // Since handle moves to pointer on down and there may not be a move,
    // it needs to be considered hovered..
    this.handleStartHover =
        !this.disabled && isStart && Boolean(this.handleStart);
    this.handleEndHover = !this.disabled && !isStart && Boolean(this.handleEnd);
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
    this.handleStartHover = !this.disabled && inBounds(e, this.handleStart);
    this.handleEndHover = !this.disabled && inBounds(e, this.handleEnd);
  }

  private handleEnter(e: PointerEvent) {
    this.handleMove(e);
  }

  private handleLeave() {
    this.handleStartHover = false;
    this.handleEndHover = false;
  }

  private updateOnTop(input: HTMLInputElement) {
    this.startOnTop = input.classList.contains('start');
  }

  private needsClamping() {
    const {target, fixed} = this.action!;
    const isStart = target === this.inputStart;
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
    }
    const {target} = this.action!;
    this.updateOnTop(target);
    // update value only on interaction
    if (this.range) {
      this.valueStart = this.inputStart!.valueAsNumber;
      this.valueEnd = this.inputEnd!.valueAsNumber;
    } else {
      this.value = this.inputEnd!.valueAsNumber;
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

  /** @private */
  formResetCallback() {
    if (this.range) {
      const valueStart = this.getAttribute('value-start');
      this.valueStart = valueStart !== null ? Number(valueStart) : undefined;
      const valueEnd = this.getAttribute('value-end');
      this.valueEnd = valueEnd !== null ? Number(valueEnd) : undefined;
      return;
    }
    const value = this.getAttribute('value');
    this.value = value !== null ? Number(value) : undefined;
  }

  /** @private */
  formStateRestoreCallback(state: string|Array<[string, string]>|null) {
    if (Array.isArray(state)) {
      const [[, valueStart], [, valueEnd]] = state;
      this.valueStart = Number(valueStart);
      this.valueEnd = Number(valueEnd);
      this.range = true;
      return;
    }

    this.value = Number(state);
    this.range = false;
  }
}

function inBounds({x, y}: PointerEvent, element?: HTMLElement|null) {
  if (!element) {
    return false;
  }
  const {top, left, bottom, right} = element.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
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
