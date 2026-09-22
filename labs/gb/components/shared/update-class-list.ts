/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';

/**
 * Updates an element's class list based on a key-value set of class names to
 * truthy values.
 *
 * Adds class names where the value is truthy, and removes class names where the
 * value is falsy.
 *
 * Note: this function only iterates keys present in `classInfo`. A key that
 * disappears from the record across calls will NOT be removed (unlike Lit's
 * `classMap` directive, which retains previous state). Callers must ensure
 * the same class keys are provided in all calls to the function.
 *
 * @param element The element whose class list will be updated.
 * @param classInfo A ClassInfo record representing classes to toggle.
 */
export function updateClassList(element: Element, classInfo: ClassInfo): void {
  for (const [name, value] of Object.entries(classInfo)) {
    element.classList.toggle(name, Boolean(value));
  }
}
