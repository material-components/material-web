/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ListItem} from '../../list/lib/listitem/list-item.js';

/**
 * Interface specific to menu item and not list item.
 */
interface MenuItemSelf {
  /**
   * The visible headline text of the item.
   */
  headline: string;
  /**
   * Whether or not the item is the currently active item of interest (focuses
   * upon activation).
   */
  active: boolean;
  /**
   * Whether or not the item is in the selected visual state.
   */
  selected?: boolean;
  /**
   * If it is a sub-menu-item, a method that can close the submenu.
   */
  close?: () => void;
  /**
   * Focuses the item.
   */
  focus: () => void;
}

/**
 * The interface of every menu item interactive with a menu. All menu items
 * should implement this interface to be compatible with md-menu. Additionally
 * they should have both the `md-menu-item` and `md-list-item` attributes set.
 */
export type MenuItem = MenuItemSelf&ListItem;

/**
 * The reason the `close-menu` event was dispatched.
 */
export interface Reason {
  kind: string;
}

/**
 * The click selection reason for the `close-menu` event. The menu was closed
 * because an item was selected via user click.
 */
export interface ClickReason extends Reason {
  kind: typeof CLOSE_REASON.CLICK_SELECTION;
}

/**
 * The keydown reason for the `close-menu` event. The menu was closed
 * because a specific key was pressed. The default closing keys for
 * `md-menu-item` are, Space, Enter or Escape.
 */
export interface KeydownReason extends Reason {
  kind: typeof CLOSE_REASON.KEYDOWN;
  key: string;
}

/**
 * The default menu closing reasons for the material md-menu package.
 */
export type DefaultReasons = ClickReason|KeydownReason;

/**
 * The event that closes any parent menus. It is recommended to subclass and
 * dispatch this event rather than creating your own `close-menu` event.
 */
export class CloseMenuEvent<T extends Reason = DefaultReasons> extends Event {
  readonly itemPath: MenuItem[];
  constructor(public initiator: MenuItem, readonly reason: T) {
    super('close-menu', {bubbles: true, composed: true});
    this.itemPath = [initiator];
  }
}

/**
 * The event that signals to the menu that it should stay open on the focusout
 * event.
 */
export class StayOpenOnFocusoutEvent extends Event {
  constructor() {
    super('stay-open-on-focusout', {bubbles: true, composed: true});
  }
}

/**
 * The event that signals to the menu that it should close open on the focusout
 * event.
 */
export class CloseOnFocusoutEvent extends Event {
  constructor() {
    super('close-on-focusout', {bubbles: true, composed: true});
  }
}

/**
 * The default close menu event used by md-menu. To create your own `close-menu`
 * event, you should subclass the `CloseMenuEvent` instead.
 */
// tslint:disable-next-line
export const DefaultCloseMenuEvent = CloseMenuEvent<DefaultReasons>;

/**
 * The event that requests the parent md-menu to deactivate all other items.
 */
export class DeactivateItemsEvent extends Event {
  constructor() {
    super('deactivate-items', {bubbles: true, composed: true});
  }
}

/**
 * Requests the typeahead functionality of containing menu be deactivated.
 */
export class DeactivateTypeaheadEvent extends Event {
  constructor() {
    super('deactivate-typeahead', {bubbles: true, composed: true});
  }
}

/**
 * Requests the typeahead functionality of containing menu be activated.
 */
export class ActivateTypeaheadEvent extends Event {
  constructor() {
    super('activate-typeahead', {bubbles: true, composed: true});
  }
}

/**
 * Keys that are used to navigate menus.
 */
export const NAVIGABLE_KEY = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
} as const;

/**
 * Keys that are used for selection in menus.
 */
export const SELECTION_KEY = {
  SPACE: 'Space',
  ENTER: 'Enter',
} as const;

/**
 * Default close `Reason` kind values.
 */
export const CLOSE_REASON = {
  CLICK_SELECTION: 'CLICK_SELECTION',
  KEYDOWN: 'KEYDOWN',
} as const;

/**
 * Keys that can close menus.
 */
export const KEYDOWN_CLOSE_KEYS = {
  ESCAPE: 'Escape',
  SPACE: SELECTION_KEY.SPACE,
  ENTER: SELECTION_KEY.ENTER,
} as const;

type Values<T> = T[keyof T];

/**
 * Determines whether the given key code is a key code that should close the
 * menu.
 *
 * @param code The KeyboardEvent code to check.
 * @return Whether or not the key code is in the predetermined list to close the
 * menu.
 */
export function isClosableKey(code: string):
    code is Values<typeof KEYDOWN_CLOSE_KEYS> {
  return Object.values(KEYDOWN_CLOSE_KEYS).some(value => (value === code));
}

/**
 * Determines whether the given key code is a key code that should select a menu
 * item.
 *
 * @param code They KeyboardEvent code to check.
 * @return Whether or not the key code is in the predetermined list to select a
 * menu item.
 */
export function isSelectableKey(code: string):
    code is Values<typeof SELECTION_KEY> {
  return Object.values(SELECTION_KEY).some(value => (value === code));
}

/**
 * Determines whether a target element is contained inside another element's
 * composed tree.
 *
 * @param target The potential contained element.
 * @param container The potential containing element of the target.
 * @returns Whether the target element is contained inside the container's
 * composed subtree
 */
export function isElementInSubtree(
    target: EventTarget, container: EventTarget) {
  // Dispatch a composed, bubbling event to check its path to see if the
  // newly-focused element is contained in container's subtree
  const focusEv = new Event('md-contains', {bubbles: true, composed: true});
  let composedPath: EventTarget[] = [];
  const listener = (ev: Event) => {
    composedPath = ev.composedPath();
  };

  container.addEventListener('md-contains', listener);
  target.dispatchEvent(focusEv);
  container.removeEventListener('md-contains', listener);

  const isContained = composedPath.length > 0;
  return isContained;
}
