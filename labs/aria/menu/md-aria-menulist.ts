/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaMenulistElement} from './menulist.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-menulist': AriaMenulistElement;
  }
}

customElements.define('md-aria-menulist', AriaMenulistElement);
