/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ListElement} from './list-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-list': ListElement;
  }
}

customElements.define('md-gb-list', ListElement);
