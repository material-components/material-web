/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {BadgeElement} from './badge-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design badge component. */
    'md-gb-badge': BadgeElement;
  }
}

customElements.define('md-gb-badge', BadgeElement);
