/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {applyThemeString} from '../utils/apply-theme-string.js';

// Checks if there has been a theme already generated from a prior visit
const lastThemeString = localStorage.getItem('material-theme');

// Applies the theme string to the document if available.
if (lastThemeString) {
  applyThemeString(document, lastThemeString);
}
