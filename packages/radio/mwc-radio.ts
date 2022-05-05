/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {RadioBase} from './mwc-radio-base.js';
import {styles} from './mwc-radio.css.js';

export {SingleSelectionController} from './single-selection-controller.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-radio': Radio;
  }
}

@customElement('mwc-radio')
export class Radio extends RadioBase {
  static override styles = [styles];
}
