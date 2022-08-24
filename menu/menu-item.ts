/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles} from '../list/lib/listitem/list-item-styles.css.js';

import {MenuItem} from './lib/menuitem/menu-item.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-item': MdMenuItem;
  }
}

@customElement('md-menu-item')
export class MdMenuItem extends MenuItem {
  static override styles = [styles];
}
