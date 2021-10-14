/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {FocusRing} from './lib/focus-ring';
import {styles as focusRingStyles} from './lib/focus-ring-styles.css';

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
  static override styles = [focusRingStyles];
}
