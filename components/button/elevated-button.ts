/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {ElevatedButton as ElevatedButtonBase} from './lib/elevated-button';
import {styles as elevatedStyles} from './lib/elevated-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevated-button': ElevatedButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-elevated-button')
export class ElevatedButton extends ElevatedButtonBase {
  static override styles = [sharedStyles, elevatedStyles];
}
