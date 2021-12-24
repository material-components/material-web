/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {NavigationDrawer} from './lib/navigation-drawer';
import {styles} from './lib/navigation-drawer-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-drawer': MdNavigationDrawer;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-drawer')
export class MdNavigationDrawer extends NavigationDrawer {
  static override readonly styles = [styles];
}
