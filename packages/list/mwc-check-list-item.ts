/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {CheckListItemBase} from './mwc-check-list-item-base';
import {styles as controlStyle} from './mwc-control-list-item.css';
import {styles} from './mwc-list-item.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-check-list-item': CheckListItem;
  }
}

@customElement('mwc-check-list-item')
export class CheckListItem extends CheckListItemBase {
  static override styles = [styles, controlStyle];
}
