/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SegmentedButtonSet} from './segmented-button-set';

/**
 * MultiSelectSegmentedButtonSet implements the multi-select behavior for a
 * group of two to five child segmented buttons.
 * @soyCompatible
 */
export class MultiSelectSegmentedButtonSet extends SegmentedButtonSet {
  isMultiselect = true;
}