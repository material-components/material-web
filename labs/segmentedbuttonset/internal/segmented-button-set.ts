/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';
import {SegmentedButton} from '../../segmentedbutton/internal/segmented-button.js';

/**
 * SegmentedButtonSet is the parent component for two or more
 * `SegmentedButton` components. **Only** `SegmentedButton` components may be
 * used as children.
 *
 * @fires segmented-button-set-selection {CustomEvent<{button: SegmentedButton, selected: boolean, index: number}>}
 * Dispatched when a button is selected programattically with the
 * `setButtonSelected` or the `toggleSelection` methods as well as on user
 * interaction. --bubbles --composed
 */
export class SegmentedButtonSet extends LitElement {
  static {
    requestUpdateOnAriaChange(SegmentedButtonSet);
  }

  @property({type: Boolean}) multiselect = false;

  @queryAssignedElements({flatten: true}) buttons!: SegmentedButton[];

  getButtonDisabled(index: number): boolean {
    if (this.indexOutOfBounds(index)) return false;
    return this.buttons[index].disabled;
  }

  setButtonDisabled(index: number, disabled: boolean) {
    if (this.indexOutOfBounds(index)) return;
    this.buttons[index].disabled = disabled;
  }

  getButtonSelected(index: number): boolean {
    if (this.indexOutOfBounds(index)) return false;
    return this.buttons[index].selected;
  }

  setButtonSelected(index: number, selected: boolean) {
    // Ignore out-of-index values.
    if (this.indexOutOfBounds(index)) return;
    // Ignore disabled buttons.
    if (this.getButtonDisabled(index)) return;

    if (this.multiselect) {
      this.buttons[index].selected = selected;
      this.emitSelectionEvent(index);
      return;
    }

    // Single-select segmented buttons are not unselectable.
    if (!selected) return;

    this.buttons[index].selected = true;
    this.emitSelectionEvent(index);
    // Deselect all other buttons for single-select.
    for (let i = 0; i < this.buttons.length; i++) {
      if (i === index) continue;
      this.buttons[i].selected = false;
    }
  }

  private handleSegmentedButtonInteraction(event: CustomEvent) {
    const index = this.buttons.indexOf(event.target as SegmentedButton);
    this.toggleSelection(index);
  }

  private toggleSelection(index: number) {
    if (this.indexOutOfBounds(index)) return;
    this.setButtonSelected(index, !this.buttons[index].selected);
  }

  private indexOutOfBounds(index: number): boolean {
    return index < 0 || index >= this.buttons.length;
  }

  private emitSelectionEvent(index: number) {
    this.dispatchEvent(
      new CustomEvent('segmented-button-set-selection', {
        detail: {
          button: this.buttons[index],
          selected: this.buttons[index].selected,
          index,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <span
        role="group"
        @segmented-button-interaction="${this.handleSegmentedButtonInteraction}"
        aria-label=${ariaLabel || nothing}
        class="md3-segmented-button-set">
        <slot></slot>
      </span>
    `;
  }

  protected getRenderClasses() {
    return {};
  }
}
