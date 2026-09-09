/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaTabpanelElement} from './tabpanel.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-tabpanel': AriaTabpanelElement;
  }
}

customElements.define('md-aria-tabpanel', AriaTabpanelElement);
