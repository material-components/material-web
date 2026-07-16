/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Divider classes. */
export const DIVIDER_CLASSES = {
  divider: 'divider',
  dividerVertical: 'divider-vertical',
} as const;

/** The state provided to the `dividerClasses()` function. */
export interface DividerClassesState {
  /** Whether the divider is vertical. */
  vertical?: boolean;
}

/**
 * Returns the divider classes to apply to an element based on the given state.
 *
 * @param state The state of the divider.
 * @return An object of class names and truthy values if they apply.
 */
export function dividerClasses({
  vertical = false,
}: DividerClassesState = {}): ClassInfo {
  return {
    [DIVIDER_CLASSES.divider]: true,
    [DIVIDER_CLASSES.dividerVertical]: vertical,
  };
}

/**
 * A Lit directive that adds divider styling to its element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="flex flex-col">
 *     <div>Vertical</div>
 *     <hr class="${divider()}">
 *     <div>Items</div>
 *   </div>
 *
 *   <div class="flex flex-row">
 *     <div>Horizontal</div>
 *     <hr class="${divider({vertical: true})}">
 *     <div>Items</div>
 *   </div>
 * `;
 * ```
 */
export const divider = createClassMapDirective({
  getClasses: dividerClasses,
});
