/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CSSResultOrNative,
  html,
  isServer,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {when} from 'lit/directives/when.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {
  dispatchActivationClick,
  isActivationClick,
} from '../../../../internal/events/form-label-activation.js';
import {redispatchEvent} from '../../../../internal/events/redispatch-event.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {
  getFormValue,
  mixinFormAssociated,
} from '../../../behaviors/form-associated.js';
import {
  computeSliderProperties,
  formatValueIndicatorLabel,
  handleClasses,
  handleNubClasses,
  sliderClasses,
  type SliderOrientation,
  type SliderSize,
} from './slider.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import sliderStyles from './slider.css' with {type: 'css'}; // github-only
// import sliderStyles from './slider.cssresult.js'; // google3-only

interface Action {
  canFlip: boolean;
  flipped: boolean;
  target: HTMLInputElement;
  fixed: HTMLInputElement;
  values: Map<HTMLInputElement, number>;
}

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

/**
 * A Material Design slider component.
 *
 * This component does not format numbers; formatting is the application's
 * responsibility via `valueLabel` and `ariaValueText*`.
 * Note: An optional leading inset icon slot (`slot="icon"`) is supported on
 * the standard horizontal slider only (not range, not centered, and not
 * vertical) for sizes `md`, `lg`, and `xl`. Slotted icons should use
 * `<md-gb-icon slot="icon">` (e.g.
 * `<md-gb-icon slot="icon">volume_up</md-gb-icon>`).
 *
 * @fires {InputEvent} input - Fired when the slider value changes from user interaction. --bubbles --composed
 * @fires {Event} change - Fired when the slider value commit changes from user interaction. --bubbles
 * @cssprop --active-track-color
 * @cssprop --inactive-track-color
 * @cssprop --handle-color
 * @cssprop --handle-shape
 * @cssprop --handle-width
 * @cssprop --focus-handle-width
 * @cssprop --handle-height
 * @cssprop --active-handle-leading-space
 * @cssprop --active-track-inner-corner-size
 * @cssprop --stop-indicator-color
 * @cssprop --stop-indicator-color-selected
 * @cssprop --stop-indicator-size
 * @cssprop --stop-indicator-min-spacing
 * @cssprop --track-height
 * @cssprop --track-shape
 * @cssprop --inactive-track-shape-trailing
 * @cssprop --value-indicator-color
 * @cssprop --value-indicator-label-text-color
 * @cssprop --value-indicator-bottom-space
 * @cssprop --value-indicator-width
 * @cssprop --state-layer-size
 * @cssprop --with-overlap-handle-outline-color
 * @cssprop --with-overlap-handle-outline-width
 * @cssprop --icon-color
 * @cssprop --icon-color-active
 */
