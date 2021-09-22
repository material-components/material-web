/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {FormfieldBase} from './lib/formfield-base.js';
import {styles} from './lib/formfield-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-formfield': MDFormfield;
  }
}

@customElement('md-formfield')
export class MDFormfield extends FormfieldBase {
  static styles = [styles];
}
