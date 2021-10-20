/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {NavigationTab} from './lib/navigation-tab';
import {styles} from './lib/navigation-tab-styles.css';

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
