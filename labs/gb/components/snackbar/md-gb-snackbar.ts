/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SnackbarElement} from './snackbar-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design snackbar component. */
    'md-gb-snackbar': SnackbarElement;
  }
}

customElements.define('md-gb-snackbar', SnackbarElement);
