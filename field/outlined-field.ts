/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {OutlinedField} from './internal/outlined-field.js';
import {styles as outlinedStyles} from './internal/outlined-styles.js';
import {styles as sharedStyles} from './internal/shared-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-field': MdOutlinedField;
  }
}

/**
 * TODO(b/228525797): add docs
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-field')
export class MdOutlinedField extends OutlinedField {
  static override styles: CSSResultOrNative[] = [sharedStyles, outlinedStyles];
}
