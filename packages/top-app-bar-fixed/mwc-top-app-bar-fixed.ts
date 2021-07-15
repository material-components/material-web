/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {styles} from '@material/mwc-top-app-bar/mwc-top-app-bar.css';
import {customElement} from 'lit-element';

import {TopAppBarFixedBase} from './mwc-top-app-bar-fixed-base';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-top-app-bar-fixed': TopAppBarFixed;
  }
}

@customElement('mwc-top-app-bar-fixed')
export class TopAppBarFixed extends TopAppBarFixedBase {
  static styles = [styles];
}
