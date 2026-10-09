/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SheetElement} from './sheet-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design sheet custom element. */
    'md-gb-sheet': SheetElement;
  }
}

customElements.define('md-gb-sheet', SheetElement);
