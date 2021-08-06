/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit-element';

import {SwitchBase} from './mwc-switch-base';
import {styles} from './styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-switch': Switch;
  }
}

/** @soyCompatible */
@customElement('mwc-switch')
export class Switch extends SwitchBase {
  static styles = [styles];
}
