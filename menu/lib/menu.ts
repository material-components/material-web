/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../list/list.js';
import '../../menusurface/menu-surface.js';

import {html, LitElement} from 'lit';
import {property, query} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {List} from '../../list/lib/list.js';
import {ListItem} from '../../list/lib/listitem/list-item.js';
import {Corner, MenuSurface} from '../../menusurface/lib/menu-surface.js';

import {MDCMenuAdapter} from './adapter.js';
import {MDCMenuFoundation} from './foundation.js';

interface ActionDetail {
  item: ListItem;
}

/** Element to focus on when menu is first opened. */
export type DefaultFocusState = 'NONE'|'LIST_ROOT'|'FIRST_ITEM'|'LAST_ITEM';

/**
 * @fires selected {SelectedDetail}
 * @fires action {ActionDetail}
 * @fires items-updated
 * @fires opened
 * @fires closed
 */
export abstract class Menu extends LitElement {
  protected mdcFoundation!: MDCMenuFoundation;

  protected listElementInternal: List|null = null;

  @query('.md3-menu') mdcRoot!: MenuSurface;

  @query('slot') slotElement!: HTMLSlotElement|null;

  @property({type: Object}) anchor: HTMLElement|null = null;

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  @property({type: Boolean, reflect: true}) open = false;

  @property({type: Boolean}) quick = false;

  @property({type: String}) corner: Corner = 'BOTTOM_START';

  @property({type: Number}) x: number|null = null;

  @property({type: Number}) y: number|null = null;

  @property({type: Boolean}) absolute = false;

  @property({type: Boolean}) activatable = false;

  @property({type: Boolean}) fixed = false;

  @property({type: Boolean}) forceGroupSelection = false;

  @property({type: Boolean}) fullwidth = false;

  @property({type: Boolean}) flipMenuHorizontally = false;

  @property({type: Boolean}) stayOpenOnBodyClick = false;

  @property({type: Boolean}) skipRestoreFocus = false;

  @property({type: String}) defaultFocus: DefaultFocusState = 'LIST_ROOT';

  protected listUpdateComplete: null|Promise<unknown> = null;

  protected get listElement() {
    if (!this.listElementInternal) {
      this.listElementInternal = this.renderRoot.querySelector('md-list');
      return this.listElementInternal;
    }

    return this.listElementInternal;
  }

  get items(): ListItem[] {
    const listElement = this.listElement;

    if (listElement) {
      return listElement.items;
    }

    return [];
  }

  override render() {
    return html`
      <md-menu-surface
          ?hidden=${!this.open}
          .anchor=${this.anchor}
          .open=${this.open}
          .quick=${this.quick}
          .corner=${this.corner}
          .x=${this.x}
          .y=${this.y}
          .absolute=${this.absolute}
          .fixed=${this.fixed}
          .fullwidth=${this.fullwidth}
          .flipMenuHorizontally=${this.flipMenuHorizontally}
          .skipRestoreFocus=${this.skipRestoreFocus}
          ?stayOpenOnBodyClick=${this.stayOpenOnBodyClick}
          class="md3-menu"
          @closed=${this.onClosed}
          @opened=${this.onOpened}
          @keydown=${this.onKeydown}>
        <md-list
          aria-label="${ifDefined(this.ariaLabel)}"
          role=${'menu'}
          .listTabIndex=${
        - 1}
          .listItemTagName=${this.getMenuItemTagName()}
          @action=${this.onAction}>
        <slot></slot>
      </md-list>
    </md-menu-surface>`;
  }

  protected getMenuItemTagName() {
    return 'md-menu-item';
  }

  protected createAdapter(): MDCMenuAdapter {
    return {
      addClassToElementAtIndex: (index, className) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }

        const element = listElement.items[index];

        if (!element) {
          return;
        }

        element.classList.add(className);
      },
      removeClassFromElementAtIndex: (index, className) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }

        const element = listElement.items[index];

        if (!element) {
          return;
        }

        element.classList.remove(className);
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
          // TODO(b/240174946): This method is only used for setting
          // `aria-checked` and `aria-disabled` on the menu items when selected
          // and disabled states change. Remove this in favor of adding to the
          // template declaratively.
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }

        const element = listElement.items[index];

        if (!element) {
          return;
        }

        element.removeAttribute(attr);
      },
      getAttributeFromElementAtIndex: (index, attr) => {
        const listElement = this.listElement;
        if (!listElement) {
          return null;
        }

        const element = listElement.items[index];

        if (!element) {
          return null;
        }

        return element.getAttribute(attr);
      },
      elementContainsClass: (element, className) =>
          element.classList.contains(className),
      closeSurface: (skipRestoreFocus) => {
        this.skipRestoreFocus = Boolean(skipRestoreFocus);
        this.open = false;
      },
      getElementIndex: (element) => {
        const listElement = this.listElement;
        if (listElement) {
          return listElement.items.indexOf(element as ListItem);
        }

        return -1;
      },
      notifySelected: () => {/** handled by list */},
      getMenuItemCount: () => {
        const listElement = this.listElement;
        if (!listElement) {
          return 0;
        }

        return listElement.items.length;
      },
      getSelectedSiblingOfItemAtIndex: (index) => {
        const listElement = this.listElement;

        if (!listElement) {
          return -1;
        }

        // TODO(b/240177152): Remove/refactor this when implementing keyboard
        // navigation support.
        // const elementAtIndex = listElement.items[index];
        // if (!elementAtIndex || !elementAtIndex.group) {
        //   return -1;
        // }
        // for (let i = 0; i < listElement.items.length; i++) {
        //   if (i === index) {
        //     continue;
        //   }
        //   const current = listElement.items[i];
        //   if (current.selected && current.group === elementAtIndex.group) {
        //     return i;
        //   }
        // }

        return -1;
      },
      isSelectableItemAtIndex: (index) => {
        const listElement = this.listElement;

        if (!listElement) {
          return false;
        }

        const elementAtIndex = listElement.items[index];

        if (!elementAtIndex) {
          return false;
        }

        return elementAtIndex.hasAttribute('group');
      },
    };
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleKeydown(evt);
    }
  }

  protected onAction(evt: CustomEvent<ActionDetail>) {
    const listElement = this.listElement;
    if (this.mdcFoundation && listElement) {
      const el = evt.detail.item;

      if (el) {
        this.mdcFoundation.handleItemAction(el);
      }
    }
  }

  protected onOpened() {
    this.skipRestoreFocus = false;
    this.open = true;

    this.listElement?.resetActiveListItem();
    switch (this.defaultFocus) {
      case 'FIRST_ITEM':
        this.listElement?.activateFirstItem();
        break;
      case 'LAST_ITEM':
        this.listElement?.activateLastItem();
        break;
      case 'NONE':
        // Do nothing.
        break;
      case 'LIST_ROOT':
      default:
        this.listElement?.focus();
        break;
    }
  }

  protected onClosed() {
    this.open = false;
  }

  // tslint:disable:ban-ts-suppressions
  protected override async getUpdateComplete() {
    await this.listUpdateComplete;
    // @ts-ignore
    const result = await super.getUpdateComplete();
    return result;
  }
  // tslint:enable:ban-ts-suppressions

  protected override async firstUpdated() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }
    this.mdcFoundation = new MDCMenuFoundation(this.createAdapter());

    const listElement = this.listElement;

    if (listElement) {
      this.listUpdateComplete = listElement.updateComplete;
      await this.listUpdateComplete;
    }
  }

  close() {
    this.open = false;
  }

  show() {
    this.open = true;
  }
}
