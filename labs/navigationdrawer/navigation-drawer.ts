/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {NavigationDrawer} from './internal/navigation-drawer.js';
import {styles} from './internal/navigation-drawer-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-drawer': MdNavigationDrawer;
  }
}

/**
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-drawer')
export class MdNavigationDrawer extends NavigationDrawer {
  static override readonly styles = [sharedStyles, styles];
}
