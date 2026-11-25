/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './md-gb-segmented-button.js';

import {SegmentedButtonSetElement} from './segmented-button-set-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design segmented button set component. */
    'md-gb-segmented-button-set': SegmentedButtonSetElement;
  }
}

customElements.define('md-gb-segmented-button-set', SegmentedButtonSetElement);
