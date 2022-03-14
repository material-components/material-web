/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {PrimaryTabBar} from './lib/primary-tab-bar';
import {styles as tabbarStyles} from './lib/primary-tab-bar-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-primary-tab-bar': PrimaryTabBar;
  }
}

@customElement('md-primary-tab-bar')
export class MdPrimaryTabBar extends PrimaryTabBar {
  static override styles = [sharedStyles, tabbarStyles];
}
