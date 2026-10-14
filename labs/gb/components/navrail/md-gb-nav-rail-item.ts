/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavRailItemElement} from './nav-rail-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design navigation rail item custom element. */
    'md-gb-nav-rail-item': NavRailItemElement;
  }
}

if (!customElements.get('md-gb-nav-rail-item')) {
  customElements.define('md-gb-nav-rail-item', NavRailItemElement);
}
