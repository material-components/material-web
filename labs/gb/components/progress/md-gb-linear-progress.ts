/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LinearProgressElement} from './linear-progress-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design linear progress component. */
    'md-gb-linear-progress': LinearProgressElement;
  }
}

customElements.define('md-gb-linear-progress', LinearProgressElement);
