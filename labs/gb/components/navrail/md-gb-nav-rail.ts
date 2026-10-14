/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavRailElement} from './nav-rail-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design navigation rail custom element. */
    'md-gb-nav-rail': NavRailElement;
  }
}

if (!customElements.get('md-gb-nav-rail')) {
  customElements.define('md-gb-nav-rail', NavRailElement);
}
