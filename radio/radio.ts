/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Radio} from './internal/radio.js';
import {styles} from './internal/radio-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-radio': MdRadio;
  }
}

/**
 * @summary Radio buttons allow users to select one option from a set.
 *
 * @description
 * Radio buttons are the recommended way to allow users to make a single
 * selection from a list of options.
 *
 * Only one radio button can be selected at a time.
 *
 * Use radio buttons to:
 * - Select a single option from a set
 * - Expose all available options
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-radio')
export class MdRadio extends Radio {
  static override styles: CSSResultOrNative[] = [styles];
}
