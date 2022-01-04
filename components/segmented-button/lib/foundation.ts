/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ObserverFoundation} from '../../controller/observer-foundation';

import {SegmentedButtonAdapter, SegmentedButtonSetAdapter, SegmentedButtonState} from './state';

/** Provdes the business logic for a segmented button. */
export class SegmentedButtonFoundation extends
    ObserverFoundation<SegmentedButtonAdapter> {
  protected override init() {
    this.observe(this.adapter.state, {
      selected: this.onSelectedChange,
    });
  }

  protected onSelectedChange(isSelected: boolean) {
    if (isSelected) {
      this.animateSelecting();
      return;
    }

    this.animateDeselecting();
  }

  private animateSelecting() {
    // TODO(b/212476341): Support selection animations.
    this.adapter.animateSelection([]);
  }

  private animateDeselecting() {
    // TODO(b/212476341): Support selection animations.
    this.adapter.animateSelection([]);
  }
}

const interactionKeys = new Set<string>([
  'Enter',
  ' ',  // Spacebar.
]);

interface FocusOptions {
  forceFocus: boolean;
}

/** Provides the business logic for a set of segmented buttons. */
export class SegmentedButtonSetFoundation extends
    ObserverFoundation<SegmentedButtonSetAdapter> {
  handleClick(e: MouseEvent) {
    const state = e.target as unknown as SegmentedButtonState;
    const index = this.adapter.state.buttons.indexOf(state);
    this.toggleSelected(index);
    this.makeButtonFocusable(index, {forceFocus: false});
  }

  handleKeydown(e: KeyboardEvent) {
    const state = e.target as unknown as SegmentedButtonState;
    const index = this.adapter.state.buttons.indexOf(state);
    // Treat interaction keydowns like clicks and update the selected state.
    if (interactionKeys.has(e.key)) {
      e.preventDefault();
      this.toggleSelected(index);
      this.makeButtonFocusable(index, {forceFocus: false});
      return;
    }
  }

  /** Toggles the selected state of the button at the given index. */
  private toggleSelected(index: number) {
    // Ignore interactions from out-of-bounds controls.
    if (this.indexOutOfBounds(index)) return;
    const state = this.adapter.state.buttons[index];
    // Ignore interactions from disabled controls.
    if (state.disabled) return;

    this.setSelected(index, !state.selected);
  }

  /** Sets the selected state of the button at the given index. */
  private setSelected(index: number, isSelected: boolean) {
    // Ignore interactions from out-of-bounds controls.
    if (this.indexOutOfBounds(index)) return;
    const state = this.adapter.state.buttons[index];
    // Ignore interactions from disabled controls.
    if (state.disabled) return;
    // Ignore de-selecting for single-select controls.
    if (!isSelected && !this.adapter.state.isMultiselect) return;

    state.selected = isSelected;
    // Early exit for multi-select - no need to unselect any other buttons.
    if (this.adapter.state.isMultiselect) return;
    // Early exit for single-select when unselecting - no need to unselect any
    // other buttons.
    if (!isSelected) return;

    // Deslect all other buttons for single-select.
    for (let i = 0; i < this.adapter.state.buttons.length; i++) {
      // Skip the button we previously selected.
      if (i === index) continue;
      this.adapter.state.buttons[i].selected = false;
    }
  }

  /** Makes the button at the given index focusable. */
  private makeButtonFocusable(index: number, opts: FocusOptions) {
    // Ignore out-of-bounds buttons.
    if (this.indexOutOfBounds(index)) return;
    const state = this.adapter.state.buttons[index];
    // Ignore disabled buttons.
    if (state.disabled) return;

    state.focusable = true;
    if (opts.forceFocus) {
      this.adapter.focusButton(index);
    }

    for (let i = 0; i < this.adapter.state.buttons.length; i++) {
      // Skip the button we previously made focusable.
      if (i === index) continue;
      this.adapter.state.buttons[i].focusable = false;
    }
  }

  /** Returns if the index is out-of-bounds. */
  private indexOutOfBounds(index: number): boolean {
    return index < 0 || index >= this.adapter.state.buttons.length;
  }
}