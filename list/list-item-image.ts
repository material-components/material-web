/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {ListItemImage} from './lib/image/list-item-image';
import {styles} from './lib/image/list-item-image-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item-image': MdListItemImage;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-item-image')
export class MdListItemImage extends ListItemImage {
  static override styles = [styles];
}
