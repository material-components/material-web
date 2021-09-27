/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The state of the switch.
 */
export interface MDCSwitchState {
  /**
   * Indicates whether or not the switch is disabled.
   */
  disabled: boolean;
  /**
   * Indicates whether or not the switch is processing and showing a loading
   * indicator. A disabled switch cannot be processing.
   */
  processing: boolean;
  /**
   * If true, the switch is on. If false, the switch is off.
   */
  selected: boolean;
}

export interface MDCSwitchAdapter {
  /**
   * The state of the component.
   */
  state: MDCSwitchState;
}
