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
  badgeLarge: 'badge-large',
} as const;

/** The state provided to the `badgeClasses()` function. */
export interface BadgeClassesState {
  /** Whether the badge is large. */
  large?: boolean;
}

/**
 * Returns the badge classes to apply to an element.
 *
 * @param state The state of the badge.
 * @return An object of class names and truthy values if they apply.
 */
export function badgeClasses({
  large = false,
}: BadgeClassesState = {}): ClassInfo {
  return {
    [BADGE_CLASSES.badge]: true,
    [BADGE_CLASSES.badgeLarge]: large,
  };
}

/**
 * A Lit directive that adds badge styling to its element.
 *
 * @example
 * ```ts
 * html`<span class="${badge({large: true})}">1</span>`;
 * ```
 */
export const badge = createClassMapDirective<BadgeClassesState>({
  getClasses: badgeClasses,
});
