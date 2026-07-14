/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {RadioElement} from './radio-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-radio': RadioElement;
  }
}

customElements.define('md-gb-radio', RadioElement);
