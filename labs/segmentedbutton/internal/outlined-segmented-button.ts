/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {SegmentedButton} from './segmented-button.js';

/**
 * b/265346443 - add docs
 */
export class OutlinedSegmentedButton extends SegmentedButton {
  protected override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'md3-segmented-button--outlined': true,
    };
  }

  protected override renderOutline() {
    return html`<span class="md3-segmented-button__outline"></span>`;
  }
}
