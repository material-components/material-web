/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Required for @ariaProperty
// tslint:disable:no-new-decorators

import {html, LitElement, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {ARIARole} from '../../types/aria.js';

import {ListItem} from './listitem/list-item.js';

const NAVIGABLE_KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Home: 'Home',
  End: 'End',
} as const;

type NavigatableValues = typeof NAVIGABLE_KEYS[keyof typeof NAVIGABLE_KEYS];

const navigableKeySet = new Set(Object.values(NAVIGABLE_KEYS));

function isNavigableKey(key: string): key is NavigatableValues {
  return navigableKeySet.has(key as NavigatableValues);
}

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class List extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @ariaProperty
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  @ariaProperty
  @property(
      {type: String, attribute: 'data-aria-activedescendant', noAccessor: true})
  ariaActivedescendant!: string;

  @ariaProperty
  // tslint:disable-next-line
  @property({type: String, attribute: 'data-role', noAccessor: true})
  // @ts-ignore(b/264292293): Use `override` with TS 4.9+
  role: ARIARole = 'list';

  /**
   * The tabindex of the underlying list.
   */
  @property({type: Number}) listTabIndex: number = 0;

  @query('.md3-list') listRoot!: HTMLElement;

  /**
   * An array of selectable and disableable list items. Queries every assigned
   * element that has the `md-list-item` attribute.
   *
   * _NOTE:_ This is a shallow, flattened query via
   * `HTMLSlotElement.queryAssignedElements` and thus will _only_ include direct
   * children / directly slotted elements.
   */
  @queryAssignedElements({flatten: true, selector: '[md-list-item]'})
  items!: ListItem[];

  override render(): TemplateResult {
    return this.renderList();
  }

  /**
   * Renders the main list element.
   */
  protected renderList() {
    return html`
    <ul class="md3-list ${classMap(this.getListClasses())}"
        aria-label="${ifDefined(this.ariaLabel)}"
        tabindex=${this.listTabIndex}
        role=${this.role}
        @keydown=${this.handleKeydown}
        >
      ${this.renderContent()}
    </ul>
  `;
  }

  /**
   * The classes to be applied to the underlying list.
   */
  protected getListClasses(): ClassInfo {
    return {};
  }

  /**
   * The content to be slotted into the list.
   */
  protected renderContent() {
    return html`<span><slot @click=${(e: Event) => {
      e.stopPropagation();
    }}></slot></span>`;
  }

  /**
   * Handles keyboard navigation in the list.
   *
   * @param event {KeyboardEvent} The keyboard event that triggers this handler.
   */
  protected handleKeydown(event: KeyboardEvent) {
    const key = event.key;
    if (!isNavigableKey(key)) {
      return;
    }
    // do not use this.items directly so we don't re-query the DOM unnecessarily
    const items = this.items;

    if (!items.length) {
      return;
    }

    const selectedItemRecord = List.getSelectedItem(items);

    if (selectedItemRecord) {
      selectedItemRecord.item.selected = false;
    }

    event.preventDefault();

    switch (key) {
      // Select the next item
      case NAVIGABLE_KEYS.ArrowDown:
        if (selectedItemRecord) {
          const next = List.getNextItem(items, selectedItemRecord.index);

          if (next) next.selected = true;
        } else {
          List.selectFirstItem(items);
        }
        break;

      // Select the previous item
      case NAVIGABLE_KEYS.ArrowUp:
        if (selectedItemRecord) {
          const prev = List.getPrevItem(items, selectedItemRecord.index);
          if (prev) prev.selected = true;
        } else {
          items[items.length - 1].selected = true;
        }
        break;

      // Select the first item
      case NAVIGABLE_KEYS.Home:
        List.selectFirstItem(items);
        break;

      // Select the last item
      case NAVIGABLE_KEYS.End:
        List.selectLastItem(items);
        break;

      default:
        break;
    }
  }

  /**
   * Selects the first non-disabled item of a given array of items.
   *
   * @param items {Array<ListItem>} The items from which to select the
   * first item.
   */
  static selectFirstItem<T extends ListItem>(items: T[]) {
    // NOTE: These selector functions are static and not on the instance such
    // that multiple operations can be chained and we do not have to re-query
    // the DOM
    const firstItem = List.getFirstSelectableItem(items);
    if (firstItem) {
      firstItem.selected = true;
    }
  }

  /**
   * Selects the last non-disabled item of a given array of items.
   *
   * @param items {Array<ListItem>} The items from which to select the
   * last item.
   */
  static selectLastItem<T extends ListItem>(items: T[]) {
    const lastItem = List.getLastSelectableItem(items);
    if (lastItem) {
      lastItem.selected = true;
    }
  }

  /**
   * Deselects the currently selected item of a given array of items.
   *
   * @param items {Array<ListItem>} The items from which to deselect the
   * selected item.
   * @returns A record of the deleselcted selected item including the item and
   * the index of the item or `null` if none are deselected.
   */
  static deselectSelectedItem<T extends ListItem>(items: T[]) {
    const activeItem = List.getSelectedItem(items);
    if (activeItem) {
      activeItem.item.selected = false;
    }
    return activeItem;
  }

  override focus() {
    this.listRoot.focus();
  }

  /**
   * Retrieves the the first selected item of a given array of items.
   *
   * @param items {Array<ListItem>} The items to search.
   * @returns A record of the first selected item including the item and the
   * index of the item or `null` if none are selected.
   */
  static getSelectedItem<T extends ListItem>(items: T[]) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.selected) {
        return {
          item,
          index: i,
        };
      }
    }
    return null;
  }

  /**
   * Retrieves the the first non-disabled item of a given array of items. This
   * the first item that is not disabled.
   *
   * @param items {Array<ListItem>} The items to search.
   * @returns The first selectable item or `null` if none are selectable.
   */
  static getFirstSelectableItem<T extends ListItem>(items: T[]) {
    for (const item of items) {
      if (!item.disabled) {
        return item;
      }
    }

    return null;
  }

  /**
   * Retrieves the the last non-disabled item of a given array of items.
   *
   * @param items {Array<ListItem>} The items to search.
   * @returns The last selectable item or `null` if none are selectable.
   */
  static getLastSelectableItem<T extends ListItem>(items: T[]) {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (!item.disabled) {
        return item;
      }
    }

    return null;
  }

  /**
   * Retrieves the the next non-disabled item of a given array of items.
   *
   * @param items {Array<ListItem>} The items to search.
   * @param index {{index: number}} The index to search from.
   * @returns The next selectable item or `null` if none are selectable.
   */
  protected static getNextItem<T extends ListItem>(items: T[], index: number) {
    for (let i = 1; i < items.length; i++) {
      const nextIndex = (i + index) % items.length;
      const item = items[nextIndex];
      if (!item.disabled) {
        return item;
      }
    }
    return null;
  }

  /**
   * Retrieves the the previous non-disabled item of a given array of items.
   *
   * @param items {Array<ListItem>} The items to search.
   * @param index {{index: number}} The index to search from.
   * @returns The previous selectable item or `null` if none are selectable.
   */
  protected static getPrevItem<T extends ListItem>(items: T[], index: number) {
    for (let i = 1; i < items.length; i++) {
      const prevIndex = (index - i + items.length) % items.length;
      const item = items[prevIndex];

      if (!item.disabled) {
        return item;
      }
    }
    return null;
  }
}
