/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {NavigationDrawer} from './lib/navigation-drawer.js';
import {styles} from './lib/navigation-drawer-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

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
  static override readonly styles = [sharedStyles, styles];
}
