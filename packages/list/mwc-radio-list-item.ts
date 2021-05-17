/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit-element';

import {style as controlStyle} from './mwc-control-list-item-css';
import {style} from './mwc-list-item-css';
import {RadioListItemBase} from './mwc-radio-list-item-base';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-radio-list-item': RadioListItem;
  }
}

@customElement('mwc-radio-list-item')
export class RadioListItem extends RadioListItemBase {
  static styles = [style, controlStyle];
}
