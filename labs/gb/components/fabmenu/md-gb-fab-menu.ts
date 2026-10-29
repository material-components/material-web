/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FabMenuElement} from './fab-menu-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design FAB menu component. */
    'md-gb-fab-menu': FabMenuElement;
  }
}

customElements.define('md-gb-fab-menu', FabMenuElement);
