/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {List} from './lib/list.js';
import {styles} from './lib/list-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-list': MdList;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-list')
export class MdList extends List {
  static override styles = [styles];
}
