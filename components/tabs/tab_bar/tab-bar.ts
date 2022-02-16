/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import {customElement} from 'lit/decorators.js';

import {TabBar} from './lib/tab-bar';
import {styles} from './lib/tab-bar-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-bar': TabBar;
  }
}

@customElement('mwc-tab-bar')
export class MdTabBar extends TabBar {
  static override styles = [styles];
}
