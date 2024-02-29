/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {NavigationBar} from './internal/navigation-bar.js';
import {styles} from './internal/navigation-bar-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-bar': MdNavigationBar;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-bar')
export class MdNavigationBar extends NavigationBar {
  static override styles: CSSResultOrNative[] = [styles];
}
