/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaFieldsetElement} from './fieldset.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-fieldset': AriaFieldsetElement;
  }
}

customElements.define('md-aria-fieldset', AriaFieldsetElement);
