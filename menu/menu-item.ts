/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles} from '../list/lib/listitem/list-item-styles.css';

import {MenuItem} from './lib/menuitem/menu-item';

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-item': MdMenuItem;
  }
}

@customElement('md-menu-item')
export class MdMenuItem extends MenuItem {
  static override styles = [styles];
}
