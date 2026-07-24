/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaTabElement} from './tab.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-tab': AriaTabElement;
  }
}

customElements.define('md-aria-tab', AriaTabElement);
