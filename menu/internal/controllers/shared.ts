/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';

import {MenuItem} from './menuItemController.js';
import type {Corner, SurfacePositionTarget} from './surfacePositionController.js';

/**
 * The interface needed for a Menu to work with other md-menu elements.
 */
export interface MenuSelf {
  /**
   * Whether or not the menu is currently opened.
   */
  open: boolean;
  /**
   * Skips the opening and closing animations.
   */
  quick: boolean;
  /**
   * Displays overflow content like a submenu.
   *
   * __NOTE__: This may cause adverse effects if you set
   * `md-menu {max-height:...}`
   * and have items overflowing items in the "y" direction.
   */
  hasOverflow: boolean;
  /**
   * Communicates to the menu that it is a submenu and should not handle the
   * ArrowLeft button in LTR and ArrowRight button in RTL.
   */
  isSubmenu: boolean;
  /**
   * After closing, does not restore focus to the last focused element before
   * the menu was opened.
   */
  skipRestoreFocus: boolean;
  /**
   * The corner of the anchor in which the menu should anchor to.
   */
  anchorCorner: Corner;
  /**
   * The corner of the menu in which the menu should anchor from.
   */
  menuCorner: Corner;
  /**
   * The element the menu should anchor to.
   */
  anchorElement: (HTMLElement & Partial<SurfacePositionTarget>) | null;
  /**
   * What the menu should focus by default when opened.
   */
  defaultFocus: FocusState;
  /**
   * An array of items managed by the list.
   */
  items: MenuItem[];
  /**
   * The positioning strategy of the menu.
   *
   * - `absolute` is relative to the anchor element.
   * - `fixed` is relative to the window
   * - `document` is relative to the document
   */
  positioning?: 'absolute' | 'fixed' | 'document';
  /**
   * Opens the menu.
   */
  show: () => void;
  /**
   * Closes the menu.
   */
  close: () => void;
}

/**
 * The interface needed for a Menu to work with other md-menu elements. Useful
 * for keeping your types safe when wrapping `md-menu`.
 */
export type Menu = MenuSelf & LitElement;

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
  kind: typeof CloseReason.CLICK_SELECTION;
}

/**
 * The keydown reason for the `close-menu` event. The menu was closed
 * because a specific key was pressed. The default closing keys for
 * `md-menu-item` are, Space, Enter or Escape.
 */
export interface KeydownReason extends Reason {
  kind: typeof CloseReason.KEYDOWN;
  key: string;
}

/**
 * The default menu closing reasons for the material md-menu package.
 */
export type DefaultReasons = ClickReason | KeydownReason;

/**
 * Creates an event that closes any parent menus.
 */
export function createCloseMenuEvent<T extends Reason = DefaultReasons>(
  initiator: MenuItem,
  reason: T,
) {
  return new CustomEvent<{
    initiator: MenuItem;
    itemPath: MenuItem[];
    reason: T;
  }>('close-menu', {
    bubbles: true,
    composed: true,
    detail: {initiator, reason, itemPath: [initiator]},
  });
}

/**
 * Creates an event that signals to the menu that it should stay open on the
 * focusout event.
 */
export function createStayOpenOnFocusoutEvent() {
  return new Event('stay-open-on-focusout', {bubbles: true, composed: true});
}

/**
 * Creates an event that signals to the menu that it should close open on the
 * focusout event.
 */
export function createCloseOnFocusoutEvent() {
  return new Event('close-on-focusout', {bubbles: true, composed: true});
}

/**
 * Creates a default close menu event used by md-menu.
 */
export const createDefaultCloseMenuEvent = createCloseMenuEvent<DefaultReasons>;

/**
 * The type of the default close menu event used by md-menu.
 */
// tslint:disable-next-line
export type CloseMenuEvent<T extends Reason = DefaultReasons> = ReturnType<
  typeof createCloseMenuEvent<T>
>;

/**
 * Creates an event that requests the given item be selected.
 */
export function createDeactivateTypeaheadEvent() {
  return new Event('deactivate-typeahead', {bubbles: true, composed: true});
}

/**
 * The type of the event that requests the typeahead functionality of containing
 * menu be deactivated.
 */
export type DeactivateTypeaheadEvent = ReturnType<
  typeof createDeactivateTypeaheadEvent
>;

/**
 * Creates an event that requests the typeahead functionality of containing menu
 * be activated.
 */
export function createActivateTypeaheadEvent() {
  return new Event('activate-typeahead', {bubbles: true, composed: true});
}

/**
 * The type of the event that requests the typeahead functionality of containing
 * menu be activated.
 */
export type ActivateTypeaheadEvent = ReturnType<
  typeof createActivateTypeaheadEvent
>;

/**
 * Keys that are used to navigate menus.
 */
// tslint:disable-next-line:enforce-name-casing We are mimicking enum style
export const NavigableKey = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
} as const;

/**
 * Keys that are used for selection in menus.
 */
// tslint:disable-next-line:enforce-name-casing We are mimicking enum style
export const SelectionKey = {
  SPACE: 'Space',
  ENTER: 'Enter',
} as const;

/**
 * Default close `Reason` kind values.
 */
// tslint:disable-next-line:enforce-name-casing We are mimicking enum style
export const CloseReason = {
  CLICK_SELECTION: 'click-selection',
  KEYDOWN: 'keydown',
} as const;

/**
 * Keys that can close menus.
 */
// tslint:disable-next-line:enforce-name-casing We are mimicking enum style
export const KeydownCloseKey = {
  ESCAPE: 'Escape',
  SPACE: SelectionKey.SPACE,
  ENTER: SelectionKey.ENTER,
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
export function isClosableKey(
  code: string,
): code is Values<typeof KeydownCloseKey> {
  return Object.values(KeydownCloseKey).some((value) => value === code);
}

/**
 * Determines whether the given key code is a key code that should select a menu
 * item.
 *
 * @param code They KeyboardEvent code to check.
 * @return Whether or not the key code is in the predetermined list to select a
 * menu item.
 */
export function isSelectableKey(
  code: string,
): code is Values<typeof SelectionKey> {
  return Object.values(SelectionKey).some((value) => value === code);
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
  target: EventTarget,
  container: EventTarget,
) {
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

/**
 * Element to focus on when menu is first opened.
 */
// tslint:disable-next-line:enforce-name-casing We are mimicking enum style
export const FocusState = {
  NONE: 'none',
  LIST_ROOT: 'list-root',
  FIRST_ITEM: 'first-item',
  LAST_ITEM: 'last-item',
} as const;

/**
 * Element to focus on when menu is first opened.
 */
export type FocusState = (typeof FocusState)[keyof typeof FocusState];
