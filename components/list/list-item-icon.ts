/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {ListItemIcon} from './lib/list-item-icon';
import {styles} from './lib/list-item-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item-icon': MdListItemIcon;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-item-icon')
export class MdListItemIcon extends ListItemIcon {
  static override styles = [styles];
}
