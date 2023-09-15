/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer, LitElement} from 'lit';
import {query, queryAssignedElements} from 'lit/decorators.js';

import {polyfillElementInternalsAria, setupHostAria} from '../../internal/aria/aria.js';

import {ListItem} from './listitem/list-item.js';

/**
 * Default keys that trigger navigation.
 */
export const NAVIGABLE_KEYS = {
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_UP: 'ArrowUp',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * A record that describes a list item in a list with metadata such a reference
 * to the item and its index in the list.
 */
export interface ItemRecord {
  item: ListItem;
  index: number;
}

type NavigatableValues = typeof NAVIGABLE_KEYS[keyof typeof NAVIGABLE_KEYS];

const navigableKeySet = new Set(Object.values(NAVIGABLE_KEYS));

function isNavigableKey(key: string): key is NavigatableValues {
  return navigableKeySet.has(key as NavigatableValues);
}

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class List extends LitElement {
  static {
    setupHostAria(List, {focusable: false});
  }

  @query('.list') private listRoot!: HTMLElement|null;

  /**
   * An array of activatable and disableable list items. Queries every assigned
   * element that has the `md-list-item` attribute.
   *
   * _NOTE:_ This is a shallow, flattened query via
   * `HTMLSlotElement.queryAssignedElements` and thus will _only_ include direct
   * children / directly slotted elements.
   */
  @queryAssignedElements({flatten: true, selector: '[md-list-item]'})
  items!: ListItem[];

  private readonly internals = polyfillElementInternalsAria(
      this, (this as HTMLElement /* needed for closure */).attachInternals());

  constructor() {
    super();
    if (!isServer) {
      this.internals.role = 'list';
      this.addEventListener('keydown', this.handleKeydown.bind(this));
    }
  }

  protected override render() {
    return this.renderList();
  }

  /**
   * Renders the main list element.
   */
  private renderList() {
    return html`
    <ul class="list" role="presentation">
      ${this.renderContent()}
    </ul>
  `;
  }

  /**
   * The content to be slotted into the list.
   */
  private renderContent() {
    return html`
      <slot
          @deactivate-items=${this.onDeactivateItems}
          @request-activation=${this.onRequestActivation}
          @slotchange=${this.onSlotchange}>
      </slot>`;
  }

  /**
   * Handles keyboard navigation in the list.
   *
   * @param event {KeyboardEvent} The keyboard event that triggers this handler.
   */
  private async handleKeydown(event: KeyboardEvent) {
    // Allow event to bubble to check for defaultPrevented
    // TODO(b/293323995): clean up when we find out why await 0 doesn't work.
    await new Promise(res => {
      setTimeout(res, 0);
    });

    const key = event.key;
    if (event.defaultPrevented || !isNavigableKey(key)) {
      return;
    }
    // do not use this.items directly so we don't re-query the DOM unnecessarily
    const items = this.items;

    if (!items.length) {
      return;
    }

    const activeItemRecord = List.getActiveItem(items);

    if (activeItemRecord) {
      activeItemRecord.item.tabIndex = -1;
    }

    event.preventDefault();

    const isLTR = getComputedStyle(this).direction === 'ltr';
    const inlinePrevious =
        isLTR ? NAVIGABLE_KEYS.ARROW_LEFT : NAVIGABLE_KEYS.ARROW_RIGHT;
    const inlineNext =
        isLTR ? NAVIGABLE_KEYS.ARROW_RIGHT : NAVIGABLE_KEYS.ARROW_LEFT;

    switch (key) {
      // Activate the next item
      case NAVIGABLE_KEYS.ARROW_DOWN:
      case inlineNext:
        this.activateNextItemInternal(items, activeItemRecord);
        break;

      // Activate the previous item
      case NAVIGABLE_KEYS.ARROW_UP:
      case inlinePrevious:
        this.activatePreviousItemInternal(items, activeItemRecord);
        break;

      // Activate the first item
      case NAVIGABLE_KEYS.HOME:
        List.activateFirstItem(items);
        break;

      // Activate the last item
      case NAVIGABLE_KEYS.END:
        List.activateLastItem(items);
        break;

      default:
        break;
    }
  }

  private activateNextItemInternal(
      items: ListItem[], activeItemRecord: null|ItemRecord): ListItem|null {
    if (activeItemRecord) {
      const next = List.getNextItem(items, activeItemRecord.index);

      if (next) {
        next.tabIndex = 0;
        next.focus();
      }

      return next;
    } else {
      return List.activateFirstItem(items);
    }
  }

  private activatePreviousItemInternal(
      items: ListItem[], activeItemRecord: null|ItemRecord): ListItem|null {
    if (activeItemRecord) {
      const prev = List.getPrevItem(items, activeItemRecord.index);
      if (prev) {
        prev.tabIndex = 0;
        prev.focus();
      }
      return prev;
    } else {
      return List.activateLastItem(items);
    }
  }

  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem(): ListItem|null {
    const items = this.items;
    const activeItemRecord = List.getActiveItem(items);
    if (activeItemRecord) {
      activeItemRecord.item.tabIndex = -1;
    }
    return this.activateNextItemInternal(items, activeItemRecord);
  }

  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem(): ListItem|null {
    const items = this.items;
    const activeItemRecord = List.getActiveItem(items);
    if (activeItemRecord) {
      activeItemRecord.item.tabIndex = -1;
    }
    return this.activatePreviousItemInternal(items, activeItemRecord);
  }

  private onDeactivateItems() {
    const items = this.items;
    for (const item of items) {
      item.tabIndex = -1;
    }
  }

  private onRequestActivation(event: Event) {
    this.onDeactivateItems();
    const target = event.target as HTMLElement;
    target.tabIndex = 0;
    target.focus();
  }

  /**
   * Activates the first non-disabled item of a given array of items.
   *
   * @param items {Array<ListItem>} The items from which to activate the
   * first item.
   * @nocollapse
   */
  static activateFirstItem<T extends ListItem>(items: T[]) {
    // NOTE: These selector functions are static and not on the instance such
    // that multiple operations can be chained and we do not have to re-query
    // the DOM
    const firstItem = List.getFirstActivatableItem(items);
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
  static activateLastItem<T extends ListItem>(items: T[]) {
    const lastItem = List.getLastActivatableItem(items);
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
  static deactivateActiveItem<T extends ListItem>(items: T[]) {
    const activeItem = List.getActiveItem(items);
    if (activeItem) {
      activeItem.item.tabIndex = -1;
    }
    return activeItem;
  }

  override focus() {
    this.listRoot?.focus();
  }

  /**
   * Retrieves the first activated item of a given array of items.
   *
   * @param items {Array<ListItem>} The items to search.
   * @return A record of the first activated item including the item and the
   * index of the item or `null` if none are activated.
   * @nocollapse
   */
  static getActiveItem<T extends ListItem>(items: T[]) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.tabIndex === 0) {
        return {
          item,
          index: i,
        } as ItemRecord;
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
  static getFirstActivatableItem<T extends ListItem>(items: T[]) {
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
  static getLastActivatableItem<T extends ListItem>(items: T[]) {
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
  private static getNextItem<T extends ListItem>(items: T[], index: number) {
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
  private static getPrevItem<T extends ListItem>(items: T[], index: number) {
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
   * Ensures only one item is activated / focusable.
   */
  private onSlotchange() {
    const items = this.items;

    let encounteredFirstActivated = false;

    for (const item of items) {
      const isActivated = !item.disabled && item.tabIndex > -1;

      if (isActivated && !encounteredFirstActivated) {
        encounteredFirstActivated = true;
        item.tabIndex = 0;
        continue;
      }

      // Deactivate the rest including disabled
      item.tabIndex = -1;
    }

    if (encounteredFirstActivated) {
      return;
    }

    const firstActivatableItem = List.getFirstActivatableItem(items);

    if (!firstActivatableItem) {
      return;
    }

    firstActivatableItem.tabIndex = 0;
  }
}
