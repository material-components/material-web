/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {FocusRing} from './lib/focus-ring.js';
import {styles} from './lib/focus-ring-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-focus-ring': MdFocusRing;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-focus-ring')
export class MdFocusRing extends FocusRing {
  static override styles = [styles];
}
