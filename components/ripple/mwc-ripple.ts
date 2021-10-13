/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {RippleBase} from './mwc-ripple-base';
import {styles} from './mwc-ripple.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-ripple': Ripple;
  }
}

/** @soyCompatible */
@customElement('md-ripple')
export class Ripple extends RippleBase {
  static override styles = [styles];
}
