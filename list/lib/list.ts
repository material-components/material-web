/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {ARIARole} from '../../types/aria.js';

import {ListItem} from './listitem/list-item.js';

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

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property(
      {type: String, attribute: 'data-aria-activedescendant', noAccessor: true})
  ariaActivedescendant!: string;

  @ariaProperty  // tslint:disable-line:no-new-decorators
  // tslint:disable-next-line:decorator-placement
  @property({type: String, attribute: 'data-role', noAccessor: true})
  // @ts-ignore(b/264292293): Use `override` with TS 4.9+
  role: ARIARole = 'list';

  @property({type: String}) listId = '';

  @property({type: Number}) listTabIndex: number = 0;

  items: ListItem[] = [];
  activeListItem: ListItem|null = null;

  @query('.md3-list') listRoot!: HTMLElement;

  @property({type: String}) listItemTagName = 'md-list-item';

  @queryAssignedElements({flatten: true})
  protected assignedElements!: HTMLElement[]|null;

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.updateItems();
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <ul class="md3-list ${classMap(this.getRenderClasses())}"
          aria-label="${ifDefined(this.ariaLabel)}"
          id=${ifDefined(this.listId || undefined)}
          tabindex=${this.listTabIndex}
          role=${this.role}
          @action=${this.handleAction}
          @keydown=${this.handleKeydown}
          >
        <span><slot></slot></span>
        <md-elevation surface></md-elevation>
      </ul>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {};
  }

  handleKeydown(event: KeyboardEvent) {
    if (Object.values(NAVIGATABLE_KEYS).indexOf(event.key) === -1) return;

    for (const item of this.items) {
      if (this.isListItemActive(item)) {
        this.activeListItem = item;
      }

      this.deactivateListItem(item);
    }

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

    if (this.activeListItem) {
      this.activateListItem(this.activeListItem);
    }
  }

  protected activateListItem(item: ListItem) {
    item.activate();
  }

  protected deactivateListItem(item: ListItem) {
    item.deactivate();
  }

  protected isListItemActive(item: ListItem): boolean {
    return item.isActive();
  }

  protected handleAction(event: CustomEvent) {}

  activateFirstItem() {
    this.activeListItem = this.getFirstItem();
    this.activeListItem.activate();
  }

  activateLastItem() {
    this.activeListItem = this.getLastItem();
    this.activeListItem.activate();
  }

  resetActiveListItem() {
    this.activeListItem = null;
  }

  focusListRoot() {
    this.listRoot.focus();
  }

  /** Updates `this.items` based on slot elements in the DOM. */
  protected updateItems() {
    const elements = this.assignedElements || [];
    this.items = elements.filter(this.isListItem, this);
  }

  /** @return Whether the given element is a list item element. */
  private isListItem(element: Element): element is ListItem {
    return element.tagName.toLowerCase() === this.listItemTagName;
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
