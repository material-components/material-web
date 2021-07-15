/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {RadioBase} from './mwc-radio-base';
import {styles} from './mwc-radio.css';

export {SingleSelectionController} from './single-selection-controller';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-radio': Radio;
  }
}

@customElement('mwc-radio')
export class Radio extends RadioBase {
  static styles = [styles];
}
