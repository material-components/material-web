/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ObserverFoundation} from '../../controller/observer-foundation';

import {FieldAdapter, LabelType} from './state';

export class FieldFoundation extends ObserverFoundation<FieldAdapter> {
  override init() {
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
    const previouslyFloating = Boolean(previous) &&
        (this.adapter.state.focused || this.adapter.state.populated);
    this.animateLabel(previouslyFloating);
  }

  protected updateLabelAsterisk() {
    const {label, required} = this.adapter.state;
    let labelText = label || '';
    if (required && label) {
      labelText = `${label}*`;
    }

    this.adapter.state.labelText = labelText;
  }

  protected onFocusedChange(current: boolean, previous: boolean) {
    if (this.adapter.state.disabled) {
      this.adapter.state.focused = false;
      return;
    }

    const previouslyFloating = previous || this.adapter.state.populated;
    this.animateLabel(previouslyFloating);
  }

  protected onPopulatedChange(current: boolean, previous: boolean) {
    const previouslyFloating = previous || this.adapter.state.focused;
    this.animateLabel(previouslyFloating);
  }

  private animateLabel(previouslyFloating: boolean) {
    const shouldBeFloating =
        this.adapter.state.focused || this.adapter.state.populated;
    if (!this.adapter.state.label || previouslyFloating === shouldBeFloating) {
      // Don't animate the label if there is no label or if the floating state
      // doesn't change. For example, focusing a populated field.
      return;
    }

    // Only one label is visible at a time for clearer text rendering.
    // The resting label is visible and used during animation. At the end of the
    // animation, it will either remain visible (if resting) or hide and the
    // floating label will be shown.
    this.adapter.state.visibleLabelType = LabelType.RESTING;
    // TODO(b/177368040): label animations
    // At the end of the animation, set the final visible label
    this.adapter.state.visibleLabelType =
        shouldBeFloating ? LabelType.FLOATING : LabelType.RESTING;
  }
}
