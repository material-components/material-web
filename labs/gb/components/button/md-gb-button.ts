/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ButtonElement} from './button-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design button. */
    'md-gb-button': ButtonElement;
  }
}

customElements.define('md-gb-button', ButtonElement);
