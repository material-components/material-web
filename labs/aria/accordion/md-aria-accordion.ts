/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaAccordionElement} from './accordion.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-accordion': AriaAccordionElement;
  }
}

customElements.define('md-aria-accordion', AriaAccordionElement);
