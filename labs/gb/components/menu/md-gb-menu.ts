/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MenuElement} from './menu-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-menu': MenuElement;
  }
}

customElements.define('md-gb-menu', MenuElement);
