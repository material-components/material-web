/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {NavigationBar} from './lib/navigation-bar';
import {styles} from './lib/navigation-bar-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-bar': MDNavigationBar;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-bar')
export class MDNavigationBar extends NavigationBar {
  static override styles = [styles];
}
