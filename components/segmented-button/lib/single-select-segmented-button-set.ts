/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {state} from 'lit/decorators';

import {SegmentedButtonSet} from './segmented-button-set';

/** @soyCompatible */
export class SingleSelectSegmentedButtonSet extends SegmentedButtonSet {
  @state()
  get isMultiselect() {
    return false;
  }
}