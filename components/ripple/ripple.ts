/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {Ripple} from './lib/ripple.js';
import {styles} from './lib/ripple-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-ripple': MdRipple;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-ripple')
export class MdRipple extends Ripple {
  static override styles = [styles];
}