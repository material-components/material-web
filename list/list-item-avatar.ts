/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {ListItemAvatar} from './lib/avatar/list-item-avatar.js';
import {styles} from './lib/avatar/list-item-avatar-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item-avatar': MdListItemAvatar;
  }
}

/**
 * @summary An image avatar that is expected to be slotted into a list item.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-item-avatar')
export class MdListItemAvatar extends ListItemAvatar {
  static override styles = [styles];
}
