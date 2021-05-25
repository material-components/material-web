/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {NotchedOutlineBase} from './mwc-notched-outline-base';
import {styles} from './mwc-notched-outline.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-notched-outline': NotchedOutline;
  }
}

@customElement('mwc-notched-outline')
export class NotchedOutline extends NotchedOutlineBase {
  static styles = [styles];
}
