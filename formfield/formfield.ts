/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Formfield} from './lib/formfield.js';
import {styles as formfieldStyles} from './lib/formfield-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-formfield': MdFormfield;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-formfield')
export class MdFormfield extends Formfield {
  static override styles = [formfieldStyles];
}
