/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ButtonGroupElement} from './button-group-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design button group. */
    'md-gb-button-group': ButtonGroupElement;
  }
}

customElements.define('md-gb-button-group', ButtonGroupElement);
