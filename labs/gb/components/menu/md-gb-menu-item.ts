/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MenuItemElement} from './menu-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-menu-item': MenuItemElement;
  }
}

customElements.define('md-gb-menu-item', MenuItemElement);
