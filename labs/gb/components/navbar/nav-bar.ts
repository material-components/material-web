/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {FOCUS_RING_CLASSES} from '../focus/focus-ring.js';
import {RIPPLE_CLASSES, setupRipple} from '../ripple/ripple.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Navigation bar item layout configuration types. */
export type NavBarItemLayout = 'vertical' | 'horizontal';

/** Navigation bar item layout configurations. */
export const NAV_BAR_ITEM_LAYOUTS = {
  vertical: 'vertical',
  horizontal: 'horizontal',
} as const;

/** Navigation bar classes constants. */
export const NAV_BAR_CLASSES = {
  navBar: 'nav-bar',
  navBarVertical: 'nav-bar-vertical',
  navBarHorizontal: 'nav-bar-horizontal',
} as const;

/** The state provided to the `navBarClasses()` function. */
export interface NavBarClassesState {
  /** The layout orientation of items inside the navigation bar. */
  itemLayout?: NavBarItemLayout;
}

/**
 * Returns navigation bar classes to apply based on the given state.
 *
 * @param state The state of the navigation bar.
 * @return An object of class names and truthy values if they apply.
 */
export function navBarClasses({
  itemLayout = NAV_BAR_ITEM_LAYOUTS.vertical,
}: NavBarClassesState = {}): ClassInfo {
  return {
    [NAV_BAR_CLASSES.navBar]: true,
    [NAV_BAR_CLASSES.navBarVertical]:
      itemLayout === NAV_BAR_ITEM_LAYOUTS.vertical || !itemLayout,
    [NAV_BAR_CLASSES.navBarHorizontal]:
      itemLayout === NAV_BAR_ITEM_LAYOUTS.horizontal,
  };
}

/**
 * Lit directive for navigation bar element class styling.
 *
 * @example
 * ```ts
 * html`<nav class="${navBar({itemLayout: 'vertical'})}">
 *   <button class="${navBarItem({active: true})}">Home</button>
 * </nav>`;
 * ```
 */
export const navBar = createClassMapDirective<NavBarClassesState>({
  getClasses: navBarClasses,
});

/** Navigation bar item classes constants. */
export const NAV_BAR_ITEM_CLASSES = {
  navBarItem: 'nav-bar-item',
  navBarItemActive: 'nav-bar-item-active',
  navBarItemVertical: 'nav-bar-item-vertical',
  navBarItemHorizontal: 'nav-bar-item-horizontal',
  navBarItemContent: 'nav-bar-item-content',
  navBarItemIconContainer: 'nav-bar-item-icon-container',
  navBarItemIcon: 'nav-bar-item-icon',
  navBarItemLabel: 'nav-bar-item-label',
  navBarItemBadge: 'nav-bar-item-badge',
  navBarItemBadgeDot: 'nav-bar-item-badge-dot',
} as const;

/** The state provided to the `navBarItemClasses()` function. */
export interface NavBarItemClassesState {
  /** Whether the navigation bar item is active/selected. */
  active?: boolean;
  /** The item layout orientation ('vertical' or 'horizontal'). */
  itemLayout?: NavBarItemLayout;
}

/**
 * Returns navigation bar item classes to apply based on the given state.
 *
 * @param state The state of the navigation bar item.
 * @return An object of class names and truthy values if they apply.
 */
export function navBarItemClasses({
  active = false,
  itemLayout = NAV_BAR_ITEM_LAYOUTS.vertical,
}: NavBarItemClassesState = {}): ClassInfo {
  return {
    [RIPPLE_CLASSES.ripple]: true,
    [FOCUS_RING_CLASSES.focusRingInner]: true,
    [NAV_BAR_ITEM_CLASSES.navBarItem]: true,
    [NAV_BAR_ITEM_CLASSES.navBarItemActive]: Boolean(active),
    [NAV_BAR_ITEM_CLASSES.navBarItemVertical]:
      itemLayout === NAV_BAR_ITEM_LAYOUTS.vertical || !itemLayout,
    [NAV_BAR_ITEM_CLASSES.navBarItemHorizontal]:
      itemLayout === NAV_BAR_ITEM_LAYOUTS.horizontal,
  };
}

/**
 * Sets up navigation bar item functionality for the given element.
 *
 * @param item The element on which to set up navigation bar item functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupNavBarItem(
  item: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(item, opts);
}

/**
 * Lit directive for navigation bar item element class styling.
 */
export const navBarItem = createClassMapDirective<NavBarItemClassesState>({
  getClasses: navBarItemClasses,
  setupElement: setupNavBarItem,
});
