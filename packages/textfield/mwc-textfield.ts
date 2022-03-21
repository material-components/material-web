/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {customElement} from 'lit/decorators';

import {TextAreaCharCounter, TextFieldBase, TextFieldInputMode, TextFieldType} from './mwc-textfield-base';
import {styles} from './mwc-textfield.css';

export {TextAreaCharCounter, TextFieldInputMode, TextFieldType};

declare global {
  interface HTMLElementTagNameMap {
    'mwc-textfield': TextField;
  }
}

/** @soyCompatible */
@customElement('mwc-textfield')
export class TextField extends TextFieldBase {
  static override styles = [styles];
}
