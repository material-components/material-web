/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FilledButton as FilledButtonBase} from './lib/filled-button';
import {styles as filledStyles} from './lib/filled-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-button': FilledButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-filled-button')
export class FilledButton extends FilledButtonBase {
  static styles = [sharedStyles, filledStyles];
}
