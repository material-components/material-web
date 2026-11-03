/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {AriaSliderElement} from './slider.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-aria-slider': AriaSliderElement;
  }
}

customElements.define('md-aria-slider', AriaSliderElement);
