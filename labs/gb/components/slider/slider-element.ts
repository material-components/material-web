/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {redispatchEvent} from '../../../../internal/events/redispatch-event.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../../behaviors/form-associated.js';

// import sliderStyles from './slider.cssresult.js'; // google3-only

import {
  calculateFraction,
  clampRangeAction,
  flipRangeAction,
  handleClasses,
  isOverlapping,
  isRangeActionFlipped,
  type RangeAction,
  sliderClasses,
  type SliderSize,
  startRangeAction,
} from './slider.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinFormAssociated(mixinElementInternals(LitElement)),
);

/**
 * A gBreeze Slider component.
 *
 * Supports both single-thumb (`range = false`) and multi-thumb range (`range = true`) modes.
 *
 * @fires {InputEvent} input - Fired when a slider thumb value changes. --bubbles --composed
 * @fires {Event} change - Fired when a slider thumb value commit occurs. --bubbles
 * @cssprop --active-handle-height - Height of the active handle.
 * @cssprop --active-handle-padding - Padding around the active handle for the state layer.
 * @cssprop --active-track-color - Color of the active track.
 * @cssprop --active-track-height - Height of the active track.
 * @cssprop --active-track-shape - Shape of the active track.
 * @cssprop --handle-color - Color of the thumb handle.
 * @cssprop --handle-elevation - Elevation box shadow of the thumb handle.
 * @cssprop --handle-height - Height of the thumb handle.
 * @cssprop --handle-shape - Border radius shape of the thumb handle.
 * @cssprop --handle-width - Width of the thumb handle.
 * @cssprop --inactive-track-color - Color of the inactive track.
 * @cssprop --inactive-track-height - Height of the inactive track.
 * @cssprop --inactive-track-shape - Shape of the inactive track.
 * @cssprop --stop-indicator-color - Color of track stop indicators.
 * @cssprop --value-indicator-container-color - Background color of the value indicator tooltip.
 * @cssprop --with-overlap-handle-outline-color - Outline color when two handles overlap.
 * @cssprop --with-overlap-handle-outline-width - Outline width when two handles overlap.
 */
