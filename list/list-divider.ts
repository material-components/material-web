/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {ListDivider} from './lib/divider/list-divider.js';
import {styles} from './lib/divider/list-divider-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-divider': MdListDivider;
  }
}

/**
 * @summary A horizontal list item divider.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-divider')
export class MdListDivider extends ListDivider {
  static override styles = [styles];
}
