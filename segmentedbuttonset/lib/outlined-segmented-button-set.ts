/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map.js';

import {SegmentedButtonSet} from './segmented-button-set.js';

/** @soyCompatible */
export class OutlinedSegmentedButtonSet extends SegmentedButtonSet {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-segmented-button-set--outlined': true,
    };
  }
}