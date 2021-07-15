/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {CheckboxBase} from './mwc-checkbox-base';
import {styles} from './mwc-checkbox.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-checkbox': Checkbox;
  }
}

/** @soyCompatible */
@customElement('mwc-checkbox')
export class Checkbox extends CheckboxBase {
  static styles = [styles];
}
