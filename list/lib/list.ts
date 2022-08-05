/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '@material/web/types/aria';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators';

import {ListItemInteractionEvent} from './listitem/constants';
import {ListItem} from './listitem/list-item';

const NAVIGATABLE_KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp',
  Home: 'Home',
  End: 'End',
};

/** @soyCompatible */
export class List extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: Number}) listTabIndex: number = 0;

  items: ListItem[] = [];
  activeListItem: ListItem|null = null;

  @query('.md3-list') listRoot!: HTMLElement;

  @queryAssignedElements({flatten: true})
  protected assignedElements!: HTMLElement[]|null;

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.updateItems();
  }

  /** @soyTemplate */
  protected getAriaRole(): ARIARole {
    return 'list';
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <ul class="md3-list"
          tabindex=${this.listTabIndex}
          role=${this.getAriaRole()}
          @list-item-interaction=${this.handleItemInteraction}
          @keydown=${this.handleKeydown}
          >
        <slot></slot>
      </ul>
    `;
  }

  handleKeydown(event: KeyboardEvent) {
    if (Object.values(NAVIGATABLE_KEYS).indexOf(event.key) === -1) return;

    if (event.key === NAVIGATABLE_KEYS.ArrowDown) {
      event.preventDefault();
      if (this.activeListItem) {
        this.activeListItem = this.getNextItem(this.activeListItem);
      } else {
        this.activeListItem = this.getFirstItem();
      }
    }

    if (event.key === NAVIGATABLE_KEYS.ArrowUp) {
      event.preventDefault();
      if (this.activeListItem) {
        this.activeListItem = this.getPrevItem(this.activeListItem);
      } else {
        this.activeListItem = this.getLastItem();
      }
    }

    if (event.key === NAVIGATABLE_KEYS.Home) {
      event.preventDefault();
      this.activeListItem = this.getFirstItem();
    }

    if (event.key === NAVIGATABLE_KEYS.End) {
      event.preventDefault();
      this.activeListItem = this.getLastItem();
    }

    if (!this.activeListItem) return;

    for (const item of this.items) {
      item.deactivate();
    }

    this.activeListItem.activate();
  }

  handleItemInteraction(event: ListItemInteractionEvent) {
    if (event.detail.state.isSelected) {
      // TODO: manage selection state.
    }
  }

  activateFirstItem() {
    this.activeListItem = this.getFirstItem();
    this.activeListItem.activate();
  }

  activateLastItem() {
    this.activeListItem = this.getLastItem();
    this.activeListItem.activate();
  }

  focusListRoot() {
    this.listRoot.focus();
  }

  /** Updates `this.items` based on slot elements in the DOM. */
  protected updateItems() {
    const elements = this.assignedElements || [];
    this.items = elements.filter(this.isListItem, this);
  }

  protected getListItemTagName() {
    return 'md-list-item';
  }

  /** @return Whether the given element is an <md-list-item> element. */
  private isListItem(element: Element): element is ListItem {
    return element.tagName.toLowerCase() === this.getListItemTagName();
  }

  private getFirstItem(): ListItem {
    return this.items[0];
  }

  private getLastItem(): ListItem {
    return this.items[this.items.length - 1];
  }

  private getPrevItem(item: ListItem): ListItem {
    const curIndex = this.items.indexOf(item);
    return this.items[curIndex === 0 ? this.items.length - 1 : curIndex - 1];
  }

  private getNextItem(item: ListItem): ListItem {
    const curIndex = this.items.indexOf(item);
    return this.items[(curIndex + 1) % this.items.length];
  }
}
