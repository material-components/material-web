/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {MenuButton} from './lib/menu-button';
import {styles} from './lib/menu-button-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-button': MdMenuButton;
  }
}

@customElement('md-menu-button')
export class MdMenuButton extends MenuButton {
  static override styles = [styles];
}
