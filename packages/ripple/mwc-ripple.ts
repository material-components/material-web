/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {customElement} from 'lit-element';

import {RippleBase} from './mwc-ripple-base';
import {styles} from './mwc-ripple.css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-ripple': Ripple;
  }
}

/** @soyCompatible */
@customElement('mwc-ripple')
export class Ripple extends RippleBase {
  static styles = [styles];
}
