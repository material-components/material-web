/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A theme mapping of token name (not custom property name) to stringified CSS
 * value.
 */
export interface Theme {
  [tokenName: string]: string;
}

/**
 * Requests the global theme listener change the theme due to a color change.
 */
export class ChangeColorEvent extends Event {
  /**
   * @param color The new source color to apply.
   */
  constructor(public color: string) {
    super('change-color', {bubbles: true, composed: true});
  }
}

/**
 * Requests the global theme listener change the theme due to a dark mode
 * change.
 */
export class ChangeDarkModeEvent extends Event {
  /**
   * @param mode The new color mode to apply.
   */
  constructor(public mode: 'light' | 'dark' | 'auto') {
    super('change-mode', {bubbles: true, composed: true});
  }
}

declare global {
  interface HTMLElementEventMap {
    'change-color': ChangeColorEvent;
    'change-mode': ChangeDarkModeEvent;
  }
}
