/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {Switch} from './lib/switch';
import {styles} from './lib/switch-styles.css'

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MDSwitch;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-switch')
export class MDSwitch extends Switch {
  static override styles = [styles];
}
