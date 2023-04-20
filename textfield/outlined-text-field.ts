/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../field/outlined-field.js';

import {customElement} from 'lit/decorators.js';

import {styles as outlinedForcedColorsStyles} from './lib/outlined-forced-colors-styles.css.js';
import {styles as outlinedStyles} from './lib/outlined-styles.css.js';
import {OutlinedTextField} from './lib/outlined-text-field.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

export {TextFieldType} from './lib/text-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-text-field': MdOutlinedTextField;
  }
}

/**
 * TODO(b/228525797): Add docs
 * @final
 * @suppress {visibility}
 */
@customElement('md-outlined-text-field')
export class MdOutlinedTextField extends OutlinedTextField {
  static override styles =
      [sharedStyles, outlinedStyles, outlinedForcedColorsStyles];
}
