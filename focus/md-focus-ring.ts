/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative} from 'lit';
import {customElement} from 'lit/decorators.js';

import {FocusRing} from './internal/focus-ring.js';
import {styles} from './internal/focus-ring-styles.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-focus-ring': MdFocusRing;
  }
}

/**
 * TODO(b/267336424): add docs
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-focus-ring')
export class MdFocusRing extends FocusRing {
  static override styles: CSSResultOrNative[] = [styles];
}
