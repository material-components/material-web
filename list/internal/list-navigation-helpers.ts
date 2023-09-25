/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO: move this file to List

export interface ListItem extends HTMLElement {
  disabled: boolean;
}

/**
 * A record that describes a list item in a list with metadata such a reference
 * to the item and its index in the list.
 */
export interface ItemRecord<Item extends ListItem> {
  item: Item;
  index: number;
}

/**
 * A record that describes a list item in a list with metadata such a reference
 * to the item and its index in the list.
 */
export interface ItemRecord<Item extends ListItem> {
  item: Item;
  index: number;
}

/**
 * Activates the first non-disabled item of a given array of items.
 *
 * @param items {Array<ListItem>} The items from which to activate the
 * first item.
 */
export function activateFirstItem<Item extends ListItem>(items: Item[]) {
  // NOTE: These selector functions are static and not on the instance such
  // that multiple operations can be chained and we do not have to re-query
  // the DOM
  const firstItem = getFirstActivatableItem(items);
  if (firstItem) {
    firstItem.tabIndex = 0;
    firstItem.focus();
  }
  return firstItem;
}

/**
 * Activates the last non-disabled item of a given array of items.
 *
 * @param items {Array<ListItem>} The items from which to activate the
 * last item.
 * @nocollapse
 */
export function activateLastItem<Item extends ListItem>(items: Item[]) {
  const lastItem = getLastActivatableItem(items);
  if (lastItem) {
    lastItem.tabIndex = 0;
    lastItem.focus();
  }
  return lastItem;
}

/**
 * Deactivates the currently active item of a given array of items.
 *
 * @param items {Array<ListItem>} The items from which to deactivate the
 * active item.
 * @return A record of the deleselcted activated item including the item and
 * the index of the item or `null` if none are deactivated.
 * @nocollapse
 */
export function deactivateActiveItem<Item extends ListItem>(items: Item[]) {
  const activeItem = getActiveItem(items);
  if (activeItem) {
    activeItem.item.tabIndex = -1;
  }
  return activeItem;
}

/**
 * Retrieves the first activated item of a given array of items.
 *
 * @param items {Array<ListItem>} The items to search.
 * @return A record of the first activated item including the item and the
 * index of the item or `null` if none are activated.
 * @nocollapse
 */
export function getActiveItem<Item extends ListItem>(items: Item[]) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.tabIndex === 0 && !item.disabled) {
      return {
        item,
        index: i,
      } as ItemRecord<Item>;
    }
  }
  return null;
}

/**
 * Retrieves the first non-disabled item of a given array of items. This
 * the first item that is not disabled.
 *
 * @param items {Array<ListItem>} The items to search.
 * @return The first activatable item or `null` if none are activatable.
 * @nocollapse
 */
export function getFirstActivatableItem<Item extends ListItem>(items: Item[]) {
  for (const item of items) {
    if (!item.disabled) {
      return item;
    }
  }

  return null;
}

/**
 * Retrieves the last non-disabled item of a given array of items.
 *
 * @param items {Array<ListItem>} The items to search.
 * @return The last activatable item or `null` if none are activatable.
 * @nocollapse
 */
export function getLastActivatableItem<Item extends ListItem>(items: Item[]) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (!item.disabled) {
      return item;
    }
  }

  return null;
}

/**
 * Retrieves the next non-disabled item of a given array of items.
 *
 * @param items {Array<ListItem>} The items to search.
 * @param index {{index: number}} The index to search from.
 * @return The next activatable item or `null` if none are activatable.
 */
export function getNextItem<Item extends ListItem>(
    items: Item[], index: number) {
  for (let i = 1; i < items.length; i++) {
    const nextIndex = (i + index) % items.length;
    const item = items[nextIndex];
    if (!item.disabled) {
      return item;
    }
  }

  return items[index] ? items[index] : null;
}

/**
 * Retrieves the previous non-disabled item of a given array of items.
 *
 * @param items {Array<ListItem>} The items to search.
 * @param index {{index: number}} The index to search from.
 * @return The previous activatable item or `null` if none are activatable.
 */
export function getPrevItem<Item extends ListItem>(
    items: Item[], index: number) {
  for (let i = 1; i < items.length; i++) {
    const prevIndex = (index - i + items.length) % items.length;
    const item = items[prevIndex];

    if (!item.disabled) {
      return item;
    }
  }

  return items[index] ? items[index] : null;
}

/**
 * Activates the next item and focuses it. If nothing is currently activated,
 * activates the first item.
 */
export function activateNextItem<Item extends ListItem>(
    items: Item[], activeItemRecord: null|ItemRecord<Item>): Item|null {
  if (activeItemRecord) {
    const next = getNextItem(items, activeItemRecord.index);

    if (next) {
      next.tabIndex = 0;
      next.focus();
    }

    return next;
  } else {
    return activateFirstItem(items);
  }
}

/**
 * Activates the previous item and focuses it. If nothing is currently
 * activated, activates the last item.
 */
export function activatePreviousItem<Item extends ListItem>(
    items: Item[], activeItemRecord: null|ItemRecord<Item>): Item|null {
  if (activeItemRecord) {
    const prev = getPrevItem(items, activeItemRecord.index);
    if (prev) {
      prev.tabIndex = 0;
      prev.focus();
    }
    return prev;
  } else {
    return activateLastItem(items);
  }
}

/**
 * Creates an event that requests the parent md-list to deactivate all other
 * items.
 */
export function createDeactivateItemsEvent() {
  return new Event('deactivate-items', {bubbles: true, composed: true});
}

/**
 * The type of the event that requests the parent md-list to deactivate all
 * other items.
 */
export type DeactivateItemsEvent =
    ReturnType<typeof createDeactivateItemsEvent>;

/**
 * Creates an event that requests the menu to set `tabindex=0` on the item and
 * focus it. We use this pattern because List keeps track of what element is
 * active in the List by maintaining tabindex. We do not want list items
 * to set tabindex on themselves or focus themselves so that we can organize all
 * that logic in the parent List and Menus, and list item stays as dumb as
 * possible.
 */
export function createRequestActivationEvent() {
  return new Event('request-activation', {bubbles: true, composed: true});
}

/**
 * The type of the event that requests the list activates and focuses the item.
 */
export type RequestActivationEvent =
    ReturnType<typeof createRequestActivationEvent>;