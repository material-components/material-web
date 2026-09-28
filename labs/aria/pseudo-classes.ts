/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns whether the element is disabled.
 *
 * Checks if the element matches any of the following:
 * - `.disabled` class
 * - `:disabled` pseudo-class
 * - `:state(disabled)` pseudo-class
 * - `[disabled]` attribute
 * - `[aria-disabled=true]` attribute
 *
 * @param element The element to check.
 * @return true if the element is disabled.
 */
export function isDisabled(element: Element): boolean {
  return element.matches(
    '.disabled,:disabled,:state(disabled),[disabled],[aria-disabled=true]',
  );
}
