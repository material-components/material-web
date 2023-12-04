/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ReactiveController, ReactiveControllerHost} from 'lit';

import {
  MenuItem,
  MenuItemController,
  MenuItemControllerConfig,
} from '../../../menu/internal/controllers/menuItemController.js';

/**
 * The interface specific to a Select Option
 */
interface SelectOptionSelf {
  /**
   * The form value associated with the Select Option. (Note: the visual portion
   * of the SelectOption is the headline defined in ListItem)
   */
  value: string;
  /**
   * Whether or not the SelectOption is selected.
   */
  selected: boolean;
  /**
   * The text to display in the select when selected. Defaults to the
   * textContent of the Element slotted into the headline.
   */
  displayText: string;
}

/**
 * The interface to implement for a select option. Additionally, the element
 * must have `md-list-item` and `md-menu-item` attributes on the host.
 */
export type SelectOption = SelectOptionSelf & MenuItem;

/**
 * Creates an event fired by a SelectOption to request selection from md-select.
 * Typically fired after `selected` changes from `false` to `true`.
 */
export function createRequestSelectionEvent() {
  return new Event('request-selection', {
    bubbles: true,
    composed: true,
  });
}

/**
 * Creates an event fired by a SelectOption to request deselection from
 * md-select. Typically fired after `selected` changes from `true` to `false`.
 */
export function createRequestDeselectionEvent() {
  return new Event('request-deselection', {
    bubbles: true,
    composed: true,
  });
}

/**
 * The options used to inialize SelectOptionController.
 */
export type SelectOptionConfig = MenuItemControllerConfig;

/**
 * A controller that provides most functionality and md-select compatibility for
 * an element that implements the SelectOption interface.
 */
export class SelectOptionController implements ReactiveController {
  private readonly menuItemController: MenuItemController;
  private internalDisplayText: string | null = null;
  private lastSelected = this.host.selected;
  private firstUpdate = true;

  /**
   * The recommended role of the select option.
   */
  get role() {
    return this.menuItemController.role;
  }

  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot, and if there are
   * no slotted elements into headline, then it checks the _default_ slot, and
   * then the `"supporting-text"` slot if nothing is in _default_.
   */
  get typeaheadText() {
    return this.menuItemController.typeaheadText;
  }

  setTypeaheadText(text: string) {
    this.menuItemController.setTypeaheadText(text);
  }

  /**
   * The text that is displayed in the select field when selected. If not set,
   * defaults to the textContent of the item slotted into the `"headline"` slot,
   * and if there are no slotted elements into headline, then it checks the
   * _default_ slot, and then the `"supporting-text"` slot if nothing is in
   * _default_.
   */
  get displayText() {
    if (this.internalDisplayText !== null) {
      return this.internalDisplayText;
    }

    return this.menuItemController.typeaheadText;
  }

  setDisplayText(text: string) {
    this.internalDisplayText = text;
  }

  /**
   * @param host The SelectOption in which to attach this controller to.
   * @param config The object that configures this controller's behavior.
   */
  constructor(
    private readonly host: ReactiveControllerHost & SelectOption,
    config: SelectOptionConfig,
  ) {
    this.menuItemController = new MenuItemController(host, config);
    host.addController(this);
  }

  hostUpdate() {
    if (this.lastSelected !== this.host.selected) {
      this.host.ariaSelected = this.host.selected ? 'true' : 'false';
    }
  }

  hostUpdated() {
    // Do not dispatch event on first update / boot-up.
    if (this.lastSelected !== this.host.selected && !this.firstUpdate) {
      // This section is really useful for when the user sets selected on the
      // option programmatically. Most other cases (click and keyboard) are
      // handled by md-select because it needs to coordinate the
      // single-selection behavior.
      if (this.host.selected) {
        this.host.dispatchEvent(createRequestSelectionEvent());
      } else {
        this.host.dispatchEvent(createRequestDeselectionEvent());
      }
    }

    this.lastSelected = this.host.selected;
    this.firstUpdate = false;
  }

  /**
   * Bind this click listener to the interactive element. Handles closing the
   * menu.
   */
  onClick = () => {
    this.menuItemController.onClick();
  };

  /**
   * Bind this click listener to the interactive element. Handles closing the
   * menu.
   */
  onKeydown = (e: KeyboardEvent) => {
    this.menuItemController.onKeydown(e);
  };
}
