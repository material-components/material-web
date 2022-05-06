/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators.js';

import {ListItemBase} from './mwc-list-item-base.js';
import {styles} from './mwc-list-item.css.js';

export {GraphicType, RequestSelectedDetail} from './mwc-list-item-base.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-list-item': ListItem;
  }
}

@customElement('mwc-list-item')
export class ListItem extends ListItemBase {
  static override styles = [styles];
}
