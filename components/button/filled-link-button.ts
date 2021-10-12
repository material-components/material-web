/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledLinkButton as FilledLinkButtonBase} from './lib/filled-link-button';
import {styles as filledStyles} from './lib/filled-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-link-button': FilledLinkButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-filled-link-button')
export class FilledLinkButton extends FilledLinkButtonBase {
  static override styles = [sharedStyles, filledStyles];
}
