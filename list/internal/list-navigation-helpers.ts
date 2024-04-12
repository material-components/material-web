/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

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
 * Activates the first non-disabled item of a given array of items.
 *
 * @param items {Array<ListItem>} The items from which to activate the
 *     first item.
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 */
export function activateFirstItem<Item extends ListItem>(
  items: Item[],
  isActivatable = isItemNotDisabled<Item>,
) {
  // NOTE: These selector functions are static and not on the instance such
  // that multiple operations can be chained and we do not have to re-query
  // the DOM
  const firstItem = getFirstActivatableItem(items, isActivatable);
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
 *     last item.
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 * @nocollapse
 */
export function activateLastItem<Item extends ListItem>(
  items: Item[],
  isActivatable = isItemNotDisabled<Item>,
) {
  const lastItem = getLastActivatableItem(items, isActivatable);
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
 *     active item.
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 * @return A record of the deleselcted activated item including the item and
 *     the index of the item or `null` if none are deactivated.
 * @nocollapse
 */
export function deactivateActiveItem<Item extends ListItem>(
  items: Item[],
  isActivatable = isItemNotDisabled<Item>,
) {
  const activeItem = getActiveItem(items, isActivatable);
  if (activeItem) {
    activeItem.item.tabIndex = -1;
  }
  return activeItem;
}

/**
 * Retrieves the first activated item of a given array of items.
 *
 * @param items {Array<ListItem>} The items to search.
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 * @return A record of the first activated item including the item and the
 *     index of the item or `null` if none are activated.
 * @nocollapse
 */
export function getActiveItem<Item extends ListItem>(
  items: Item[],
  isActivatable = isItemNotDisabled<Item>,
) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.tabIndex === 0 && isActivatable(item)) {
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
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 * @return The first activatable item or `null` if none are activatable.
 * @nocollapse
 */
export function getFirstActivatableItem<Item extends ListItem>(
  items: Item[],
  isActivatable = isItemNotDisabled<Item>,
) {
  for (const item of items) {
    if (isActivatable(item)) {
      return item;
    }
  }

  return null;
}

/**
 * Retrieves the last non-disabled item of a given array of items.
 *
 * @param items {Array<ListItem>} The items to search.
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 * @return The last activatable item or `null` if none are activatable.
 * @nocollapse
 */
export function getLastActivatableItem<Item extends ListItem>(
  items: Item[],
  isActivatable = isItemNotDisabled<Item>,
) {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    if (isActivatable(item)) {
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
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 * @param wrap If true, then the next item at the end of the list is the first
 *     item. Defaults to true.
 * @return The next activatable item or `null` if none are activatable.
 */
export function getNextItem<Item extends ListItem>(
  items: Item[],
  index: number,
  isActivatable = isItemNotDisabled<Item>,
  wrap = true,
) {
  for (let i = 1; i < items.length; i++) {
    const nextIndex = (i + index) % items.length;
    if (nextIndex < index && !wrap) {
      // Return if the index loops back to the beginning and not wrapping.
      return null;
    }

    const item = items[nextIndex];
    if (isActivatable(item)) {
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
 * @param isActivatable Function to determine if an item can be  activated.
 *     Defaults to non-disabled items.
 * @param wrap If true, then the previous item at the beginning of the list is
 *     the last item. Defaults to true.
 * @return The previous activatable item or `null` if none are activatable.
 */
export function getPrevItem<Item extends ListItem>(
  items: Item[],
  index: number,
  isActivatable = isItemNotDisabled<Item>,
  wrap = true,
) {
  for (let i = 1; i < items.length; i++) {
    const prevIndex = (index - i + items.length) % items.length;
    if (prevIndex > index && !wrap) {
      // Return if the index loops back to the end and not wrapping.
      return null;
    }

    const item = items[prevIndex];

    if (isActivatable(item)) {
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
  items: Item[],
  activeItemRecord: null | ItemRecord<Item>,
  isActivatable = isItemNotDisabled<Item>,
  wrap = true,
): Item | null {
  if (activeItemRecord) {
    const next = getNextItem(
      items,
      activeItemRecord.index,
      isActivatable,
      wrap,
    );

    if (next) {
      next.tabIndex = 0;
      next.focus();
    }

    return next;
  } else {
    return activateFirstItem(items, isActivatable);
  }
}

/**
 * Activates the previous item and focuses it. If nothing is currently
 * activated, activates the last item.
 */
export function activatePreviousItem<Item extends ListItem>(
  items: Item[],
  activeItemRecord: null | ItemRecord<Item>,
  isActivatable = isItemNotDisabled<Item>,
  wrap = true,
): Item | null {
  if (activeItemRecord) {
    const prev = getPrevItem(
      items,
      activeItemRecord.index,
      isActivatable,
      wrap,
    );
    if (prev) {
      prev.tabIndex = 0;
      prev.focus();
    }
    return prev;
  } else {
    return activateLastItem(items, isActivatable);
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
export type DeactivateItemsEvent = ReturnType<
  typeof createDeactivateItemsEvent
>;

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
export type RequestActivationEvent = ReturnType<
  typeof createRequestActivationEvent
>;

/**
 * The default `isActivatable` function, which checks if an item is not
 * disabled.
 *
 * @param item The item to check.
 * @return true if `item.disabled` is `false.
 */
function isItemNotDisabled<Item extends ListItem>(item: Item) {
  return !item.disabled;
}
