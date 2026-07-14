/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ListItemElement} from './list-item-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-list-item': ListItemElement;
  }
}

customElements.define('md-gb-list-item', ListItemElement);
