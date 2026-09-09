/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {DividerElement} from './divider-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-divider': DividerElement;
  }
}

customElements.define('md-gb-divider', DividerElement);
