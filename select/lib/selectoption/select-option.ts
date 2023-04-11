/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';

import {MenuItemEl} from '../../../menu/lib/menuitem/menu-item.js';
import {ARIARole} from '../../../types/aria.js';
import {RequestDeselectionEvent, RequestSelectionEvent, SelectOption} from '../shared.js';

/**
 * @fires close-menu {CloseMenuEvent} Closes the encapsulating menu on
 * @fires request-selection {RequestSelectionEvent} Requests the parent
 * md-select to select this element (and deselect others if single-selection)
 * when `selected` changed to `true`.
 * @fires request-deselection {RequestDeselectionEvent} Requests the parent
 * md-select to deselect this element when `selected` changed to `false`.
 */
export class SelectOptionEl extends MenuItemEl implements SelectOption {
  override role: ARIARole = 'option';

  /**
   * Form value of the option.
   */
  @property() value = '';

  /**
   * Whether or not this option is selected.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has('selected')) {
      // Synchronize selected -> active but not the other way around because
      // active is used for keyboard navigation and doesn't mean the option
      // should be selected if active.
      this.active = this.selected;
      this.ariaSelected = this.selected ? 'true' : 'false';
      // By default active = true focuses the element. We want to prevent that
      // in this case because we set active = this.selected and that may mess
      // around with menu's restore focus function once the menu closes.
      this.focusOnSelection = false;
    }

    super.willUpdate(changed);
  }

  override updated(changed: PropertyValues<this>) {
    super.updated(changed);
    // Restore the active = true focusing behavior which happens in
    // super.updated() if it was turned off.
    this.focusOnSelection = true;

    // Do not dispatch event on first update / boot-up.
    if (changed.has('selected') && changed.get('selected') !== undefined) {
      // This section is really useful for when the user sets selected on the
      // option programmatically. Most other cases (click and keyboard) are
      // handled by md-select because it needs to coordinate the
      // single-selection behavior.
      if (this.selected) {
        this.dispatchEvent(new RequestSelectionEvent());
      } else {
        this.dispatchEvent(new RequestDeselectionEvent());
      }
    }
  }
}
