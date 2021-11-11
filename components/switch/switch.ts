/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {Switch} from './lib/switch';
import {styles} from './lib/switch-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'm3-switch': MdSwitch;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('m3-switch')
export class MdSwitch extends Switch {
  static override styles = [styles];
}
