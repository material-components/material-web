/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {NavigationTab} from './lib/navigation-tab.js';
import {styles} from './lib/navigation-tab-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-tab': MdNavigationTab;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-navigation-tab')
export class MdNavigationTab extends NavigationTab {
  static override styles = [styles];
}
