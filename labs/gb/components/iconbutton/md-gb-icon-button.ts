/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {IconButtonElement} from './icon-button-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design component. */
    'md-gb-icon-button': IconButtonElement;
  }
}

customElements.define('md-gb-icon-button', IconButtonElement);
