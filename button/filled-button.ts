/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {FilledButton} from './lib/filled-button';
import {styles as filledStyles} from './lib/filled-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-button': MdFilledButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-button')
export class MdFilledButton extends FilledButton {
  static override styles = [sharedStyles, filledStyles];
}
