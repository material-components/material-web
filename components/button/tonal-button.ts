/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as sharedStyles} from './lib/shared-styles.css';
import {TonalButton as TonalButtonBase} from './lib/tonal-button';
import {styles as tonalStyles} from './lib/tonal-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-tonal-button': TonalButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-tonal-button')
export class TonalButton extends TonalButtonBase {
  static styles = [sharedStyles, tonalStyles];
}
