/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SliderElement} from './slider-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A gBreeze Slider component. */
    'md-gb-slider': SliderElement;
  }
}

customElements.define('md-gb-slider', SliderElement);
