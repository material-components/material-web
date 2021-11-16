/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ObserverFoundation} from '../../controller/observer-foundation';
import {Easing} from '../../motion/animation';

import {FieldAdapter, FilledFieldAdapter, LabelType, OutlinedFieldAdapter} from './state';

export class FieldFoundation<A extends FieldAdapter = FieldAdapter> extends
    ObserverFoundation<A> {
  private previousAnimation?: AbortController;

  protected override init() {
    this.observe(this.adapter.state, {
      disabled: this.onDisabledChange,
      focused: this.onFocusedChange,
      label: this.onLabelChange,
      populated: this.onPopulatedChange,
      required: this.updateLabelAsterisk
    });
  }

  protected onDisabledChange() {
    if (this.adapter.state.disabled) {
      this.adapter.state.focused = false;
    }
  }

  protected onLabelChange(current?: string, previous?: string) {
    this.updateLabelAsterisk();
  }

  protected onFocusedChange(current: boolean, previous: boolean) {
    if (this.adapter.state.disabled) {
      this.adapter.state.focused = false;
      return;
    }

    const wasFloating = previous || this.adapter.state.populated;
    this.animateLabel(wasFloating);
  }

  protected onPopulatedChange(current: boolean, previous: boolean) {
    const wasFloating = previous || this.adapter.state.focused;
    this.animateLabel(wasFloating);
  }

  private updateLabelAsterisk() {
    const {label, required} = this.adapter.state;
    let labelText = label || '';
    if (required && label) {
      labelText = `${label}*`;
    }

    this.adapter.state.labelText = labelText;
  }

  private updateVisibleLabelType() {
    const shouldBeFloating =
        this.adapter.state.focused || this.adapter.state.populated;
    this.adapter.state.visibleLabelType =
        shouldBeFloating ? LabelType.FLOATING : LabelType.RESTING;
  }

  private async animateLabel(wasFloating: boolean) {
    const shouldBeFloating =
        this.adapter.state.focused || this.adapter.state.populated;
    if (!this.adapter.state.label || wasFloating === shouldBeFloating) {
      // Don't animate the label if there is no label or if the floating state
      // doesn't change. For example, focusing a populated field.
      // Keep the visibleLabelType updated so that the correct label shows if
      // one is added.
      this.updateVisibleLabelType();
      return;
    }

    // Cancel the previous animation (if any)
    this.previousAnimation?.abort();
    // Set up a new AbortController so that additional calls to animate will
    // stop this current animation.
    this.previousAnimation = new AbortController();
    const {signal} = this.previousAnimation;

    // Only one label is visible at a time for clearer text rendering.
    // The resting label is visible and used during animation. At the end of the
    // animation, it will either remain visible (if resting) or hide and the
    // floating label will be shown.
    this.adapter.state.visibleLabelType = LabelType.RESTING;

    const keyframes = await this.getLabelKeyframes(shouldBeFloating);
    if (signal.aborted) {
      // Don't animate if this animation was requested to stop while calculating
      return;
    }

    // We don't use forward filling because if the dimensions of the text field
    // change (leading icon removed, density changes, etc), then the animation
    // will be inaccurate.
    //
    // Re-calculating the animation each time will prevent any visual glitches
    // from appearing.
    const animation = await this.adapter.animateLabel(
        keyframes, {duration: 150, easing: Easing.STANDARD});
    // Go ahead and cancel if we were asked to
    if (signal.aborted) {
      animation.cancel();
      return;
    }

    // Otherwise, cancel if requested
    signal.addEventListener('abort', () => {
      animation.cancel();
    });

    animation.addEventListener('finish', () => {
      // At the end of the animation, set the final visible label
      this.updateVisibleLabelType();
      this.previousAnimation = undefined;
    });
  }

  private async getLabelKeyframes(shouldBeFloating: boolean) {
    const {
      x: floatingX,
      y: floatingY,
      width: floatingWidth,
      height: floatingHeight
    } = await this.adapter.state.floatingLabelRect;
    const {
      x: restingX,
      y: restingY,
      width: restingWidth,
      height: restingHeight
    } = await this.adapter.state.restingLabelRect;
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

    if (shouldBeFloating) {
      return [{transform: restTransform}, {transform: floatTransform}];
    }

    return [{transform: floatTransform}, {transform: restTransform}];
  }
}

export class FilledFieldFoundation extends FieldFoundation<FilledFieldAdapter> {
  handleClick(event: MouseEvent|TouchEvent) {
    if (this.adapter.state.disabled) {
      return;
    }

    this.updateStrokeTransformOrigin(event);
  }

  protected override onFocusedChange(current: boolean, previous: boolean) {
    // Upon losing focus, the stroke resets to expanding from the center, such
    // as when re-focusing with a keyboard.
    if (!this.adapter.state.focused) {
      this.updateStrokeTransformOrigin();
    }

    super.onFocusedChange(current, previous);
  }

  private async updateStrokeTransformOrigin(event?: MouseEvent|TouchEvent) {
    let transformOrigin = '';
    if (event) {
      const eventX =
          this.isTouchEvent(event) ? event.touches[0].clientX : event.clientX;
      const rootRect = await this.adapter.state.rootRect;
      transformOrigin = `${eventX - rootRect.x}px`;
    }

    this.adapter.state.strokeTransformOrigin = transformOrigin;
  }

  private isTouchEvent(event: Event): event is TouchEvent {
    // Can't use instanceof TouchEvent since Firefox does not provide the
    // constructor globally.
    return !!(event as TouchEvent).touches;
  }
}

export class OutlinedFieldFoundation extends
    FieldFoundation<OutlinedFieldAdapter> {}
