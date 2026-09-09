/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaMenuitemElement} from './menuitem.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-menuitem': AriaMenuitemElement;
  }
}

customElements.define('md-aria-menuitem', AriaMenuitemElement);
