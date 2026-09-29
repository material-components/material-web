/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaProgressElement} from './progress.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-progress': AriaProgressElement;
  }
}

customElements.define('md-aria-progress', AriaProgressElement);
