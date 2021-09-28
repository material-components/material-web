/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import {customElement} from 'lit/decorators.js';

import {styles} from './lib/switch-styles.css.js'
import {Switch} from './lib/switch.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-switch': MDSwitch;
  }
}

@customElement('md-switch')
export class MDSwitch extends Switch {
  static override styles = [styles];
}
