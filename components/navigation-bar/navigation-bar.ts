/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {NavigationBar} from './lib/navigation-bar.js';
import {styles} from './lib/navigation-bar-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-bar': MdNavigationBar;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-bar')
export class MdNavigationBar extends NavigationBar {
  static override styles = [styles];
}
