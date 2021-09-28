/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {OutlinedButton as OutlinedButtonBase} from './lib/outlined-button';
import {styles as outlinedStyles} from './lib/outlined-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-button': OutlinedButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-outlined-button')
export class OutlinedButton extends OutlinedButtonBase {
  static override styles = [sharedStyles, outlinedStyles];
}
