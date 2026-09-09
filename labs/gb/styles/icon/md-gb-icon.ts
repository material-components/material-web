/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {IconElement} from './icon-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design icon component. */
    'md-gb-icon': IconElement;
  }
}

customElements.define('md-gb-icon', IconElement);
