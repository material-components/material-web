/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavBarItemElement} from './nav-bar-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design gBreeze navigation bar item custom element. */
    'md-gb-nav-bar-item': NavBarItemElement;
  }
}

if (!customElements.get('md-gb-nav-bar-item')) {
  customElements.define('md-gb-nav-bar-item', NavBarItemElement);
}
