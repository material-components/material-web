/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as sharedElevationStyles} from './lib/shared-elevation-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {TonalLinkButton} from './lib/tonal-link-button.js';
import {styles as tonalStyles} from './lib/tonal-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-tonal-link-button': MdTonalLinkButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-tonal-link-button')
export class MdTonalLinkButton extends TonalLinkButton {
  static override styles = [sharedStyles, sharedElevationStyles, tonalStyles];
}
