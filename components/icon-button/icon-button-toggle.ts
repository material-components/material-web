/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {styles} from './lib/icon-button-styles.css';
import {IconButtonToggle} from './lib/icon-button-toggle';

declare global {
  interface HTMLElementTagNameMap {
    'md-icon-button-toggle': MdIconButtonToggle;
  }
}

@customElement('md-icon-button-toggle')
export class MdIconButtonToggle extends IconButtonToggle {
  static override styles = [styles];
}
