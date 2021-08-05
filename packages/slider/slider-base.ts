/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import '@material/mwc-ripple/mwc-ripple';

import {ariaProperty} from '@material/mwc-base/aria-property';
import {FormElement} from '@material/mwc-base/form-element';
import {Ripple} from '@material/mwc-ripple/mwc-ripple';
import {RippleHandlers} from '@material/mwc-ripple/ripple-handlers';
import {MDCSliderFoundation} from '@material/slider/foundation';
import {Thumb, TickMark} from '@material/slider/types';
import {html, property, PropertyValues, query, queryAsync, state} from 'lit-element';
import {nothing, TemplateResult} from 'lit-html';
import {classMap} from 'lit-html/directives/class-map';
import {ifDefined} from 'lit-html/directives/if-defined';
import {styleMap} from 'lit-html/directives/style-map';

export {Thumb} from '@material/slider/types';

export class SliderBase extends FormElement {
  protected mdcFoundation!: MDCSliderFoundation;
  protected readonly mdcFoundationClass = MDCSliderFoundation;
  @query('input.end') protected formElement!: HTMLInputElement;
  @query('.mdc-slider') protected mdcRoot!: HTMLElement;
  @query('.end.mdc-slider__thumb') protected endThumb!: HTMLElement;
  @query('.end.mdc-slider__thumb .mdc-slider__thumb-knob')
  protected endThumbKnob!: HTMLElement;
  @queryAsync('.end .ripple') protected endRipple!: Promise<Ripple|null>;
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Number}) min = 0;
  @property({type: Number}) max = 100;
  @property({type: Number}) valueEnd = 0;
  @property({type: String}) name = '';
  @property({type: Number}) step: number = 1;
  @property({type: Boolean}) withTickMarks: boolean = false;
  @property({type: Boolean}) discrete: boolean = false;
  @state() protected valueIndicatorTextEnd: string = `${this.valueEnd}`;
  @state() protected tickMarks: TickMark[] = [];
  @state() protected trackTransformOriginStyle: string = '';
  @state() protected trackLeftStyle: string = '';
  @state() protected trackRightStyle: string = '';
  @state() protected trackTransitionStyle: string = '';
  @state() protected endThumbWithIndicator = false;
  @state() protected endThumbTop = false;
  @state() protected shouldRenderEndRipple = false;
  @state() protected endThumbTransformStyle: string = '';
  @state() protected endThumbTransitionStyle: string = '';

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  ariaLabel?: string;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-labelledby'})
  ariaLabelledBy?: string;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-describedby'})
  ariaDescribedBy?: string;

  valueToAriaTextTransform: ((value: number) => string)|null = null;
  valueToValueIndicatorTransform: ((value: number) => string) = (value) => {
    return `${value}`;
  };

  private boundMoveListener:
      ((event: PointerEvent|MouseEvent|TouchEvent) => void)|null = null;

  protected endRippleHandlers = new RippleHandlers(() => {
    this.shouldRenderEndRipple = true;
    return this.endRipple;
  });

  protected willUpdate(changed: PropertyValues) {
    if (changed.has('valueEnd') && this.mdcFoundation) {
      this.mdcFoundation.setValue(this.valueEnd);
      const validVal = this.mdcFoundation.getValue();

      if (validVal !== this.valueEnd) {
        this.valueEnd = validVal;
      }
    }

    if (changed.has('discrete')) {
      if (!this.discrete) {
        this.tickMarks = [];
      }
    }
  }

  protected render() {
    return this.renderRootEl(html`
      ${this.renderStartInput()}
      ${this.renderEndInput()}
      ${this.renderTrack()}
      ${this.renderTickMarks()}
      ${this.renderStartThumb()}
      ${this.renderEndThumb()}`);
  }

  protected renderRootEl(content: TemplateResult) {
    const rootClasses = classMap({
      'mdc-slider--disabled': this.disabled,
      'mdc-slider--discrete': this.discrete,
    });

    return html`
    <div
        class="mdc-slider ${rootClasses}"
        @pointerdown=${this.onPointerdown}
        @pointerup=${this.onPointerup}
        @contextmenu=${this.onContextmenu}>
      ${content}
    </div>`;
  }

  protected renderStartInput() {
    return nothing;
  }

  protected renderEndInput() {
    return html`
      <input
          class="mdc-slider__input end"
          type="range"
          step=${this.step}
          min=${this.min}
          max=${this.max}
          .value=${this.valueEnd as unknown as string}
          @change=${this.onEndChange}
          @focus=${this.onEndFocus}
          @blur=${this.onEndBlur}
          ?disabled=${this.disabled}
          name=${this.name}
          aria-label=${ifDefined(this.ariaLabel)}
          aria-labelledby=${ifDefined(this.ariaLabelledBy)}
          aria-describedby=${ifDefined(this.ariaDescribedBy)}
          aria-valuetext=${
        ifDefined(this.valueToAriaTextTransform?.(this.valueEnd))}>
    `;
  }

  protected renderTrack() {
    return nothing;
  }

  protected renderTickMarks() {
    return !this.withTickMarks ? nothing : html`
      <div class="mdc-slider__tick-marks">
        ${this.tickMarks.map((tickMark) => {
      const isActive = tickMark === TickMark.ACTIVE;

      return html`<div class="${
          isActive ? 'mdc-slider__tick-mark--active' :
                     'mdc-slider__tick-mark--inactive'}"></div>`;
    })}
      </div>`;
  }

  protected renderStartThumb() {
    return nothing;
  }

  protected renderEndThumb() {
    const endThumbClasses = classMap({
      'mdc-slider__thumb--with-indicator': this.endThumbWithIndicator,
      'mdc-slider__thumb--top': this.endThumbTop,
      'mdc-slider__thumb--short-value': this.valueIndicatorTextEnd.length <= 2,
    });

    const endThumbStyles = styleMap({
      '-webkit-transform': this.endThumbTransformStyle,
      'transform': this.endThumbTransformStyle,
      '-webkit-transition': this.endThumbTransitionStyle,
      'transition': this.endThumbTransitionStyle,
      'left': this.endThumbTransformStyle ?
          '' :
          getComputedStyle(this).direction === 'rtl' ?
          '' :
          `calc(${
              (this.valueEnd - this.min) / (this.max - this.min) *
              100}% - 24px)`,
      'right': this.endThumbTransformStyle ?
          '' :
          getComputedStyle(this).direction !== 'rtl' ?
          '' :
          `calc(${
              (this.valueEnd - this.min) / (this.max - this.min) *
              100}% - 24px)`,
    });

    const ripple = !this.shouldRenderEndRipple ?
        nothing :
        html`<mwc-ripple class="ripple" unbounded></mwc-ripple>`;
    return html`
      <div
          class="mdc-slider__thumb end ${endThumbClasses}"
          style=${endThumbStyles}
          @mouseenter=${this.onEndMouseenter}
          @mouseleave=${this.onEndMouseleave}>
        ${ripple}
        ${this.renderValueIndicator(this.valueIndicatorTextEnd)}
        <div class="mdc-slider__thumb-knob"></div>
      </div>
    `;
  }

  protected renderValueIndicator(text: string|number|null) {
    return this.discrete ? html`
    <div class="mdc-slider__value-indicator-container" aria-hidden="true">
      <div class="mdc-slider__value-indicator">
        <span class="mdc-slider__value-indicator-text">
          ${text}
        </span>
      </div>
    </div>` :
                           nothing;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.mdcFoundation) {
      this.mdcFoundation.destroy();
    }
  }

  protected createAdapter() {}

  async firstUpdated() {
    super.firstUpdated();
    await this.layout(true);
  }

  updated(changed: PropertyValues) {
    super.updated(changed);

    if (!this.mdcFoundation) {
      return;
    }

    if (changed.has('disabled')) {
      this.mdcFoundation.setDisabled(this.disabled);
    }

    if (changed.has('min')) {
      this.mdcFoundation.setMin(this.min);
    }

    if (changed.has('max')) {
      this.mdcFoundation.setMax(this.max);
    }

    if (changed.has('step')) {
      this.mdcFoundation.setStep(this.step);
    }

    if (changed.has('discrete')) {
      this.mdcFoundation.setIsDiscrete(this.discrete);
    }

    if (changed.has('withTickMarks')) {
      this.mdcFoundation.setHasTickMarks(this.withTickMarks);
    }
  }

  async layout(skipUpdateUI = false) {
    this.mdcFoundation?.layout({skipUpdateUI});
    this.requestUpdate();
    await this.updateComplete;
  }

  protected onEndChange(e: Event) {
    this.valueEnd = Number((e.target as HTMLInputElement).value);
    this.mdcFoundation?.handleInputChange(Thumb.END);
  }

  protected onEndFocus() {
    this.mdcFoundation?.handleInputFocus(Thumb.END);
    this.endRippleHandlers.startFocus();
  }

  protected onEndBlur() {
    this.mdcFoundation?.handleInputBlur(Thumb.END);
    this.endRippleHandlers.endFocus();
  }

  protected onEndMouseenter() {
    this.mdcFoundation?.handleThumbMouseenter();
    this.endRippleHandlers.startHover();
  }

  protected onEndMouseleave() {
    this.mdcFoundation?.handleThumbMouseleave();
    this.endRippleHandlers.endHover();
  }

  protected onPointerdown(e: PointerEvent) {
    this.layout();

    if (this.mdcFoundation) {
      this.mdcFoundation.handlePointerdown(e);
      this.boundMoveListener =
          this.mdcFoundation.handleMove.bind(this.mdcFoundation);
      this.mdcRoot.addEventListener('pointermove', this.boundMoveListener);
    }
  }

  protected onPointerup() {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleUp();
      if (this.boundMoveListener) {
        this.mdcRoot.removeEventListener('pointermove', this.boundMoveListener);
        this.boundMoveListener = null;
      }
    }
  }

  protected onContextmenu(e: Event) {
    // prevents context menu otherwise pointerdown will fire but not pointerup
    e.preventDefault();
  }

  protected setFormData(formData: FormData) {
    if (this.name) {
      formData.append(this.name, `${this.valueEnd}`);
    }
  }
}
