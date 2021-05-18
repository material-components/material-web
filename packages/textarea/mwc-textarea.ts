/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {styles as textfieldStyles} from '@material/mwc-textfield/mwc-textfield.css';
import {customElement} from 'lit-element';
import {TextAreaBase, TextAreaCharCounter, TextFieldInputMode, TextFieldType} from './mwc-textarea-base';
import {styles as textareaStyles} from './mwc-textarea.css';

export {TextAreaCharCounter, TextFieldInputMode, TextFieldType};

declare global {
  interface HTMLElementTagNameMap {
    'mwc-textarea': TextArea;
  }
}

/** @soyCompatible */
@customElement('mwc-textarea')
export class TextArea extends TextAreaBase {
  static styles = [textfieldStyles, textareaStyles];
}
