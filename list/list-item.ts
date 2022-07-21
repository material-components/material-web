/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {ListItem} from './lib/listitem/list-item';
import {styles} from './lib/listitem/list-item-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item': MdListItem;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-item')
export class MdListItem extends ListItem {
  static override styles = [styles];
}
