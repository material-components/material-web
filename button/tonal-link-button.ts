/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles as sharedStyles} from './lib/shared-styles.css';
import {TonalLinkButton} from './lib/tonal-link-button';
import {styles as tonalStyles} from './lib/tonal-styles.css';

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
  static override styles = [sharedStyles, tonalStyles];
}
