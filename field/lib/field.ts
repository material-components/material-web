/**
 * @requirecss {field.lib.shared_styles}
 *
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {createAnimationSignal, EASING} from '../../motion/animation.js';

/** @soyCompatible */
export class Field extends LitElement {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) error = false;
  @property({type: Boolean}) focused = false;
  @property({type: String}) label?: string;
  @property({type: Boolean}) populated = false;
  @property({type: Boolean}) required = false;

  /**
   * Whether or not the field has leading content.
   */
  @property({type: Boolean}) hasStart = false;
  /**
   * Whether or not the field has trailing content.
   */
  @property({type: Boolean}) hasEnd = false;

  @state() protected isAnimating = false;

  protected readonly labelAnimationSignal = createAnimationSignal();

  @queryAsync('.md3-field__label--floating')
  protected readonly floatingLabelEl!: Promise<HTMLElement>;
  @queryAsync('.md3-field__label--resting')
  protected readonly restingLabelEl!: Promise<HTMLElement>;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <span class="md3-field ${classMap(this.getRenderClasses())}">
        ${this.renderContainer()}
        ${this.renderSupportingText()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderContainer(): TemplateResult {
    return html`
      <span class="md3-field__container">
        ${this.renderContainerContents()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-field--disabled': this.disabled,
      'md3-field--error': this.error,
      'md3-field--focused': this.focused,
      'md3-field--with-start': this.hasStart,
      'md3-field--with-end': this.hasEnd,
      'md3-field--populated': this.populated,
      'md3-field--required': this.required,
      'md3-field--no-label': !this.label,
    };
  }

  /** @soyTemplate */
  protected renderContainerContents(): TemplateResult {
    return html`
      <span class="md3-field__start">
        <slot name="start"></slot>
      </span>
      <span class="md3-field__middle">${this.renderMiddleContents()}</span>
      <span class="md3-field__end">
        <slot name="end"></slot>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderMiddleContents(): TemplateResult {
    return html`
      <span class="md3-field__content"><slot></slot></span>
    `;
  }

  /** @soyTemplate */
  protected renderFloatingLabel(): TemplateResult {
    const visible = (this.focused || this.populated) && !this.isAnimating;
    /** @classMap */
    const classes = {'md3-field__label--hidden': !visible};
    return html`
      <span class="md3-field__label md3-field__label--floating ${
        classMap(classes)}"
        aria-hidden=${!visible}
      >${this.renderLabelText()}</span>
    `;

    // TODO(b/217441842): Create shared function once argument bug is fixed
    // return this.renderLabel(LabelType.FLOATING);
  }

  /** @soyTemplate */
  protected renderRestingLabel(): TemplateResult {
    const visible = !(this.focused || this.populated) || this.isAnimating;
    /** @classMap */
    const classes = {'md3-field__label--hidden': !visible};
    return html`
      <span class="md3-field__label md3-field__label--resting ${
        classMap(classes)}"
        aria-hidden=${!visible}
      >${this.renderLabelText()}</span>
    `;

    // TODO(b/217441842): Create shared function once argument bug is fixed
    // return this.renderLabel(LabelType.RESTING);
  }

  /** @soyTemplate */
  protected renderLabelText(): string {
    const labelText = this.label ?? '';
    const optionalAsterisk = this.required && labelText ? '*' : '';
    return labelText + optionalAsterisk;
  }

  /** @soyTemplate */
  protected renderSupportingText(): TemplateResult {
    return html`
      <span class="md3-field__supporting-text">
        <span class="md3-field__supporting-text-start">
          <slot name="supporting-text"></slot>
        </span>
        <span class="md3-field__supporting-text-end">
          <slot name="supporting-text-end"></slot>
        </span>
      </span>
    `;
  }

  protected override update(props: PropertyValues<Field>) {
    // Client-side property updates

    // When disabling, remove focus styles if focused.
    if (this.disabled && this.focused) {
      props.set('focused', true);
      this.focused = false;
    }

    // Animate if focused or populated change.
    this.animateLabelIfNeeded({
      wasFocused: props.get('focused'),
      wasPopulated: props.get('populated')
    });

    super.update(props);
  }

  protected async animateLabelIfNeeded({wasFocused, wasPopulated}: {
    wasFocused?: boolean,
    wasPopulated?: boolean
  }) {
    if (!this.label) {
      return;
    }

    wasFocused ??= this.focused;
    wasPopulated ??= this.populated;
    const wasFloating = wasFocused || wasPopulated;
    const shouldBeFloating = this.focused || this.populated;
    if (wasFloating === shouldBeFloating) {
      return;
    }

    this.isAnimating = true;
    const signal = this.labelAnimationSignal.start();

    // Only one label is visible at a time for clearer text rendering.
    // The resting label is visible and used during animation. At the end of the
    // animation, it will either remain visible (if resting) or hide and the
    // floating label will be shown.
    const labelEl = await this.restingLabelEl;
    const keyframes = await this.getLabelKeyframes();
    if (signal.aborted) {
      // Don't animate if this animation was requested to stop while getting
      // the label element or calculating keyframes
      return;
    }

    // We don't use forward filling because if the dimensions of the text field
    // change (leading icon removed, density changes, etc), then the animation
    // will be inaccurate.
    //
    // Re-calculating the animation each time will prevent any visual glitches
    // from appearing.
    // TODO(b/241113345): use animation tokens
    const animation =
        labelEl.animate(keyframes, {duration: 150, easing: EASING.STANDARD});

    signal.addEventListener('abort', () => {
      // Cancel if requested (another animation starts playing).
      animation.cancel();
    });

    animation.addEventListener('finish', () => {
      // At the end of the animation, update the visible label.
      this.isAnimating = false;
      this.labelAnimationSignal.finish();
    });
  }

  protected async getLabelKeyframes() {
    const floatingLabelEl = await this.floatingLabelEl;
    const restingLabelEl = await this.restingLabelEl;
    const {
      x: floatingX,
      y: floatingY,
      width: floatingWidth,
      height: floatingHeight
    } = floatingLabelEl.getBoundingClientRect();
    const {
      x: restingX,
      y: restingY,
      width: restingWidth,
      height: restingHeight
    } = restingLabelEl.getBoundingClientRect();
    // Scale by width ratio instead of font size since letter-spacing will scale
    // incorrectly. Using the width we can better approximate the adjusted
    // scale and compensate for tracking.
    const scale = floatingWidth / restingWidth;
    const xDelta = floatingX - restingX;
    // The line-height of the resting and floating label are different. When
    // we move the resting label up to the floating label's position, it won't
    // exactly match because of this. We need to adjust by half of what the
    // final scaled resting label's height will be.
    const yDelta = floatingY - restingY +
        Math.round((floatingHeight - restingHeight * scale) / 2);

    // Create the two transforms: resting to floating (using the calculations
    // above), and floating to resting (re-setting the transform to initial
    // values).
    const floatTransform = `translateX(${xDelta}px) translateY(calc(-50% + ${
        yDelta}px)) scale(${scale})`;
    const restTransform = `translateX(0) translateY(-50%) scale(1)`;

    if (this.focused || this.populated) {
      return [{transform: restTransform}, {transform: floatTransform}];
    }

    return [{transform: floatTransform}, {transform: restTransform}];
  }
}