export class SliderElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  static override styles: CSSResultOrNative[] = [
    sliderStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      .slider {
        flex: 1;
      }
    `,
  ];

  /** The slider minimum value. */
  @property({type: Number}) min = 0;

  /** The slider maximum value. */
  @property({type: Number}) max = 100;

  /** The slider value displayed when range is false. */
  @property({type: Number}) value?: number;

  /** The slider start value displayed when range is true. */
  @property({type: Number, attribute: 'value-start'}) valueStart?: number;

  /** The slider end value displayed when range is true. */
  @property({type: Number, attribute: 'value-end'}) valueEnd?: number;

  /**
   * An optional label for the slider's value displayed when range is false;
   * if not set, the label is the value itself.
   */
  @property({attribute: 'value-label'}) valueLabel = '';

  /**
   * An optional label for the slider's start value displayed when range is
   * true; if not set, the label is the valueStart itself.
   */
  @property({attribute: 'value-label-start'}) valueLabelStart = '';

  /**
   * An optional label for the slider's end value displayed when range is true;
   * if not set, the label is the valueEnd itself.
   */
  @property({attribute: 'value-label-end'}) valueLabelEnd = '';

  /** The step between values. */
  @property({type: Number}) step = 1;

  /** Whether or not to display a multi-thumb range slider. */
  @property({type: Boolean, reflect: true}) range = false;

  /** Whether or not the slider is disabled. */
  @property({type: Boolean, reflect: true}) override disabled = false;

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

  /** Whether or not tick marks are shown. */
  @property({type: Boolean}) ticks = false;

  /** Whether or not value labels are shown. */
  @property({type: Boolean}) labeled = false;

  /** Size variant for the slider. */
  @property() size?: SliderSize;

  /** Aria label for the start handle when range is true. */
  @property({attribute: 'aria-label-start'}) ariaLabelStart = '';

  /** Aria label for the end handle when range is true. */
  @property({attribute: 'aria-label-end'}) ariaLabelEnd = '';

  /** Aria value text for the start handle when range is true. */
  @property({attribute: 'aria-valuetext-start'}) ariaValueTextStart = '';

  /** Aria value text for the end handle when range is true. */
  @property({attribute: 'aria-valuetext-end'}) ariaValueTextEnd = '';

  /** Aria value text for the single handle when range is false. */
  @property({attribute: 'aria-valuetext'}) override ariaValueText = '';

  @query('input.start') private readonly inputStart!: HTMLInputElement | null;
  @query('input.end, input#input')
  private readonly inputEnd!: HTMLInputElement | null;

  @query('.handle.start')
  private readonly handleStartEl!: HTMLDivElement | null;
  @query('.handle.end') private readonly handleEndEl!: HTMLDivElement | null;

  @state() private startOnTop = false;
  @state() private handlesOverlapping = false;
  @state() private renderValueStart?: number;
  @state() private renderValueEnd?: number;

  private action?: RangeAction;
  private isRedispatchingEvent = false;

  private get renderAriaLabelStart() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return (
      this.ariaLabelStart ||
      (ariaLabel && `${ariaLabel} start`) ||
      this.valueLabelStart ||
      String(this.renderValueStart ?? this.valueStart ?? '')
    );
  }

  private get renderAriaValueTextStart() {
    return (
      this.ariaValueTextStart ||
      this.valueLabelStart ||
      String(this.renderValueStart ?? this.valueStart ?? '')
    );
  }

  private get renderAriaLabelEnd() {
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.range) {
      return (
        this.ariaLabelEnd ||
        (ariaLabel && `${ariaLabel} end`) ||
        this.valueLabelEnd ||
        String(this.renderValueEnd ?? this.valueEnd ?? '')
      );
    }
    return ariaLabel || this.valueLabel || String(this.value ?? '');
  }

  private get renderAriaValueTextEnd() {
    if (this.range) {
      return (
        this.ariaValueTextEnd ||
        this.valueLabelEnd ||
        String(this.renderValueEnd ?? this.valueEnd ?? '')
      );
    }
    const {ariaValueText} = this as ARIAMixinStrict;
    return ariaValueText || this.valueLabel || String(this.value ?? '');
  }

  override [getFormValue](): FormData | string {
    if (this.range) {
      const data = new FormData();
      data.append(this.nameStart, String(this.valueStart ?? this.min));
      data.append(this.nameEnd, String(this.valueEnd ?? this.max));
      return data;
    }
    return String(this.value ?? this.min);
  }

  override [getFormState](): FormData | string {
    return this[getFormValue]();
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
    if (state !== null) {
      this.value = Number(state);
      this.range = false;
    }
  }

  override focus(options?: FocusOptions) {
    this.inputEnd?.focus(options);
  }

  protected override willUpdate(changed: PropertyValues) {
    super.willUpdate(changed);
    this.renderValueStart = changed.has('valueStart')
      ? this.valueStart
      : (this.inputStart?.valueAsNumber ?? this.renderValueStart);
    const endValueChanged =
      (changed.has('valueEnd') && this.range) || changed.has('value');
    this.renderValueEnd = endValueChanged
      ? this.range
        ? this.valueEnd
        : this.value
      : (this.inputEnd?.valueAsNumber ?? this.renderValueEnd);
  }

  protected override updated(changed: PropertyValues) {
    super.updated(changed);
    if (this.range && this.inputStart) {
      this.renderValueStart = this.inputStart.valueAsNumber;
    }
    if (this.inputEnd) {
      this.renderValueEnd = this.inputEnd.valueAsNumber;
    }

    if (this.range) {
      const segment = (this.max - this.min) / 3;
      if (this.valueStart === undefined) {
        if (this.inputStart) {
          this.inputStart.valueAsNumber = this.min + segment;
          const v = this.inputStart.valueAsNumber;
          this.valueStart = this.renderValueStart = v;
        } else {
          this.valueStart = this.renderValueStart = this.min + segment;
        }
      }
      if (this.valueEnd === undefined) {
        if (this.inputEnd) {
          this.inputEnd.valueAsNumber = this.min + 2 * segment;
          const v = this.inputEnd.valueAsNumber;
          this.valueEnd = this.renderValueEnd = v;
        } else {
          this.valueEnd = this.renderValueEnd = this.min + 2 * segment;
        }
      }
    } else {
      this.value ??=
        this.renderValueEnd ?? this.min + (this.max - this.min) / 2;
      this.renderValueEnd = this.value;
    }

    if (
      changed.has('range') ||
      changed.has('renderValueStart') ||
      changed.has('renderValueEnd') ||
      this.isUpdatePending
    ) {
      const startNub = this.handleStartEl?.querySelector('.handle-nub');
      const endNub = this.handleEndEl?.querySelector('.handle-nub');
      this.handlesOverlapping = isOverlapping(startNub, endNub);
    }
    this.performUpdate();
  }

  override render() {
    const startFraction = this.range
      ? calculateFraction(
          this.valueStart ?? this.renderValueStart ?? this.min,
          this.min,
          this.max,
          this.step,
        )
      : 0;
    const endFraction = this.range
      ? calculateFraction(
          this.valueEnd ?? this.renderValueEnd ?? this.min,
          this.min,
          this.max,
          this.step,
        )
      : calculateFraction(
          this.value ?? this.renderValueEnd ?? this.min,
          this.min,
          this.max,
          this.step,
        );
    const midFraction = (startFraction + endFraction) / 2;

    const classes = sliderClasses({
      range: this.range,
      disabled: this.disabled,
      size: this.size,
    });

    const style = {
      '--_start-fraction': String(startFraction),
      '--_end-fraction': String(endFraction),
      '--_mid-fraction': String(midFraction),
    };

    return html`
      <div class=${classMap(classes)} style=${styleMap(style)}>
        <div class="track-wrapper" aria-hidden="true">
          <div class="inactive-track"></div>
          <div class="active-track"></div>
        </div>

        ${this.range ? this.renderMultiThumb() : this.renderSingleThumb()}
      </div>
    `;
  }

  private renderThumb(type: 'single' | 'start' | 'end') {
    const ariaLabelledBy = this.getAttribute('aria-labelledby');
    const isSingle = type === 'single';
    const isStart = type === 'start';
    const id = isSingle ? 'input' : type;
    const inputClass = isSingle ? 'input' : `input ${type}`;

    const onTop =
      !this.disabled &&
      (isSingle ? false : isStart ? this.startOnTop : !this.startOnTop);
    const isOverlapping =
      !this.disabled && !isSingle && this.handlesOverlapping;

    const handleClassesInfo = handleClasses({
      start: isStart,
      end: !isStart,
      onTop,
      isOverlapping,
    });

    const value = isStart
      ? (this.valueStart ?? this.renderValueStart ?? this.min)
      : isSingle
        ? (this.value ?? this.renderValueEnd ?? this.min)
        : (this.valueEnd ?? this.renderValueEnd ?? this.max);

    const ariaMin = isStart
      ? this.min
      : isSingle
        ? this.min
        : (this.valueStart ?? this.renderValueStart ?? this.min);
    const ariaMax = isStart
      ? (this.valueEnd ?? this.renderValueEnd ?? this.max)
      : this.max;

    const ariaLabel = isStart
      ? this.renderAriaLabelStart
      : this.renderAriaLabelEnd;
    const ariaValueText = isStart
      ? this.renderAriaValueTextStart
      : this.renderAriaValueTextEnd;

    return html`
      <input
        id=${id}
        type="range"
        class=${inputClass}
        .tabIndex=${this.disabled ? -1 : 0}
        .min=${String(this.min)}
        .max=${String(this.max)}
        .step=${String(this.step)}
        .value=${String(value)}
        .disabled=${this.disabled}
        aria-label=${ariaLabel || nothing}
        aria-labelledby=${ariaLabelledBy || nothing}
        aria-valuemin=${ariaMin}
        aria-valuemax=${ariaMax}
        aria-valuetext=${ariaValueText || nothing}
        @focus=${this.handleFocus}
        @pointerdown=${this.handleDown}
        @pointerup=${this.handleUp}
        @keydown=${this.handleKeydown}
        @keyup=${this.handleKeyup}
        @input=${this.handleInput}
        @change=${this.handleChange} />
      <div class=${classMap(handleClassesInfo)}>
        <div class="handle-nub"></div>
      </div>
    `;
  }

  private renderSingleThumb() {
    return this.renderThumb('single');
  }

  private renderMultiThumb() {
    return html` ${this.renderThumb('start')} ${this.renderThumb('end')} `;
  }

  private startAction(event: Event) {
    if (this.disabled) return;
    this.action = startRangeAction(event, this.inputStart, this.inputEnd);
  }

  private finishAction() {
    this.action = undefined;
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.disabled) return;
    this.startAction(event);
  }

  private handleKeyup() {
    this.finishAction();
  }

  private handleFocus(event: Event) {
    if (this.disabled) return;
    this.updateOnTop(event.target as HTMLInputElement);
  }

  private handleDown(event: PointerEvent) {
    if (this.disabled) return;
    this.startAction(event);
  }

  private async handleUp(event: PointerEvent) {
    if (this.disabled || !this.action) return;
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
    if (this.disabled) return;
    this.startOnTop = input.classList.contains('start');
  }

  private handleInput(event: InputEvent) {
    if (this.disabled || this.isRedispatchingEvent) return;
    let stopPropagation = false;
    let redispatch = false;
    if (this.range) {
      if (isRangeActionFlipped(this.action, this.inputStart)) {
        stopPropagation = true;
        redispatch = flipRangeAction(this.action);
      }
      if (clampRangeAction(this.action, this.inputStart)) {
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
    if (stopPropagation) event.stopPropagation();
    if (redispatch) {
      this.isRedispatchingEvent = true;
      redispatchEvent(target, event);
      this.isRedispatchingEvent = false;
    }
  }

  private handleChange(event: Event) {
    if (this.disabled) return;
    const changeTarget = event.target as HTMLInputElement;
    const {target, values} = this.action ?? {};
    const squelch =
      target && target.valueAsNumber === values!.get(changeTarget)!;
    if (!squelch) redispatchEvent(this, event);
    this.finishAction();
  }
}
