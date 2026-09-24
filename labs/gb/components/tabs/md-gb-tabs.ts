/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TabsElement} from './tabs-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design tabs component. */
    'md-gb-tabs': TabsElement;
  }
}

customElements.define('md-gb-tabs', TabsElement);
