/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {DialogBase} from './mwc-dialog-base';
import {styles} from './mwc-dialog.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-dialog': Dialog;
  }
}

@customElement('mwc-dialog')
export class Dialog extends DialogBase {
  static styles = [styles];
}
