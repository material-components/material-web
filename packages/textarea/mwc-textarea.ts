/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {styles as textfieldStyles} from '@material/mwc-textfield/mwc-textfield.css.js';
import {customElement} from 'lit/decorators.js';

import {TextAreaBase, TextAreaCharCounter, TextFieldInputMode, TextFieldType} from './mwc-textarea-base.js';
import {styles as textareaStyles} from './mwc-textarea.css.js';

export {TextAreaCharCounter, TextFieldInputMode, TextFieldType};

declare global {
  interface HTMLElementTagNameMap {
    'mwc-textarea': TextArea;
  }
}

/** @soyCompatible */
@customElement('mwc-textarea')
export class TextArea extends TextAreaBase {
  static override styles = [textfieldStyles, textareaStyles];
}
