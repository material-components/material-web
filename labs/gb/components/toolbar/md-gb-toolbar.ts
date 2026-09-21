/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ToolbarElement} from './toolbar-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design gBreeze toolbar custom element. */
    'md-gb-toolbar': ToolbarElement;
  }
}

customElements.define('md-gb-toolbar', ToolbarElement);
