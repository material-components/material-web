/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {TopAppBarBase} from './mwc-top-app-bar-base';
import {styles} from './mwc-top-app-bar.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-top-app-bar': TopAppBar;
  }
}

@customElement('mwc-top-app-bar')
export class TopAppBar extends TopAppBarBase {
  static override styles = [styles];
}
