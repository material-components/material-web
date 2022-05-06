/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map.js';

import {SingleSelectSegmentedButton} from './single-select-segmented-button.js';

/** @soyCompatible */
export class OutlinedSingleSelectSegmentedButton extends
    SingleSelectSegmentedButton {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-segmented-button--outlined': true,
    };
  }
}