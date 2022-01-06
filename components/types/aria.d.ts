/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * @fileoverview Provides types for `ariaX` properties. These are required when
 * typing `ariaX` properties since lit analyzer requires strict aria string
 * types.
 */

/**
 * Valid values for `aria-haspopup`.
 */
export type ARIAHasPopup =
    'false'|'true'|'menu'|'listbox'|'tree'|'grid'|'dialog';
