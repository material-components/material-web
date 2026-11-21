/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SegmentedButtonElement} from './segmented-button-element.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design segmented button component. */
    'md-gb-segmented-button': SegmentedButtonElement;
  }
}

customElements.define('md-gb-segmented-button', SegmentedButtonElement);
