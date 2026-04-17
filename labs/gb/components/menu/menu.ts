/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {createContext} from '@lit/context';
import {
  FOCUS_RING_TYPES,
  focusRingClasses,
} from '@material/web/labs/gb/components/focus/focus-ring.js';
import {
  rippleClasses,
  setupRipple,
} from '@material/web/labs/gb/components/ripple/ripple.js';
import {createClassMapDirective} from '@material/web/labs/gb/components/shared/directives.js';
import {PSEUDO_CLASSES} from '@material/web/labs/gb/components/shared/pseudo-classes.js';
import {type ClassInfo} from 'lit/directives/class-map.js';

/** Menu context provided to menu items. */
export interface MenuContext {
  /** The item's parent menu. */
  readonly menu: HTMLElement;
  /** Returns the menu's items. */
  getItems: () => HTMLElement[];
  /** Callback for menu items to register themselves with the menu. */
  itemConnected(item: HTMLElement): void;
  /** Callback for menu items to unregister themselves with the menu. */
  itemDisconnected(item: HTMLElement): void;
}

/** Menu context to provide to menu items. */
export const menuContext = createContext<MenuContext>(Symbol('menuContext'));

/** Menu color configuration types. */
export type MenuColor = 'standard' | 'vibrant';

/** Menu color configurations. */
export const MENU_COLORS = {
  standard: 'standard',
  vibrant: 'vibrant',
} as const;

/** Menu classes. */
export const MENU_CLASSES = {
  menu: 'menu',
  menuVibrant: 'menu-vibrant',
} as const;

/** The state provided to the `menuClasses()` function. */
export interface MenuClassesState {
  /** The color of the menu. */
  color?: MenuColor;
}

/**
 * Returns the menu classes to apply to an element based on the given state.
 *
 * @param state The state of the menu.
 * @return An object of class names and truthy values if they apply.
 */
export function menuClasses({color}: MenuClassesState = {}): ClassInfo {
  return {
    [MENU_CLASSES.menu]: true,
    [MENU_CLASSES.menuVibrant]: color === MENU_COLORS.vibrant,
  };
}

/**
 * Sets up menu functionality for the given element.
 *
 * @param menu The element on which to set up menu functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupMenu(
  menu: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  // TODO: add event listeners from <md-menu>
}

/**
 * A Lit directive that adds menu styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<div class="${menu()}">TODO: add examples</div>`;
 * ```
 */
export const menu = createClassMapDirective({
  getClasses: menuClasses,
  setupElement: setupMenu,
});

/** Whether a group of menu items are single or multiple selectable. */
export type MenuItemCheckable = 'single' | 'multiple';

/** Context provided to menu items for the checkable state of a menu item group. */
export const menuItemCheckable = createContext<MenuItemCheckable | null>(
  Symbol('menuItemCheckable'),
);

/** Menu item classes. */
export const MENU_ITEM_CLASSES = {
  menuItem: 'menu-item',
  checked: PSEUDO_CLASSES.checked,
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `menuItemClasses()` function. */
export interface MenuItemClassesState {
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
 * Returns the menu item classes to apply to an element based on the given
 * state.
 *
 * @param state The state of the menu item.
 * @return An object of class names and truthy values if they apply.
 */
export function menuItemClasses({
  checked = false,
  hover = false,
  focus = false,
  active = false,
  disabled = false,
}: MenuItemClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses({type: FOCUS_RING_TYPES.inner}),
    [MENU_ITEM_CLASSES.menuItem]: true,
    [MENU_ITEM_CLASSES.checked]: checked,
    [MENU_ITEM_CLASSES.hover]: hover,
    [MENU_ITEM_CLASSES.focus]: focus,
    [MENU_ITEM_CLASSES.active]: active,
    [MENU_ITEM_CLASSES.disabled]: disabled,
  };
}

/**
 * Sets up menu item functionality for the given element.
 *
 * @param menuItem The element on which to set up menu item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupMenuItem(
  menuItem: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(menuItem, opts);
}

/**
 * A Lit directive that adds menu item styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<div class="${menuItem()}">TODO: add examples</div>`;
 * ```
 */
export const menuItem = createClassMapDirective({
  getClasses: menuItemClasses,
  setupElement: setupMenuItem,
});
