/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SwitchElement} from './switch-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-switch': SwitchElement;
  }
}

customElements.define('md-gb-switch', SwitchElement);
