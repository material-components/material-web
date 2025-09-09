/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {when} from 'lit/directives/when.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';
import {
  dispatchActivationClick,
  isActivationClick,
} from '../../internal/events/form-label-activation.js';
import {redispatchEvent} from '../../internal/events/redispatch-event.js';
import {mixinElementInternals} from '../../labs/behaviors/element-internals.js';
import {
  getFormValue,
  mixinFormAssociated,
} from '../../labs/behaviors/form-associated.js';
import {MdRipple} from '../../ripple/ripple.js';

// Disable warning for classMap with destructuring
// tslint:disable:no-implicit-dictionary-conversion

// Separate variable needed for closure.
const sliderBaseClass = mixinDelegatesAria(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

/**
 * Slider component.
 *
 *
 * @fires change {Event} The native `change` event on
 * [`<input>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)
 * --bubbles
 * @fires input {InputEvent} The native `input` event on
 * [`<input>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
 * --bubbles --composed
 */
export class Slider extends sliderBaseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

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
  @property({attribute: 'value-label'}) valueLabel = '';

  /**
   * An optional label for the slider's start value displayed when
   * range is true; if not set, the label is the valueStart itself.
   */
  @property({attribute: 'value-label-start'}) valueLabelStart = '';

  /**
   * An optional label for the slider's end value displayed when
   * range is true; if not set, the label is the valueEnd itself.
   */
  @property({attribute: 'value-label-end'}) valueLabelEnd = '';

  /**
   * Aria label for the slider's start handle displayed when
   * range is true.
   */
  @property({attribute: 'aria-label-start'}) ariaLabelStart = '';

  /**
   * Aria value text for the slider's start value displayed when
   * range is true.
   */
  @property({attribute: 'aria-valuetext-start'}) ariaValueTextStart = '';

  /**
   * Aria label for the slider's end handle displayed when
   * range is true.
   */
  @property({attribute: 'aria-label-end'}) ariaLabelEnd = '';

  /**
   * Aria value text for the slider's end value displayed when
   * range is true.
   */
  @property({attribute: 'aria-valuetext-end'}) ariaValueTextEnd = '';

  /**
   * The step between values.
   */
  @property({type: Number}) step = 1;

  /**
   * Whether or not to show tick marks.
   */
  @property({type: Boolean}) ticks = false;

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

  @query('input.start') private readonly inputStart!: HTMLInputElement | null;
  @query('.handle.start') private readonly handleStart!: HTMLDivElement | null;
  @queryAsync('md-ripple.start')
  private readonly rippleStart!: Promise<MdRipple | null>;

  @query('input.end') private readonly inputEnd!: HTMLInputElement | null;
  @query('.handle.end') private readonly handleEnd!: HTMLDivElement | null;
  @queryAsync('md-ripple.end')
  private readonly rippleEnd!: Promise<MdRipple | null>;

  // handle hover/pressed states are set manually since the handle
  // does not receive pointer events so that the native inputs are
  // interaction targets.
  @state() private handleStartHover = false;
  @state() private handleEndHover = false;

  @state() private startOnTop = false;
  @state() private handlesOverlapping = false;

  @state() private renderValueStart?: number;
  @state() private renderValueEnd?: number;

  // Note: start aria-* properties are only applied when range=true, which is
  // why they do not need to handle both cases.
  private get renderAriaLabelStart() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return (
      this.ariaLabelStart ||
      (ariaLabel && `${ariaLabel} start`) ||
      this.valueLabelStart ||
      String(this.valueStart)
    );
  }

  private get renderAriaValueTextStart() {
    return (
      this.ariaValueTextStart || this.valueLabelStart || String(this.valueStart)
    );
  }

  // Note: end aria-* properties are applied for single and range sliders, which
  // is why it needs to handle `this.range` (while start aria-* properties do
  // not).
  private get renderAriaLabelEnd() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.range) {
      return (
        this.ariaLabelEnd ||
        (ariaLabel && `${ariaLabel} end`) ||
        this.valueLabelEnd ||
        String(this.valueEnd)
      );
    }

    return ariaLabel || this.valueLabel || String(this.value);
  }

  private get renderAriaValueTextEnd() {
    if (this.range) {
      return (
        this.ariaValueTextEnd || this.valueLabelEnd || String(this.valueEnd)
      );
    }

    // Needed for conformance
    const {ariaValueText} = this as ARIAMixinStrict;
    return ariaValueText || this.valueLabel || String(this.value);
  }

  // used in synthetic events generated to control ripple hover state.
  private ripplePointerId = 1;

  // flag to prevent processing of re-dispatched input event.
  private isRedispatchingEvent = false;

  private action?: Action;

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
    this.renderValueStart = changed.has('valueStart')
      ? this.valueStart
      : this.inputStart?.valueAsNumber;
    const endValueChanged =
      (changed.has('valueEnd') && this.range) || changed.has('value');
    this.renderValueEnd = endValueChanged
      ? this.range
        ? this.valueEnd
        : this.value
      : this.inputEnd?.valueAsNumber;
    // manually handle ripple hover state since the handle is pointer events
    // none.
    if (changed.get('handleStartHover') !== undefined) {
      this.toggleRippleHover(this.rippleStart, this.handleStartHover);
    } else if (changed.get('handleEndHover') !== undefined) {
      this.toggleRippleHover(this.rippleEnd, this.handleEndHover);
    }
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
    if (
      changed.has('range') ||
      changed.has('renderValueStart') ||
      changed.has('renderValueEnd') ||
      this.isUpdatePending
    ) {
      // Only check if the handle nubs are overlapping, as the ripple touch
      // target extends subtantially beyond the boundary of the handle nub.
      const startNub = this.handleStart?.querySelector('.handleNub');
      const endNub = this.handleEnd?.querySelector('.handleNub');
      this.handlesOverlapping = isOverlapping(startNub, endNub);
    }
    // called to finish the update imediately;
    // note, this is a no-op unless an update is scheduled
    this.performUpdate();
  }

  protected override render() {
    const step = this.step === 0 ? 1 : this.step;
    const range = Math.max(this.max - this.min, step);
    const startFraction = this.range
      ? ((this.renderValueStart ?? this.min) - this.min) / range
      : 0;
    const endFraction = ((this.renderValueEnd ?? this.min) - this.min) / range;
    const containerStyles = {
      // for clipping inputs and active track.
      '--_start-fraction': String(startFraction),
      '--_end-fraction': String(endFraction),
      // for generating tick marks
      '--_tick-count': String(range / step),
    };
    const containerClasses = {ranged: this.range};

    // optional label values to show in place of the value.
    const labelStart = this.valueLabelStart || String(this.renderValueStart);
    const labelEnd =
      (this.range ? this.valueLabelEnd : this.valueLabel) ||
      String(this.renderValueEnd);

    const inputStartProps = {
      start: true,
      value: this.renderValueStart,
      ariaLabel: this.renderAriaLabelStart,
      ariaValueText: this.renderAriaValueTextStart,
      ariaMin: this.min,
      ariaMax: this.valueEnd ?? this.max,
    };

    const inputEndProps = {
      start: false,
      value: this.renderValueEnd,
      ariaLabel: this.renderAriaLabelEnd,
      ariaValueText: this.renderAriaValueTextEnd,
      ariaMin: this.range ? this.valueStart ?? this.min : this.min,
      ariaMax: this.max,
    };

    const handleStartProps = {
      start: true,
      hover: this.handleStartHover,
      label: labelStart,
    };

    const handleEndProps = {
      start: false,
      hover: this.handleEndHover,
      label: labelEnd,
    };

    const handleContainerClasses = {
      hover: this.handleStartHover || this.handleEndHover,
    };

    return html` <div
      class="container ${classMap(containerClasses)}"
      style=${styleMap(containerStyles)}>
      ${when(this.range, () => this.renderInput(inputStartProps))}
      ${this.renderInput(inputEndProps)} ${this.renderTrack()}
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
    return html`
      <div class="trackPadded">
        <div class="trackBlock">
          ${this.renderTrackPart('start')}
          ${when(this.range, () => this.renderTrackPart('middle'))}
          ${this.renderTrackPart('end')}
        </div>
      </div>
      ${this.ticks ? html`<div class="tickmarks"></div>` : nothing}
    `;
  }

  private renderTrackPart(part: string) {
    return html`<div class="track-${part}"></div>`;
  }

  private renderLabel(value: string) {
    return html`<div class="label" aria-hidden="true">
      <span class="labelContent" part="label">${value}</span>
    </div>`;
  }

  private renderHandle({
    start,
    hover,
    label,
  }: {
    start: boolean;
    hover: boolean;
    label: string;
  }) {
    const onTop = !this.disabled && start === this.startOnTop;
    const isOverlapping = !this.disabled && this.handlesOverlapping;
    const name = start ? 'start' : 'end';
    return html`<div
      class="handle ${classMap({
        [name]: true,
        hover,
        onTop,
        isOverlapping,
      })}">
      <md-focus-ring part="focus-ring" for=${name}></md-focus-ring>
      <div class="handleNub"></div>
      ${when(this.labeled, () => this.renderLabel(label))}
    </div>`;
  }

  private renderInput({
    start,
    value,
    ariaLabel,
    ariaValueText,
    ariaMin,
    ariaMax,
  }: {
    start: boolean;
    value?: number;
    ariaLabel: string;
    ariaValueText: string;
    ariaMin: number;
    ariaMax: number;
  }) {
    // Slider requires min/max set to the overall min/max for both inputs.
    // This is reported to screen readers, which is why we need aria-valuemin
    // and aria-valuemax.
    const name = start ? `start` : `end`;
    return html`<input
      type="range"
      class="${classMap({
        start,
        end: !start,
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
      aria-valuemin=${ariaMin}
      .max=${String(this.max)}
      aria-valuemax=${ariaMax}
      .step=${String(this.step)}
      .value=${String(value)}
      .tabIndex=${start ? 1 : 0}
      aria-label=${ariaLabel || nothing}
      aria-valuetext=${ariaValueText} />`;
  }

  private async toggleRippleHover(
    ripple: Promise<MdRipple | null>,
    hovering: boolean,
  ) {
    const rippleEl = await ripple;
    if (!rippleEl) {
      return;
    }
    // TODO(b/269799771): improve slider ripple connection
    if (hovering) {
      rippleEl.handlePointerenter(
        new PointerEvent('pointerenter', {
          isPrimary: true,
          pointerId: this.ripplePointerId,
        }),
      );
    } else {
      rippleEl.handlePointerleave(
        new PointerEvent('pointerleave', {
          isPrimary: true,
          pointerId: this.ripplePointerId,
        }),
      );
    }
  }

  private handleFocus(event: Event) {
    this.updateOnTop(event.target as HTMLInputElement);
  }

  private startAction(event: Event) {
    const target = event.target as HTMLInputElement;
    const fixed =
      target === this.inputStart ? this.inputEnd! : this.inputStart!;
    this.action = {
      canFlip: event.type === 'pointerdown',
      flipped: false,
      target,
      fixed,
      values: new Map([
        [target, target.valueAsNumber],
        [fixed, fixed?.valueAsNumber],
      ]),
    };
  }

  private finishAction(event: Event) {
    this.action = undefined;
  }

  private handleKeydown(event: KeyboardEvent) {
    this.startAction(event);
  }

  private handleKeyup(event: KeyboardEvent) {
    this.finishAction(event);
  }

  private handleDown(event: PointerEvent) {
    this.startAction(event);
    this.ripplePointerId = event.pointerId;
    const isStart = (event.target as HTMLInputElement) === this.inputStart;
    // Since handle moves to pointer on down and there may not be a move,
    // it needs to be considered hovered..
    this.handleStartHover =
      !this.disabled && isStart && Boolean(this.handleStart);
    this.handleEndHover = !this.disabled && !isStart && Boolean(this.handleEnd);
  }

  private async handleUp(event: PointerEvent) {
    if (!this.action) {
      return;
    }

    const {target, values, flipped} = this.action;
    //  Async here for Firefox because input can be after pointerup
    //  when value is calmped.
    await new Promise(requestAnimationFrame);
    if (target !== undefined) {
      // Ensure Safari focuses input so label renders.
      // Ensure any flipped input is focused so the tab order is right.
      target.focus();
      // When action is flipped, change must be fired manually since the
      // real event target did not change.
      if (flipped && target.valueAsNumber !== values.get(target)!) {
        target.dispatchEvent(new Event('change', {bubbles: true}));
      }
    }
    this.finishAction(event);
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
  private handleMove(event: PointerEvent) {
    this.handleStartHover = !this.disabled && inBounds(event, this.handleStart);
    this.handleEndHover = !this.disabled && inBounds(event, this.handleEnd);
  }

  private handleEnter(event: PointerEvent) {
    this.handleMove(event);
  }

  private handleLeave() {
    this.handleStartHover = false;
    this.handleEndHover = false;
  }

  private updateOnTop(input: HTMLInputElement) {
    this.startOnTop = input.classList.contains('start');
  }

  private needsClamping() {
    if (!this.action) {
      return false;
    }

    const {target, fixed} = this.action;
    const isStart = target === this.inputStart;
    return isStart
      ? target.valueAsNumber > fixed.valueAsNumber
      : target.valueAsNumber < fixed.valueAsNumber;
  }

  // if start/end start coincident and the first drag input would e.g. move
  // start > end, avoid clamping and "flip" to use the other input
  // as the action target.
  private isActionFlipped() {
    const {action} = this;
    if (!action) {
      return false;
    }

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
    if (!this.action) {
      return false;
    }

    const {target, fixed, values} = this.action;
    const changed = target.valueAsNumber !== fixed.valueAsNumber;
    target.valueAsNumber = fixed.valueAsNumber;
    fixed.valueAsNumber = values.get(fixed)!;
    return changed;
  }

  // clamp such that start does not move beyond end and visa versa.
  private clampAction() {
    if (!this.needsClamping() || !this.action) {
      return false;
    }
    const {target, fixed} = this.action;
    target.valueAsNumber = fixed.valueAsNumber;
    return true;
  }

  private handleInput(event: InputEvent) {
    // avoid processing a re-dispatched event
    if (this.isRedispatchingEvent) {
      return;
    }
    let stopPropagation = false;
    let redispatch = false;
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
    const target = event.target as HTMLInputElement;
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
      event.stopPropagation();
    }
    // ensure event path is correct when flipped.
    if (redispatch) {
      this.isRedispatchingEvent = true;
      redispatchEvent(target, event);
      this.isRedispatchingEvent = false;
    }
  }

  private handleChange(event: Event) {
    // prevent keyboard triggered changes from dispatching for
    // clamped values; note, this only occurs for keyboard
    const changeTarget = event.target as HTMLInputElement;
    const {target, values} = this.action ?? {};
    const squelch =
      target && target.valueAsNumber === values!.get(changeTarget)!;
    if (!squelch) {
      redispatchEvent(this, event);
    }
    // ensure keyboard triggered change clears action.
    this.finishAction(event);
  }

  // Writable mixin properties for lit-html binding, needed for lit-analyzer
  declare disabled: boolean;
  declare name: string;

  override [getFormValue]() {
    if (this.range) {
      const data = new FormData();
      data.append(this.nameStart, String(this.valueStart));
      data.append(this.nameEnd, String(this.valueEnd));
      return data;
    }

    return String(this.value);
  }

  override formResetCallback() {
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

  override formStateRestoreCallback(
    state: string | Array<[string, string]> | null,
  ) {
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

function inBounds({x, y}: PointerEvent, element?: HTMLElement | null) {
  if (!element) {
    return false;
  }
  const {top, left, bottom, right} = element.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
}

function isOverlapping(
  elA: Element | null | undefined,
  elB: Element | null | undefined,
) {
  if (!(elA && elB)) {
    return false;
  }
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  return !(
    a.top > b.bottom ||
    a.right < b.left ||
    a.bottom < b.top ||
    a.left > b.right
  );
}

interface Action {
  canFlip: boolean;
  flipped: boolean;
  target: HTMLInputElement;
  fixed: HTMLInputElement;
  values: Map<HTMLInputElement | undefined, number | undefined>;
}
