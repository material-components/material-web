/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SegmentedButtonSet} from './segmented-button-set';

/** @soyCompatible */
export class SingleSelectSegmentedButtonSet extends SegmentedButtonSet {
  isMultiselect = false;
}