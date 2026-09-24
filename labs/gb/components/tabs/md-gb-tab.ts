/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TabElement} from './tab-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design tab component. */
    'md-gb-tab': TabElement;
  }
}

customElements.define('md-gb-tab', TabElement);
