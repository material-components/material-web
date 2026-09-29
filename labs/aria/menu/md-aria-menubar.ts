/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaMenubarElement} from './menubar.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-menubar': AriaMenubarElement;
  }
}

customElements.define('md-aria-menubar', AriaMenubarElement);
