/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '@material/web/types/aria';
import {property} from 'lit/decorators';

import {List} from './list';
import {OptionListItem} from './listitem/option-list-item';

/** @soyCompatible */
export class OptionList extends List {
  override role: ARIARole = 'listbox';
  override items: OptionListItem[] = [];

  @property({type: String}) override listItemTagName = 'md-option-list-item';

  override handleAction(event: CustomEvent) {
    const selectedItem: OptionListItem = event.detail.item;

    for (const item of this.items) {
      if (item === selectedItem) {
        item.ariaSelected = 'true';
      } else {
        item.ariaSelected = 'false';
      }
    }
  }
}
