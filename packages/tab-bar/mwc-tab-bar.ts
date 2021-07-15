/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {TabBarBase} from './mwc-tab-bar-base';
import {styles} from './mwc-tab-bar.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-bar': TabBar;
  }
}

@customElement('mwc-tab-bar')
export class TabBar extends TabBarBase {
  static styles = [styles];
}
