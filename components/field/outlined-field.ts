/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {OutlinedField} from './lib/outlined-field';
import {styles as outlinedStyles} from './lib/outlined-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-field': MdOutlinedField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {const}
 */
@customElement('md-outlined-field')
export class MdOutlinedField extends OutlinedField {
  static styles = [sharedStyles, outlinedStyles];
}
