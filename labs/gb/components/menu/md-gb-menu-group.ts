/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MenuGroupElement} from './menu-group-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-menu-group': MenuGroupElement;
  }
}

customElements.define('md-gb-menu-group', MenuGroupElement);
