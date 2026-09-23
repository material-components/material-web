/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Unique symbols for members that the menu elements share with
 * each other but that are not part of any of their public APIs.
 */

/** Defined by `AriaMenuitemElement`. */
export const updateUsedValues = Symbol('updateUsedValues');

/** Defined by `AriaMenuitemElement`. */
export const setCheckedness = Symbol('setCheckedness');

/** Defined by `AriaFieldsetElement`. */
export const resetMenuitemCheckedness = Symbol('resetMenuitemCheckedness');
