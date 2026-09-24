/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavBarElement, NavigationBarElement} from './nav-bar-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design gBreeze navigation bar custom element. */
    'md-gb-nav-bar': NavBarElement;
    /** Alias tag name for Material Design gBreeze navigation bar. */
    'md-gb-navigation-bar': NavigationBarElement;
  }
}

if (!customElements.get('md-gb-nav-bar')) {
  customElements.define('md-gb-nav-bar', NavBarElement);
}
if (!customElements.get('md-gb-navigation-bar')) {
  customElements.define('md-gb-navigation-bar', NavigationBarElement);
}
