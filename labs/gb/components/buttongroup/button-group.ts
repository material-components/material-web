/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../shared/pseudo-classes.js';

/** Button group variant layout types. */
export type ButtonGroupVariant = 'standard' | 'connected';

/** Button group selection types. */
export type ButtonGroupSelection = 'none' | 'single' | 'multiple';

/** Button group variant layout configurations. */
export const BUTTON_GROUP_VARIANTS = {
  standard: 'standard',
  connected: 'connected',
} as const;

/** Button group selection configurations. */
export const BUTTON_GROUP_SELECTIONS = {
  none: 'none',
  single: 'single',
  multiple: 'multiple',
} as const;

/** Button group classes. */
export const BUTTON_GROUP_CLASSES = {
  btnGroup: 'btn-group',
  btnGroupStandard: 'btn-group-standard',
  btnGroupConnected: 'btn-group-connected',
  disabled: PSEUDO_CLASSES.disabled,
};

/** The state provided to the `buttonGroupClasses()` function. */
export interface ButtonGroupClassesState {
  /** The visual variant of the button group. Defaults to `'standard'`. */
  variant?: ButtonGroupVariant;
  /** Whether the button group is disabled. */
  disabled?: boolean;
}

/**
 * Returns the button group classes to apply to an element based on the given state.
 *
 * @param state The state of the button group.
 * @return An object of class names and truthy values if they apply.
 */
export function buttonGroupClasses({
  variant = 'standard',
  disabled = false,
}: ButtonGroupClassesState = {}): ClassInfo {
  return {
    [BUTTON_GROUP_CLASSES.btnGroup]: true,
    [BUTTON_GROUP_CLASSES.btnGroupStandard]: variant === 'standard' || !variant,
    [BUTTON_GROUP_CLASSES.btnGroupConnected]: variant === 'connected',
    [BUTTON_GROUP_CLASSES.disabled]: disabled,
  };
}

/**
 * A Lit directive that applies button group classes.
 */
export const buttonGroup = createClassMapDirective<ButtonGroupClassesState>({
  getClasses: buttonGroupClasses,
});

/**
 * An item managed by a ButtonGroup.
 */
export interface ButtonGroupItem {
  selected?: boolean;
  disabled?: boolean;
  softDisabled?: boolean;
  href?: string;
}

/**
 * Checks if a ButtonGroupItem is selectable.
 * Disabled, soft-disabled, or link items are not selectable.
 */
export function isItemSelectable(item: ButtonGroupItem): boolean {
  return !item.disabled && !item.softDisabled && !item.href;
}

/** Options provided to the `normalizeSelection()` function. */
export interface NormalizeSelectionOptions<
  T extends ButtonGroupItem = ButtonGroupItem,
> {
  /** The selection mode. */
  selection?: ButtonGroupSelection;
  /** Whether selection is required in single-select mode. */
  required?: boolean;
  /** The item preferred to keep selected during normalization. */
  preferred?: T;
}

/**
 * Pure selection normalization logic for button groups.
 *
 * - In 'none' mode: clears all selected items.
 * - In 'single' mode: enforces at most 1 item selected.
 *   - If preferred is given and selected, keeps preferred and clears others.
 *   - Otherwise keeps the last selected item and clears earlier ones.
 *   - If required is true and 0 items are selected, auto-selects the first selectable item.
 * - In 'multiple' mode: items keep their selected states as is.
 *
 * Mutates `item.selected` in place.
 */
export function normalizeSelection<T extends ButtonGroupItem>(
  items: T[],
  options: NormalizeSelectionOptions<T>,
): void {
  const {selection = 'none', required = false, preferred} = options;

  if (selection === 'none') {
    for (const item of items) {
      item.selected = false;
    }
    return;
  }

  if (selection === 'single') {
    const selectedItems = items.filter((item) => item.selected);

    if (selectedItems.length > 1) {
      const itemToKeep =
        preferred && preferred.selected
          ? preferred
          : selectedItems[selectedItems.length - 1];
      for (const item of items) {
        item.selected = item === itemToKeep;
      }
    } else if (selectedItems.length === 0 && required) {
      const firstSelectable = items.find(isItemSelectable);
      if (firstSelectable) {
        firstSelectable.selected = true;
      }
    }
    return;
  }
}

/** Options provided to the `shouldBlockToggle()` function. */
export interface ShouldBlockToggleOptions {
  /** The selection mode. */
  selection?: ButtonGroupSelection;
  /** Whether selection is required in single-select mode. */
  required?: boolean;
}

/**
 * Pure helper to determine if a toggle interaction on item `i` should be blocked.
 *
 * In required single-select mode, clicking an already selected button must not deselect it,
 * ensuring exactly 1 item remains selected at all times.
 */
export function shouldBlockToggle(
  items: ButtonGroupItem[],
  i: number,
  options: ShouldBlockToggleOptions,
): boolean {
  const {selection = 'none', required = false} = options;
  if (selection === 'single' && required) {
    return Boolean(items[i]?.selected);
  }
  return false;
}
