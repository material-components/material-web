/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Menu} from './lib/menu.js';
import {styles} from './lib/menu-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-menu': MdMenu;
  }
}

@customElement('md-menu')
export class MdMenu extends Menu {
  static override styles = [styles];
}
