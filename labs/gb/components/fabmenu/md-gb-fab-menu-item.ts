/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FabMenuItemElement} from './fab-menu-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design FAB menu item component. */
    'md-gb-fab-menu-item': FabMenuItemElement;
  }
}

customElements.define('md-gb-fab-menu-item', FabMenuItemElement);
