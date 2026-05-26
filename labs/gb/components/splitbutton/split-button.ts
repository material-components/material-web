/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {createClassMapDirective} from '../shared/directives.js';
import {type ClassInfo} from 'lit/directives/class-map.js';

/** Split Button color configuration types. */
export type SplitButtonColor = 'filled' | 'elevated' | 'tonal' | 'outlined';

/** Split Button size configuration types. */
export type SplitButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Split Button classes. */
export const SPLIT_BUTTON_CLASSES = {
  splitButton: 'split-btn',
  splitButtonSelected: 'split-btn-selected',
} as const;

/** The state provided to the `splitButtonClasses()` function. */
export interface SplitButtonClassesState {
  /** Whether the split trailing button is selected. */
  selected?: boolean;
}

/**
 * Returns the split button classes to apply to an element based on the given
 * state.
 *
 * @param state The state of the split button.
 * @return An object of class names and truthy values if they apply.
 */
export function splitButtonClasses({
  selected = false,
}: SplitButtonClassesState = {}): ClassInfo {
  return {
    [SPLIT_BUTTON_CLASSES.splitButton]: true,
    [SPLIT_BUTTON_CLASSES.splitButtonSelected]: selected,
  };
}

/**
 * A Lit directive that adds split button styling and functionality to its
 * element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${splitButton()}">
 *     <button class="${button({color: 'filled'})}">Label</button>
 *     <button class="${button({color: 'filled'})}" popovertarget="menu"></button>
 *     <md-menu id="menu">
 *       <md-menu-item>Option 1</md-menu-item>
 *       <md-menu-item>Option 2</md-menu-item>
 *     </md-menu>
 *   </div>
 * `;
 * ```
 */
export const splitButton = createClassMapDirective({
  getClasses: splitButtonClasses,
});
