/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {createContext} from '@lit/context';
import {type ClassInfo} from 'lit/directives/class-map.js';

import {FOCUS_RING_TYPES, focusRingClasses} from '../focus/focus-ring.js';
import {rippleClasses, setupRipple} from '../ripple/ripple.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../shared/pseudo-classes.js';

/** Whether a group of menu items are single or multiple selectable. */
export type FabMenuItemCheckable = 'single' | 'multiple';

/** Context provided to menu items for checkable state. */
export const fabMenuItemCheckable = createContext<FabMenuItemCheckable | null>(
  Symbol('fabMenuItemCheckable'),
);

/** Structural contract for menu items registered with `FabMenuContext`. */
export interface FabMenuItem extends HTMLElement {
  checked: boolean;
  disabled: boolean;
  readonly effectiveCheckable: FabMenuItemCheckable | null;
}

/** FAB menu context provided to menu items. */
export interface FabMenuContext {
  /** The item's parent menu. */
  readonly menu: HTMLElement;
  /** Returns the menu's items. */
  getItems: () => FabMenuItem[];
  /** Callback for menu items to register themselves with the menu. */
  itemConnected(item: FabMenuItem): void;
  /** Callback for menu items to unregister themselves with the menu. */
  itemDisconnected(item: FabMenuItem): void;
  /** Closes the menu. */
  close(): void;
}

/** FAB menu context to provide to menu items. */
export const fabMenuContext = createContext<FabMenuContext>(
  Symbol('fabMenuContext'),
);

/** FAB menu color configuration types. */
export type FabMenuColor = 'standard' | 'vibrant';

/** FAB menu color configurations. */
export const FAB_MENU_COLORS = {
  standard: 'standard',
  vibrant: 'vibrant',
} as const;

/** FAB menu classes. */
export const FAB_MENU_CLASSES = {
  fabMenu: 'fab-menu',
  fabMenuVibrant: 'menu-vibrant',
  open: 'open',
} as const;

/** The state provided to the `fabMenuClasses()` function. */
export interface FabMenuClassesState {
  /** The color of the menu. */
  menuColor?: FabMenuColor;
  /** Whether the menu is open. */
  open?: boolean;
}

/**
 * Returns the fab menu classes to apply to an element based on the given state.
 *
 * @param state The state of the fab menu.
 * @return An object of class names and truthy values if they apply.
 */
export function fabMenuClasses({
  menuColor,
  open = false,
}: FabMenuClassesState = {}): ClassInfo {
  return {
    [FAB_MENU_CLASSES.fabMenu]: true,
    [FAB_MENU_CLASSES.fabMenuVibrant]: menuColor === FAB_MENU_COLORS.vibrant,
    [FAB_MENU_CLASSES.open]: open,
  };
}

/**
 * A Lit directive that adds fab menu styling to its element.
 */
export const fabMenu = createClassMapDirective({
  getClasses: fabMenuClasses,
});

/** FAB menu item classes. */
export const FAB_MENU_ITEM_CLASSES = {
  fabMenuItem: 'fab-menu-item',
  checked: PSEUDO_CLASSES.checked,
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `fabMenuItemClasses()` function. */
export interface FabMenuItemClassesState {
  /** Emulates `:checked`. */
  checked?: boolean;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus`. */
  focus?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the fab menu item classes to apply to an element based on the given state.
 *
 * @param state The state of the fab menu item.
 * @return An object of class names and truthy values if they apply.
 */
export function fabMenuItemClasses({
  checked = false,
  hover = false,
  focus = false,
  active = false,
  disabled = false,
}: FabMenuItemClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses({type: FOCUS_RING_TYPES.inner}),
    [FAB_MENU_ITEM_CLASSES.fabMenuItem]: true,
    [FAB_MENU_ITEM_CLASSES.checked]: checked,
    [FAB_MENU_ITEM_CLASSES.hover]: hover,
    [FAB_MENU_ITEM_CLASSES.focus]: focus,
    [FAB_MENU_ITEM_CLASSES.active]: active,
    [FAB_MENU_ITEM_CLASSES.disabled]: disabled,
  };
}

/**
 * Sets up fab menu item functionality for the given element.
 *
 * @param item The element on which to set up fab menu item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupFabMenuItem(
  item: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(item, opts);
}

/**
 * A Lit directive that adds fab menu item styling and functionality to its element.
 */
export const fabMenuItem = createClassMapDirective({
  getClasses: fabMenuItemClasses,
  setupElement: setupFabMenuItem,
});
