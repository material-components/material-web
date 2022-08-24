/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {SegmentedButton} from './segmented-button.js';

/** @soyCompatible */
export class OutlinedSegmentedButton extends SegmentedButton {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-segmented-button--outlined': true,
    };
  }

  /** @soyTemplate */
  protected override renderOutline(): TemplateResult {
    return html`<span class="md3-segmented-button__outline"></span>`;
  }
}