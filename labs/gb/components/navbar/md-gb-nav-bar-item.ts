/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NavBarItemElement,
  NavigationBarItemElement,
} from './nav-bar-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design gBreeze navigation bar item custom element. */
    'md-gb-nav-bar-item': NavBarItemElement;
    /** Alias tag name for Material Design gBreeze navigation bar item. */
    'md-gb-navigation-bar-item': NavigationBarItemElement;
  }
}

if (!customElements.get('md-gb-nav-bar-item')) {
  customElements.define('md-gb-nav-bar-item', NavBarItemElement);
}
if (!customElements.get('md-gb-navigation-bar-item')) {
  customElements.define('md-gb-navigation-bar-item', NavigationBarItemElement);
}
