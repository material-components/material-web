/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles} from './lib/listitem/list-item-styles.css'
import {OptionListItem} from './lib/listitem/option-list-item';

declare global {
  interface HTMLElementTagNameMap {
    'md-option-list-item': MdOptionListItem;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-option-list-item')
export class MdOptionListItem extends OptionListItem {
  static override styles = [styles];
}
