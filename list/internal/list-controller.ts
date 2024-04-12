/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  activateFirstItem,
  activateLastItem,
  activateNextItem,
  activatePreviousItem,
  getActiveItem,
  getFirstActivatableItem,
  ListItem,
} from './list-navigation-helpers.js';

// TODO: move this file to List and make List use this

/**
 * Default keys that trigger navigation.
 */
// tslint:disable:enforce-name-casing Following Enum style
export const NavigableKeys = {
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowUp: 'ArrowUp',
  ArrowRight: 'ArrowRight',
  Home: 'Home',
  End: 'End',
} as const;
// tslint:enable:enforce-name-casing

/**
 * Default set of navigable keys.
 */
export type NavigableKeys = (typeof NavigableKeys)[keyof typeof NavigableKeys];

/**
 * The configuration object to customize the behavior of the List Controller
 */
export interface ListControllerConfig<Item extends ListItem> {
  /**
   * A function that determines whether or not the given element is an Item
   */
  isItem: (item: HTMLElement) => item is Item;
  /**
   * A function that returns an array of elements to consider as items. For
   * example, all the slotted elements.
   */
  getPossibleItems: () => HTMLElement[];
  /**
   * A function that returns whether or not the list is in an RTL context.
   */
  isRtl: () => boolean;
  /**
   * Deactivates an item such as setting the tabindex to -1 and or sets selected
   * to false.
   */
  deactivateItem: (item: Item) => void;
  /**
   * Activates an item such as setting the tabindex to 1 and or sets selected to
   * true (but does not focus).
   */
  activateItem: (item: Item) => void;
  /**
   * Whether or not the key should be handled by the list for navigation.
   */
  isNavigableKey: (key: string) => boolean;
  /**
   * Whether or not the item can be activated. Defaults to items that are not
   * disabled.
   */
  isActivatable?: (item: Item) => boolean;
  /**
   * Whether or not navigating past the end of the list wraps to the beginning
   * and vice versa. Defaults to true.
   */
  wrapNavigation?: () => boolean;
}

/**
 * A controller that handles list keyboard navigation and item management.
 */
export class ListController<Item extends ListItem> {
  isItem: (item: HTMLElement) => item is Item;
  private readonly getPossibleItems: () => HTMLElement[];
  private readonly isRtl: () => boolean;
  private readonly deactivateItem: (item: Item) => void;
  private readonly activateItem: (item: Item) => void;
  private readonly isNavigableKey: (key: string) => boolean;
  private readonly isActivatable?: (item: Item) => boolean;
  private readonly wrapNavigation: () => boolean;

  constructor(config: ListControllerConfig<Item>) {
    const {
      isItem,
      getPossibleItems,
      isRtl,
      deactivateItem,
      activateItem,
      isNavigableKey,
      isActivatable,
      wrapNavigation,
    } = config;
    this.isItem = isItem;
    this.getPossibleItems = getPossibleItems;
    this.isRtl = isRtl;
    this.deactivateItem = deactivateItem;
    this.activateItem = activateItem;
    this.isNavigableKey = isNavigableKey;
    this.isActivatable = isActivatable;
    this.wrapNavigation = wrapNavigation ?? (() => true);
  }

  /**
   * The items being managed by the list. Additionally, attempts to see if the
   * object has a sub-item in the `.item` property.
   */
  get items(): Item[] {
    const maybeItems = this.getPossibleItems();
    const items: Item[] = [];

    for (const itemOrParent of maybeItems) {
      const isItem = this.isItem(itemOrParent);
      // if the item is a list item, add it to the list of items
      if (isItem) {
        items.push(itemOrParent);
        continue;
      }

      // If the item exposes an `item` property check if it is a list item.
      const subItem = (itemOrParent as HTMLElement & {item?: Item}).item;
      if (subItem && this.isItem(subItem)) {
        items.push(subItem);
      }
    }

    return items;
  }

