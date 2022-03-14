/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import {customElement} from 'lit/decorators.js';

import {SecondaryTabBar} from './lib/secondary-tab-bar';
import {styles as tabbarStyles} from './lib/secondary-tab-bar-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-secondary-tab-bar': SecondaryTabBar;
  }
}

@customElement('md-secondary-tab-bar')
export class MdSecondaryTabBar extends SecondaryTabBar {
  static override styles = [sharedStyles, tabbarStyles];
}