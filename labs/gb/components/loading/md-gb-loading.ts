/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LoadingElement} from './loading-element.js';

export {LoadingElement};

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design loading custom element. */
    'md-gb-loading': LoadingElement;
  }
}

if (!customElements.get('md-gb-loading')) {
  customElements.define('md-gb-loading', LoadingElement);
}
