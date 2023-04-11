/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MenuItem} from '../../menu/lib/shared.js';

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
}

/**
 * The interface to implement for a select option. Additionally, the element
 * must have `md-list-item` and `md-menu-item` attributes on the host.
 */
export type SelectOption = SelectOptionSelf&MenuItem;

/**
 * A type that describes a SelectOption and its index.
 */
export type SelectOptionRecord = [SelectOption, number];

/**
 * Given a list of select options, this function will return an array of
 * SelectOptionRecords that are selected.
 * 
 * @return An array of SelectOptionRecords describing the options that are
 * selected.
 */
export function getSelectedItems(items: SelectOption[]) {
  const selectedItemRecords: SelectOptionRecord[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.selected) {
      selectedItemRecords.push([item, i]);
    }
  }

  return selectedItemRecords;
}

/**
 * An event fired by a SelectOption to request selection from md-select.
 * Typically fired after `selected` changes from `false` to `true`.
 */
export class RequestSelectionEvent extends Event {
  constructor() {
    super('request-selection', {bubbles: true, composed: true});
  }
}

/**
 * An event fired by a SelectOption to request deselection from md-select.
 * Typically fired after `selected` changes from `true` to `false`.
 */
export class RequestDeselectionEvent extends Event {
  constructor() {
    super('request-deselection', {bubbles: true, composed: true});
  }
}
