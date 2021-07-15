/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit-element';

import {ListItemBase} from './mwc-list-item-base';
import {styles} from './mwc-list-item.css';

export {GraphicType, RequestSelectedDetail} from './mwc-list-item-base';
declare global {
  interface HTMLElementTagNameMap {
    'mwc-list-item': ListItem;
  }
}

@customElement('mwc-list-item')
export class ListItem extends ListItemBase {
  static styles = [styles];
}
