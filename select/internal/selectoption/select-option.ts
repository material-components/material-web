/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';

import {MenuItemEl} from '../../../menu/internal/menuitem/menu-item.js';
import {createRequestDeselectionEvent, createRequestSelectionEvent, SelectOption} from '../shared.js';

/**
 * @fires close-menu Closes the encapsulating menu on
 * @fires request-selection Requests the parent md-select to select this element
 * (and deselect others if single-selection) when `selected` changed to `true`.
 * @fires request-deselection Requests the parent md-select to deselect this
 * element when `selected` changed to `false`.
 */
export class SelectOptionEl extends MenuItemEl implements SelectOption {
  /**
   * Form value of the option.
   */
  @property() value = '';

  override readonly type = 'option';

  private internalDisplayText: string|null = null;

  /**
   * The text that is displayed in the select field when selected. If not set,
   * defaults to the textContent of the item slotted into the `"headline"` slot.
   */
  get displayText() {
    if (this.internalDisplayText !== null) {
      return this.internalDisplayText;
    }

    const headlineElement = this.headlineElements[0];

    if (headlineElement) {
      return (headlineElement.textContent ?? '').trim();
    }

    return '';
  }

  set displayText(text: string) {
    this.internalDisplayText = text;
  }

  override willUpdate(changed: PropertyValues<SelectOptionEl>) {
    if (changed.has('selected')) {
      this.ariaSelected = this.selected ? 'true' : 'false';
    }

    super.willUpdate(changed);
  }

  override updated(changed: PropertyValues<SelectOptionEl>) {
    super.updated(changed);

    // Do not dispatch event on first update / boot-up.
    if (changed.has('selected') && changed.get('selected') !== undefined) {
      // This section is really useful for when the user sets selected on the
      // option programmatically. Most other cases (click and keyboard) are
      // handled by md-select because it needs to coordinate the
      // single-selection behavior.
      if (this.selected) {
        this.dispatchEvent(createRequestSelectionEvent());
      } else {
        this.dispatchEvent(createRequestDeselectionEvent());
      }
    }
  }

  protected override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      selected: this.selected,
    };
  }
}
