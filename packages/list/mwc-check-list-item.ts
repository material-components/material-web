/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit-element';

import {CheckListItemBase} from './mwc-check-list-item-base';
import {style as controlStyle} from './mwc-control-list-item-css';
import {style} from './mwc-list-item-css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-check-list-item': CheckListItem;
  }
}

@customElement('mwc-check-list-item')
export class CheckListItem extends CheckListItemBase {
  static styles = [style, controlStyle];
}
