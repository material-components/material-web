/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Cross-component classes for emulating pseudo-classes.
 *
 * All components that style with psuedo-classes for their DOM structure also
 * support emulating these states.
 *
 * @example
 * ```html
 * <button class="ripple active">Pressed ripple</button>
 * ```
 */
export const PSEUDO_CLASSES = {
  active: 'active',
  checked: 'checked',
  disabled: 'disabled',
  focus: 'focus',
  focusVisible: 'focus-visible',
  hover: 'hover',
  indeterminate: 'indeterminate',
  invalid: 'invalid',
};
