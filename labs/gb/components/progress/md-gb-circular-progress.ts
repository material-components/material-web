/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CircularProgressElement} from './circular-progress-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design circular progress component. */
    'md-gb-circular-progress': CircularProgressElement;
  }
}

customElements.define('md-gb-circular-progress', CircularProgressElement);
