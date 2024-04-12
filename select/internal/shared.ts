/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SelectOption} from './selectoption/select-option.js';

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
