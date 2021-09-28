/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles as sharedStyles} from './lib/shared-styles.css';
import {TextButton as TextButtonBase} from './lib/text-button';
import {styles as textStyles} from './lib/text-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-text-button': TextButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-text-button')
export class TextButton extends TextButtonBase {
  static override styles = [sharedStyles, textStyles];
}
