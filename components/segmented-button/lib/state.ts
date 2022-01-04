/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** The state of a segmented button. */
export interface SegmentedButtonState {
  disabled: boolean;
  label?: string;
  selected: boolean;
  focusable: boolean;
}

/** The state plus side-effects for a segmented button. */
export interface SegmentedButtonAdapter {
  state: SegmentedButtonState;
  animateSelection(...args: Parameters<Animatable['animate']>):
      Promise<Animation>;
}

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
