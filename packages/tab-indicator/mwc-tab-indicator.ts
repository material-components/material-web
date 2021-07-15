/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {TabIndicatorBase} from './mwc-tab-indicator-base';
import {styles} from './mwc-tab-indicator.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-indicator': TabIndicator;
  }
}

@customElement('mwc-tab-indicator')
export class TabIndicator extends TabIndicatorBase {
  static styles = [styles];
}
