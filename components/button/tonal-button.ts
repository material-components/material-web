/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles as sharedStyles} from './lib/shared-styles.css';
import {TonalButton} from './lib/tonal-button';
import {styles as tonalStyles} from './lib/tonal-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-tonal-button': MdTonalButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-tonal-button')
export class MdTonalButton extends TonalButton {
  static override styles = [sharedStyles, tonalStyles];
}
