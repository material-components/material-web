/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {FilledLinkButton} from './lib/filled-link-button';
import {styles as filledStyles} from './lib/filled-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-link-button': MdFilledLinkButton;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-filled-link-button')
export class MdFilledLinkButton extends FilledLinkButton {
  static override styles = [sharedStyles, filledStyles];
}
