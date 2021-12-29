/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {IconButton} from './lib/icon-button';
import {styles} from './lib/icon-button-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-icon-button': MdIconButton;
  }
}

@customElement('md-icon-button')
export class MdIconButton extends IconButton {
  static override styles = [styles];
}
