/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {Radio} from './lib/radio';
import {styles} from './lib/radio-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-radio': MdRadio;
  }
}

/** @soyCompatible */
@customElement('md-radio')
export class MdRadio extends Radio {
  static override styles = [styles];
}
