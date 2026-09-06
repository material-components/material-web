/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavigationBar} from '../../navigationbar/internal/navigation-bar.js';

/**
 * Base class for the vertical Material 3 navigation rail.
 */
export class NavigationRail extends NavigationBar {
  protected override navigationDirection = 'vertical' as const;
}
