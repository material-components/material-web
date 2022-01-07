/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {state} from 'lit/decorators';

import {SegmentedButton} from './segmented-button';

/** @soyCompatible */
export class SingleSelectSegmentedButton extends SegmentedButton {
  @state()
  get isMultiselect() {
    return false;
  }
}