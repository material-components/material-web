/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The interface for the foundation of MDC's progress indicators.
 *
 * @public
 */
export interface MDCProgressIndicatorFoundation {
  /**
   * Toggles the component between the determinate and indeterminate state.
   *
   * @param isDeterminate - Whether the component is in determinate state
   */
  setDeterminate(isDeterminate: boolean): void;

  /**
   * @return Whether the component is determinate.
   */
  isDeterminate(): boolean;

  /**
   * Sets the current progress value.
   *
   * @param value - the current progress value, should be between [0,1]
   */
  setProgress(value: number): void;

  /**
   * @return the current progress value [0,1];
   */
  getProgress(): number;

  /**
   * Puts the component in the open state.
   */
  open(): void;

  /**
   * Puts the component in the closed state.
   */
  close(): void;

  /**
   * @return Whether the component is closed.
   */
  isClosed(): boolean;
}
