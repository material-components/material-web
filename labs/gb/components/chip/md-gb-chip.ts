/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ChipElement} from './chip-element.js';

export * from './chip-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design Expressive Chip component. */
    'md-gb-chip': ChipElement;
  }
}

customElements.define('md-gb-chip', ChipElement);
