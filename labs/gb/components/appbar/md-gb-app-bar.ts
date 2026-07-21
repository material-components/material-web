/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AppBarElement} from './app-bar-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design app bar component. */
    'md-gb-app-bar': AppBarElement;
  }
}

customElements.define('md-gb-app-bar', AppBarElement);
