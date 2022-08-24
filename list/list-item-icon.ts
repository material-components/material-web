/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {ListItemIcon} from './lib/icon/list-item-icon.js';
import {styles} from './lib/icon/list-item-icon-styles.css.js';

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
