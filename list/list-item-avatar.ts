/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {ListItemAvatar} from './lib/avatar/list-item-avatar';
import {styles} from './lib/avatar/list-item-avatar-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item-avatar': MdListItemAvatar;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-item-avatar')
export class MdListItemAvatar extends ListItemAvatar {
  static override styles = [styles];
}
