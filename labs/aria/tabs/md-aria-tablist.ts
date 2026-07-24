/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaTablistElement} from './tablist.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-tablist': AriaTablistElement;
  }
}

customElements.define('md-aria-tablist', AriaTablistElement);
