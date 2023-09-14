/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

import {ListItem} from './listitem/list-item.js';

const NAVIGABLE_KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Home: 'Home',
  End: 'End',
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
    requestUpdateOnAriaChange(List);
  }

  /** @nocollapse */
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property() type: 'menu'|'menubar'|'listbox'|'list'|'' = 'list';

  /**
   * The tabindex of the underlying list.
   */
  @property({type: Number, attribute: 'list-tabindex'}) listTabIndex = -1;

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

  protected override render() {
    return this.renderList();
  }

  /**
   * Renders the main list element.
   */
  private renderList() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
    <ul class="list"
        aria-label=${ariaLabel || nothing}
        tabindex=${this.listTabIndex}
        role=${this.type || nothing}
        @keydown=${this.handleKeydown}
        >
      ${this.renderContent()}
    </ul>
  `;
  }

  /**
   * The content to be slotted into the list.
   */
  private renderContent() {
    return html`<span><slot></slot></span>`;
  }

  /**
   * Handles keyboard navigation in the list.
   *
   * @param event {KeyboardEvent} The keyboard event that triggers this handler.
   */
  private handleKeydown(event: KeyboardEvent) {
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
      activeItemRecord.item.active = false;
    }

    event.preventDefault();

    switch (key) {
      // Activate the next item
      case NAVIGABLE_KEYS.ArrowDown:
        this.activateNextItemInternal(items, activeItemRecord);
        break;

      // Activate the previous item
      case NAVIGABLE_KEYS.ArrowUp:
        this.activatePreviousItemInternal(items, activeItemRecord);
        break;

      // Activate the first item
      case NAVIGABLE_KEYS.Home:
        List.activateFirstItem(items);
        break;

      // Activate the last item
      case NAVIGABLE_KEYS.End:
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

      if (next) next.active = true;

      return next;
    } else {
      return List.activateFirstItem(items);
    }
  }

  private activatePreviousItemInternal(
      items: ListItem[], activeItemRecord: null|ItemRecord): ListItem|null {
    if (activeItemRecord) {
      const prev = List.getPrevItem(items, activeItemRecord.index);
      if (prev) prev.active = true;
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
      activeItemRecord.item.active = false;
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
      activeItemRecord.item.active = false;
    }
    return this.activatePreviousItemInternal(items, activeItemRecord);
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
      firstItem.active = true;
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
      lastItem.active = true;
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
      activeItem.item.active = false;
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
      if (item.active) {
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
}