export class SliderElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [focusRingStyles, sliderStyles];

  @property({type: Number}) min = 0;
  @property({type: Number}) max = 100;
  @property({type: Number}) value?: number;
  @property({type: Number, attribute: 'value-start'}) valueStart?: number;
  @property({type: Number, attribute: 'value-end'}) valueEnd?: number;
  @property({
    converter: {
      fromAttribute(value: string | null): number | 'any' {
        if (value === 'any') return 'any';
        if (value === null || value === '') return 1;
        const num = Number(value);
        return isNaN(num) || num <= 0 ? 1 : num;
      },
      toAttribute(value: number | 'any'): string | null {
        return String(value);
      },
    },
  })
  step: number | 'any' = 1;
  @property({type: String, reflect: true}) size: SliderSize = 'xs';
  /**
   * The orientation of the slider.
   *
   * Vertical orientation applies to all variants (standard, discrete, range,
   * and centered).
   */
  @property({type: String, reflect: true})
  orientation: SliderOrientation = 'horizontal';
  @property({type: Boolean, reflect: true}) range = false;
  @property({type: Boolean, reflect: true}) centered = false;
  @property({type: Boolean}) ticks = false;
  @property({type: Boolean}) labeled = false;
  @property({type: Boolean, reflect: true}) override disabled = false;
  @property({attribute: 'value-label'}) valueLabel = '';
  @property({attribute: 'value-label-start'}) valueLabelStart = '';
  @property({attribute: 'value-label-end'}) valueLabelEnd = '';
  @property({attribute: 'aria-label-start'}) ariaLabelStart = '';
  @property({attribute: 'aria-label-end'}) ariaLabelEnd = '';
  @property({attribute: 'aria-valuetext-start'}) ariaValueTextStart = '';
  @property({attribute: 'aria-valuetext-end'}) ariaValueTextEnd = '';

  get nameStart() {
    return this.getAttribute('name-start') ?? this.name;
  }
  set nameStart(name: string) {
    this.setAttribute('name-start', name);
  }

  get nameEnd() {
    return this.getAttribute('name-end') ?? this.nameStart;
  }
  set nameEnd(name: string) {
    this.setAttribute('name-end', name);
  }

  @query('input.slider-start') readonly inputStart!: HTMLInputElement | null;
  @query('input.slider-end') readonly inputEnd!: HTMLInputElement | null;
  @query('.slider-handle.slider-start')
  readonly handleStart!: HTMLDivElement | null;
  @query('.slider-handle.slider-end')
  readonly handleEnd!: HTMLDivElement | null;

  @query('.slider') private readonly sliderEl!: HTMLElement | null;

  @state() protected renderValueStart?: number;
  @state() protected renderValueEnd?: number;
  @state() protected startOnTop = false;
  @state() private handleStartHover = false;
  @state() private handleEndHover = false;
  @state() private startFocusVisible = false;
  @state() private endFocusVisible = false;
  @state() private handlesOverlapping = false;
  @state() private trackLength?: number;

  private sliderResizeObserver?: ResizeObserver;
  private isRedispatchingEvent = false;
  private action?: Action;
  private pointerDownPending = false;
  private isPointerDragging = false;
  private get dragTarget(): HTMLInputElement | undefined {
    return this.isPointerDragging
      ? (this.action?.target as HTMLInputElement | undefined)
      : undefined;
  }

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

  private get renderAriaLabelStart() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return (
      this.ariaLabelStart ||
      (ariaLabel && `${ariaLabel} start`) ||
      this.valueLabelStart ||
      (this.valueStart !== undefined ? String(this.valueStart) : '')
    );
  }

  private get renderAriaValueTextStart() {
    return (
      this.ariaValueTextStart ||
      this.valueLabelStart ||
      (this.valueStart !== undefined ? String(this.valueStart) : '')
    );
  }

  private get renderAriaLabelEnd() {
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.range) {
      return (
        this.ariaLabelEnd ||
        (ariaLabel && `${ariaLabel} end`) ||
        this.valueLabelEnd ||
        (this.valueEnd !== undefined ? String(this.valueEnd) : '')
      );
    }
    return (
      ariaLabel ||
      this.valueLabel ||
      (this.value !== undefined ? String(this.value) : '')
    );
  }

  private get renderAriaValueTextEnd() {
    if (this.range) {
      return (
        this.ariaValueTextEnd ||
        this.valueLabelEnd ||
        (this.valueEnd !== undefined ? String(this.valueEnd) : '')
      );
    }
    const {ariaValueText} = this as ARIAMixinStrict;
    return (
      ariaValueText ||
      this.valueLabel ||
      (this.value !== undefined ? String(this.value) : '')
    );
  }

  override focus() {
    this.inputEnd?.focus();
  }

  override connectedCallback() {
    super.connectedCallback();
    this.measureAndObserve();
  }

  override disconnectedCallback() {
    this.isPointerDragging = false;
    this.sliderResizeObserver?.disconnect();
    this.sliderResizeObserver = undefined;
    super.disconnectedCallback();
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.measureAndObserve();
  }

  private measureAndObserve() {
    if (isServer || !this.sliderEl) return;
    const isVertical = this.orientation === 'vertical';
    const rect = this.sliderEl.getBoundingClientRect();
    const initialLength = Math.round(isVertical ? rect.height : rect.width);
    if (initialLength > 0 && this.trackLength !== initialLength) {
      this.trackLength = initialLength;
    }
    if (!this.sliderResizeObserver) {
      this.sliderResizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const isVert = this.orientation === 'vertical';
          const length = Math.round(
            isVert ? entry.contentRect.height : entry.contentRect.width,
          );
          if (this.trackLength === length) continue;
          this.trackLength = length;
        }
      });
      this.sliderResizeObserver.observe(this.sliderEl);
    }
  }

  protected override willUpdate(changed: PropertyValues) {
    this.renderValueStart =
      changed.has('valueStart') || changed.has('range')
        ? this.valueStart
        : this.inputStart?.valueAsNumber;
    const endValueChanged =
      (changed.has('valueEnd') && this.range) ||
      changed.has('value') ||
      changed.has('range');
    this.renderValueEnd = endValueChanged
      ? this.range
        ? this.valueEnd
        : this.value
      : this.inputEnd?.valueAsNumber;
  }

  protected override updated(changed: PropertyValues) {
    if (this.range) {
      this.renderValueStart = this.inputStart!.valueAsNumber;
    }
    this.renderValueEnd = this.inputEnd!.valueAsNumber;

    if (this.range) {
      const segment = (this.max - this.min) / 3;
      if (this.valueStart === undefined) {
        this.inputStart!.valueAsNumber = this.min + segment;
        const v = this.inputStart!.valueAsNumber;
        this.valueStart = this.renderValueStart = v;
      }
      if (this.valueEnd === undefined) {
        this.inputEnd!.valueAsNumber = this.min + 2 * segment;
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
      const startNub = this.handleStart?.querySelector('.slider-handle-nub');
      const endNub = this.handleEnd?.querySelector('.slider-handle-nub');
      this.handlesOverlapping = isOverlapping(startNub, endNub);
    }

    this.performUpdate();
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
    this.requestUpdate();
  }

  private finishAction() {
    this.action = undefined;
    this.requestUpdate();
  }

  private computeFocusVisible(target: HTMLInputElement) {
    return !this.pointerDownPending && target.matches(':focus-visible');
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.defaultPrevented) {
      return;
    }
    this.startAction(event);
    const target = event.target as HTMLInputElement;
    const isStart = target === this.inputStart;
    const isFocusVisible = this.computeFocusVisible(target);
    if (isStart) {
      this.startFocusVisible = isFocusVisible;
    } else {
      this.endFocusVisible = isFocusVisible;
    }

    const isVertical = this.orientation === 'vertical';
    if (isVertical && !this.disabled) {
      const stepSize =
        isFinite(Number(this.step)) && Number(this.step) > 0
          ? Number(this.step)
          : (this.max - this.min) / 100 || 1;
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        event.preventDefault();
        const oldVal = target.valueAsNumber;
        if (this.step === 'any') {
          target.valueAsNumber = Math.min(
            this.max,
            target.valueAsNumber + stepSize,
          );
        } else {
          target.stepUp();
        }
        if (target.valueAsNumber !== oldVal) {
          target.dispatchEvent(
            new InputEvent('input', {bubbles: true, composed: true}),
          );
          target.dispatchEvent(new Event('change', {bubbles: true}));
        }
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const oldVal = target.valueAsNumber;
        if (this.step === 'any') {
          target.valueAsNumber = Math.max(
            this.min,
            target.valueAsNumber - stepSize,
          );
        } else {
          target.stepDown();
        }
        if (target.valueAsNumber !== oldVal) {
          target.dispatchEvent(
            new InputEvent('input', {bubbles: true, composed: true}),
          );
          target.dispatchEvent(new Event('change', {bubbles: true}));
        }
      }
    }
  }

  private handleKeyup() {
    this.finishAction();
  }

  private handleDown(event: PointerEvent) {
    this.pointerDownPending = true;
    this.isPointerDragging = event.isPrimary && event.button === 0;
    try {
      (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
    } catch {}
    this.startAction(event);
    const isStart = (event.target as HTMLInputElement) === this.inputStart;
    // Since handle moves to pointer on down and there may not be a move,
    // it needs to be considered hovered.
    this.handleStartHover =
      !this.disabled && isStart && Boolean(this.handleStart);
    this.handleEndHover = !this.disabled && !isStart && Boolean(this.handleEnd);
  }

  private handleMove(event: PointerEvent) {
    if (this.isPointerDragging && event.buttons === 0) {
      this.isPointerDragging = false;
    }
    if (this.disabled) {
      this.handleStartHover = false;
      this.handleEndHover = false;
      return;
    }
    const dragTarget = this.dragTarget;
    if (dragTarget) {
      const isStart = dragTarget === this.inputStart;
      this.handleStartHover = isStart && inBounds(event, this.handleStart);
      this.handleEndHover = !isStart && inBounds(event, this.handleEnd);
      return;
    }
    this.applyNearestHover(event);
  }

  private handleEnter(event: PointerEvent) {
    this.handleMove(event);
  }

  private handleLeave() {
    this.handleStartHover = false;
    this.handleEndHover = false;
  }

  private handleCancel() {
    this.isPointerDragging = false;
    this.pointerDownPending = false;
    this.handleLeave();
    this.startOnTop = this.action?.target === this.inputStart;
    this.finishAction();
  }

  private handleLostPointerCapture() {
    this.isPointerDragging = false;
  }

  private applyNearestHover(event: PointerEvent) {
    if (this.disabled) {
      this.handleStartHover = false;
      this.handleEndHover = false;
      return;
    }
    const startInBounds = inBounds(event, this.handleStart);
    const endInBounds = inBounds(event, this.handleEnd);
    if (!this.handleStart || !this.handleEnd) {
      this.handleStartHover = false;
      this.handleEndHover = Boolean(this.handleEnd && endInBounds);
      return;
    }
    if (startInBounds && endInBounds) {
      const distStart = distanceToCenter(event, this.handleStart);
      const distEnd = distanceToCenter(event, this.handleEnd);
      if (Math.abs(distStart - distEnd) < 0.5) {
        const isStart = (event.target as HTMLInputElement) === this.inputStart;
        this.handleStartHover = isStart;
        this.handleEndHover = !isStart;
      } else if (distStart < distEnd) {
        this.handleStartHover = true;
        this.handleEndHover = false;
      } else {
        this.handleStartHover = false;
        this.handleEndHover = true;
      }
    } else {
      this.handleStartHover = startInBounds;
      this.handleEndHover = endInBounds;
    }
  }

  private handleReleaseHover(event: PointerEvent) {
    if (event.pointerType === 'touch') {
      this.handleStartHover = false;
      this.handleEndHover = false;
      return;
    }
    this.applyNearestHover(event);
  }

  private async handlePointerUp(event: PointerEvent) {
    this.isPointerDragging = false;
    await this.handleUp(event);
    this.pointerDownPending = false;
    this.handleReleaseHover(event);
  }

  private async handleUp(event: PointerEvent) {
    if (!this.action) {
      return;
    }

    const {target, values, flipped} = this.action;
    await new Promise(requestAnimationFrame);
    if (target !== undefined) {
      target.focus();
      if (flipped && target.valueAsNumber !== values.get(target)!) {
        target.dispatchEvent(new Event('change', {bubbles: true}));
      }
    }
    this.finishAction();
  }

  private updateOnTop(input: HTMLInputElement) {
    this.startOnTop = input.classList.contains('slider-start');
  }

  private handleFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement;
    this.updateOnTop(target);
    const isStart = target === this.inputStart;
    const isFocusVisible = this.computeFocusVisible(target);
    if (isStart) {
      this.startFocusVisible = isFocusVisible;
    } else {
      this.endFocusVisible = isFocusVisible;
    }
  }

  private handleBlur(event: FocusEvent) {
    this.pointerDownPending = false;
    const isStart = (event.target as HTMLInputElement) === this.inputStart;
    if (isStart) {
      this.startFocusVisible = false;
    } else {
      this.endFocusVisible = false;
    }
    this.finishAction();
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

  private clampAction() {
    if (!this.needsClamping() || !this.action) {
      return false;
    }
    const {target, fixed} = this.action;
    target.valueAsNumber = fixed.valueAsNumber;
    return true;
  }

  private handleInput(event: InputEvent) {
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
    if (this.range) {
      this.valueStart = this.inputStart!.valueAsNumber;
      this.valueEnd = this.inputEnd!.valueAsNumber;
    } else {
      this.value = this.inputEnd!.valueAsNumber;
    }
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (redispatch) {
      this.isRedispatchingEvent = true;
      redispatchEvent(target, event);
      this.isRedispatchingEvent = false;
    }
  }

  private handleChange(event: Event) {
    const changeTarget = event.target as HTMLInputElement;
    const {target, values} = this.action ?? {};
    const squelch =
      target && target.valueAsNumber === values?.get(changeTarget);
    if (!squelch) {
      redispatchEvent(this, event);
    }
    this.finishAction();
  }

  override [getFormValue]() {
    if (this.range) {
      const data = new FormData();
      data.append(
        this.nameStart,
        String(this.valueStart ?? this.renderValueStart ?? this.min),
      );
      data.append(
        this.nameEnd,
        String(this.valueEnd ?? this.renderValueEnd ?? this.max),
      );
      return data;
    }

    return String(this.value ?? this.renderValueEnd ?? this.min);
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

  protected override render() {
    let minSpacing: number | undefined;
    if (!isServer) {
      const raw =
        getComputedStyle(this).getPropertyValue(
          '--stop-indicator-min-spacing',
        ) ||
        (this.sliderEl
          ? getComputedStyle(this.sliderEl).getPropertyValue(
              '--stop-indicator-min-spacing',
            )
          : '');
      const parsed = Number(raw.replace('px', '').trim());
      if (isFinite(parsed) && parsed > 0) {
        minSpacing = parsed;
      }
    }

    const styles = computeSliderProperties({
      min: this.min,
      max: this.max,
      step: this.step,
      range: this.range,
      centered: this.centered,
      valueStart: this.renderValueStart,
      valueEnd: this.renderValueEnd,
      value: this.renderValueEnd,
      trackLength: this.trackLength,
      minSpacing,
    });

    const labelStart =
      this.valueLabelStart || formatValueIndicatorLabel(this.renderValueStart);
    const labelEnd =
      (this.range ? this.valueLabelEnd : this.valueLabel) ||
      formatValueIndicatorLabel(this.renderValueEnd);

    const isVertical = this.orientation === 'vertical';

    const dragTarget = this.dragTarget;
    const startOnTop = dragTarget
      ? dragTarget === this.inputStart
      : this.startOnTop;
    const handleStartHover =
      this.handleStartHover && (!dragTarget || dragTarget === this.inputStart);
    const handleEndHover =
      this.handleEndHover && (!dragTarget || dragTarget === this.inputEnd);
    const isCoincident =
      this.range &&
      this.renderValueStart !== undefined &&
      this.renderValueStart === this.renderValueEnd;

    const {
      '--__icon-over-active': _iconOverActive,
      '--__start-stop-selected': _startStopSelected,
      '--__end-stop-selected': _endStopSelected,
      ...cssStyles
    } = styles;

    return html`
      <div
        class="${classMap(
          sliderClasses({
            disabled: this.disabled,
            ranged: this.range,
            centered: this.centered,
            vertical: isVertical,
          }),
        )}"
        style=${styleMap(cssStyles)}>
        ${when(
          this.range,
          () => html`
            <input
              type="range"
              class="slider-start"
              orient=${isVertical ? 'vertical' : nothing}
              .tabIndex=${1}
              ?disabled=${this.disabled}
              .min=${String(this.min)}
              .max=${String(this.max)}
              .step=${String(this.step)}
              .value=${String(this.renderValueStart)}
              aria-label=${this.renderAriaLabelStart || nothing}
              aria-valuetext=${this.renderAriaValueTextStart || nothing}
              aria-valuemin=${this.min}
              aria-valuemax=${this.valueEnd ?? this.max}
              @keydown=${this.handleKeydown}
              @keyup=${this.handleKeyup}
              @pointerdown=${this.handleDown}
              @pointerup=${this.handlePointerUp}
              @pointercancel=${this.handleCancel}
              @lostpointercapture=${this.handleLostPointerCapture}
              @pointerenter=${this.handleEnter}
              @pointermove=${this.handleMove}
              @pointerleave=${this.handleLeave}
              @input=${this.handleInput}
              @change=${this.handleChange}
              @focus=${this.handleFocus}
              @blur=${this.handleBlur} />
          `,
        )}
        <input
          type="range"
          class="slider-end"
          orient=${isVertical ? 'vertical' : nothing}
          .tabIndex=${0}
          ?disabled=${this.disabled}
          .min=${String(this.min)}
          .max=${String(this.max)}
          .step=${String(this.step)}
          .value=${String(this.renderValueEnd)}
          aria-label=${this.renderAriaLabelEnd || nothing}
          aria-valuetext=${this.renderAriaValueTextEnd || nothing}
          aria-valuemin=${this.range ? (this.valueStart ?? this.min) : this.min}
          aria-valuemax=${this.max}
          @keydown=${this.handleKeydown}
          @keyup=${this.handleKeyup}
          @pointerdown=${this.handleDown}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handleCancel}
          @lostpointercapture=${this.handleLostPointerCapture}
          @pointerenter=${this.handleEnter}
          @pointermove=${this.handleMove}
          @pointerleave=${this.handleLeave}
          @input=${this.handleInput}
          @change=${this.handleChange}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur} />

        <div class="slider-track">
          <div
            class="slider-inactive-lead slider-track-box ${classMap({
              'slider-ticks': this.ticks,
            })}"></div>
          <div
            class="slider-active slider-track-box ${classMap({
              'slider-ticks': this.ticks,
            })}"></div>
          <div
            class="slider-inactive-trail slider-track-box ${classMap({
              'slider-ticks': this.ticks,
            })}"></div>
          ${when(
            !this.ticks,
            () => html`
              ${when(
                this.range || this.centered,
                () =>
                  html`<div
                    class="slider-boundary-stop slider-start ${classMap({
                      'slider-selected':
                        styles['--__start-stop-selected'] === '1',
                    })}"></div>`,
              )}
              <div
                class="slider-boundary-stop slider-end ${classMap({
                  'slider-selected': styles['--__end-stop-selected'] === '1',
                })}"></div>
            `,
          )}
          ${when(
            !this.range &&
              !this.centered &&
              this.orientation !== 'vertical' &&
              (this.size === 'md' || this.size === 'lg' || this.size === 'xl'),
            () => html`
              <div
                class="slider-icon ${classMap({
                  'slider-over-active': styles['--__icon-over-active'] === '1',
                })}"
                aria-hidden="true">
                <slot name="icon"></slot>
              </div>
            `,
          )}
        </div>

        <div class="slider-handles">
          ${when(
            this.range,
            () => html`
              <div
                class="${classMap({
                  ...handleClasses({
                    start: true,
                    hover: handleStartHover,
                    active: Boolean(
                      !this.disabled &&
                        this.action &&
                        this.action.target === this.inputStart,
                    ),
                    focusVisible: this.startFocusVisible,
                    disabled: this.disabled,
                    onTop: !this.disabled && startOnTop,
                    isOverlapping: this.range && this.handlesOverlapping,
                  }),
                  'slider-is-coincident': isCoincident,
                })}">
                <div
                  class="${classMap(
                    handleNubClasses({
                      focusVisible: this.startFocusVisible,
                    }),
                  )}"></div>
                ${when(
                  this.labeled,
                  () =>
                    html`<div class="slider-label" aria-hidden="true">
                      <span class="slider-label-content">${labelStart}</span>
                    </div>`,
                )}
              </div>
            `,
          )}
          <div
            class="${classMap({
              ...handleClasses({
                end: true,
                hover: handleEndHover,
                active: Boolean(
                  !this.disabled &&
                    this.action &&
                    this.action.target === this.inputEnd,
                ),
                focusVisible: this.endFocusVisible,
                disabled: this.disabled,
                onTop: !this.disabled && !startOnTop,
                isOverlapping: this.range && this.handlesOverlapping,
              }),
              'slider-is-coincident': isCoincident,
            })}">
            <div
              class="${classMap(
                handleNubClasses({
                  focusVisible: this.endFocusVisible,
                }),
              )}"></div>
            ${when(
              this.labeled,
              () =>
                html`<div class="slider-label" aria-hidden="true">
                  <span class="slider-label-content">${labelEnd}</span>
                </div>`,
            )}
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Determines whether a pointer event falls within the bounds of a handle element,
 * applying symmetric hit-area inflation based on `--state-layer-size`.
 *
 * Note: Fine pointers (40px state layer with 44px handle height and 4px handle width)
 * produce inflateX = 18px and inflateY = 0px, maintaining bit-for-bit identical behavior
 * to the legacy horizontal-only hit slop. Coarse pointers (48px state layer) intentionally
 * yield inflateY = 2px ((48 - 44) / 2) because the coarse touch target exceeds the 44px
 * handle height. This is a deliberate small vertical hit-area expansion,
 * not a regression.
 */
function inBounds({x, y}: PointerEvent, element?: HTMLElement | null) {
  if (!element) {
    return false;
  }
  const {top, left, bottom, right} = element.getBoundingClientRect();
  const rawSize =
    getComputedStyle(element).getPropertyValue('--state-layer-size');
  const size = Number(rawSize.replace('px', '').trim()) || 0;
  const inflateX = Math.max(0, (size - (right - left)) / 2);
  const inflateY = Math.max(0, (size - (bottom - top)) / 2);
  return (
    x >= left - inflateX &&
    x <= right + inflateX &&
    y >= top - inflateY &&
    y <= bottom + inflateY
  );
}

function distanceToCenter({x, y}: PointerEvent, element: HTMLElement) {
  const {top, left, bottom, right} = element.getBoundingClientRect();
  const cx = left + (right - left) / 2;
  const cy = top + (bottom - top) / 2;
  return Math.hypot(x - cx, y - cy);
}

function isOverlapping(
  elA: Element | null | undefined,
  elB: Element | null | undefined,
) {
  if (!(elA && elB)) return false;
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  return !(
    a.top > b.bottom ||
    a.right < b.left ||
    a.bottom < b.top ||
    a.left > b.right
  );
}
