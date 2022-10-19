/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as sharedElevationStyles} from './lib/shared-elevation-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {TonalButton} from './lib/tonal-button.js';
import {styles as tonalStyles} from './lib/tonal-styles.css.js';

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
  static override styles = [sharedStyles, sharedElevationStyles, tonalStyles];
}