  /**
   * Handles keyboard navigation. Should be bound to the node that will act as
   * the List.
   */
  handleKeydown = (event: KeyboardEvent) => {
    const key = event.key;
    if (event.defaultPrevented || !this.isNavigableKey(key)) {
      return;
    }
    // do not use this.items directly in upcoming calculations so we don't
    // re-query the DOM unnecessarily
    const items = this.items;

    if (!items.length) {
      return;
    }

    const activeItemRecord = getActiveItem(items, this.isActivatable);

    event.preventDefault();

    const isRtl = this.isRtl();
    const inlinePrevious = isRtl
      ? NavigableKeys.ArrowRight
      : NavigableKeys.ArrowLeft;
    const inlineNext = isRtl
      ? NavigableKeys.ArrowLeft
      : NavigableKeys.ArrowRight;

    let nextActiveItem: Item | null = null;
    switch (key) {
      // Activate the next item
      case NavigableKeys.ArrowDown:
      case inlineNext:
        nextActiveItem = activateNextItem(
          items,
          activeItemRecord,
          this.isActivatable,
          this.wrapNavigation(),
        );
        break;

      // Activate the previous item
      case NavigableKeys.ArrowUp:
      case inlinePrevious:
        nextActiveItem = activatePreviousItem(
          items,
          activeItemRecord,
          this.isActivatable,
          this.wrapNavigation(),
        );
        break;

      // Activate the first item
      case NavigableKeys.Home:
        nextActiveItem = activateFirstItem(items, this.isActivatable);
        break;

      // Activate the last item
      case NavigableKeys.End:
        nextActiveItem = activateLastItem(items, this.isActivatable);
        break;

      default:
        break;
    }

    if (
      nextActiveItem &&
      activeItemRecord &&
      activeItemRecord.item !== nextActiveItem
    ) {
      // If a new item was activated, remove the tabindex of the previous
      // activated item.
      activeItemRecord.item.tabIndex = -1;
    }
  };

  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem(): Item | null {
    const items = this.items;
    const activeItemRecord = getActiveItem(items, this.isActivatable);
    if (activeItemRecord) {
      activeItemRecord.item.tabIndex = -1;
    }
    return activateNextItem(
      items,
      activeItemRecord,
      this.isActivatable,
      this.wrapNavigation(),
    );
  }

  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem(): Item | null {
    const items = this.items;
    const activeItemRecord = getActiveItem(items, this.isActivatable);
    if (activeItemRecord) {
      activeItemRecord.item.tabIndex = -1;
    }
    return activatePreviousItem(
      items,
      activeItemRecord,
      this.isActivatable,
      this.wrapNavigation(),
    );
  }

  /**
   * Listener to be bound to the `deactivate-items` item event.
   */
  onDeactivateItems = () => {
    const items = this.items;

    for (const item of items) {
      this.deactivateItem(item);
    }
  };

  /**
   * Listener to be bound to the `request-activation` item event..
   */
  onRequestActivation = (event: Event) => {
    this.onDeactivateItems();
    const target = event.target as Item;
    this.activateItem(target);
    target.focus();
  };

  /**
   * Listener to be bound to the `slotchange` event for the slot that renders
   * the items.
   */
  onSlotchange = () => {
    const items = this.items;
    // Whether we have encountered an item that has been activated
    let encounteredActivated = false;

    for (const item of items) {
      const isActivated = !item.disabled && item.tabIndex > -1;

      if (isActivated && !encounteredActivated) {
        encounteredActivated = true;
        item.tabIndex = 0;
        continue;
      }

      // Deactivate the rest including disabled
      item.tabIndex = -1;
    }

    if (encounteredActivated) {
      return;
    }

    const firstActivatableItem = getFirstActivatableItem(
      items,
      this.isActivatable,
    );

    if (!firstActivatableItem) {
      return;
    }

    firstActivatableItem.tabIndex = 0;
  };
}
