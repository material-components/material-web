/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {SegmentedButtonState} from '../../segmented_button/lib/state.js';

/** The state of a set of segmented buttons. */
export interface SegmentedButtonSetState {
  buttons: SegmentedButtonState[];
  readonly isRTL: boolean;
  readonly isMultiselect: boolean;
}

/** The state plus side-effects for a set of segmented buttons. */
export interface SegmentedButtonSetAdapter {
  state: SegmentedButtonSetState;
  focusButton(index: number): void;
}
