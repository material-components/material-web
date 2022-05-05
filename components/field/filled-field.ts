/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledField} from './lib/filled-field.js';
import {styles as filledStyles} from './lib/filled-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-field': MdFilledField;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-field')
export class MdFilledField extends FilledField {
  static override styles = [sharedStyles, filledStyles];
}
