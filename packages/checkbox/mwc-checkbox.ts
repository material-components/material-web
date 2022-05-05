/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {CheckboxBase} from './mwc-checkbox-base.js';
import {styles} from './mwc-checkbox.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-checkbox': Checkbox;
  }
}

/** @soyCompatible */
@customElement('mwc-checkbox')
export class Checkbox extends CheckboxBase {
  static override styles = [styles];
}
