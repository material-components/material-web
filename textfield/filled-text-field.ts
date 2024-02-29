/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/filled-field.js';

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';

import {styles as filledStyles} from './internal/filled-styles.js';
import {FilledTextField} from './internal/filled-text-field.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

export {type TextFieldType} from './internal/text-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-text-field': MdFilledTextField;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-text-field')
export class MdFilledTextField extends FilledTextField {
  static override styles: CSSResultOrNative[] = [sharedStyles, filledStyles];

  protected override readonly fieldTag = literal`md-filled-field`;
}
