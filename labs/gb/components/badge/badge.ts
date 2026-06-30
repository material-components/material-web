/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Badge classes. */
export const BADGE_CLASSES = {
  badge: 'badge',
} as const;

/**
 * Returns the badge classes to apply to an element.
 *
 * @return An object of class names and truthy values if they apply.
 */
export function badgeClasses(): ClassInfo {
  return {
    [BADGE_CLASSES.badge]: true,
  };
}

/**
 * A Lit directive that adds badge styling to its element.
 *
 * @example
 * ```ts
 * html`<div class="${badge()}">1</div>`;
 * ```
 */
export const badge = createClassMapDirective({
  getClasses: badgeClasses,
});
