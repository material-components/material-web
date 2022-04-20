/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {MultiSelectSegmentedButton} from './segmented-button';

/** @soyCompatible */
export class OutlinedMultiSelectSegmentedButton extends
    MultiSelectSegmentedButton {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-segmented-button--outlined': true,
    };
  }
}