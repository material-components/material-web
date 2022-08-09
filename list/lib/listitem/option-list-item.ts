/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '@material/web/types/aria';

import {ListItem} from './list-item';

/** @soyCompatible */
export class OptionListItem extends ListItem {
  override role: ARIARole = 'option';

  override handleClick(e: MouseEvent) {
    this.dispatchEvent(new CustomEvent(
        'list-item-interaction',
        {detail: {state: {isSelected: false}}, bubbles: true, composed: true}));
    super.handleClick(e);
  }
}
