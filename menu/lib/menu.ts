/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import '../../list/list';
import '../../menusurface/menu-surface';

// TODO(b/239222919): remove compat dependencies
import {observer} from '@material/web/compat/base/observer';
import {html, LitElement} from 'lit';
import {property, query} from 'lit/decorators';

import {List} from '../../list/lib/list';
import {ListItem} from '../../list/lib/listitem/list-item';
import {Corner, MenuSurface} from '../../menusurface/lib/menu-surface';

import {MDCMenuAdapter} from './adapter';
import {DefaultFocusState as DefaultFocusStateEnum} from './constants';
import {MDCMenuFoundation} from './foundation';

export type DefaultFocusState = keyof typeof DefaultFocusStateEnum;

interface ActionDetail {
  item: ListItem;
}

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

  @property({type: Boolean, reflect: true}) open = false;

  @property({type: Boolean}) quick = false;

  // TODO(b/240174946): Add aria-label support.
  // @property({type: String}) ariaLabel: string|null = null;

  @property({type: String}) corner: Corner = 'BOTTOM_START';

  @property({type: Number}) x: number|null = null;

  @property({type: Number}) y: number|null = null;

  @property({type: Boolean}) absolute = false;

  @property({type: Boolean}) activatable = false;

  @property({type: Boolean}) fixed = false;

  @property({type: Boolean}) forceGroupSelection = false;

  @property({type: Boolean}) fullwidth = false;

  @property({type: Boolean}) flipMenuHorizontally = false;

  @property({type: Boolean}) stayOpenOnBodyClick: boolean = false;

  @property({type: String})
  @observer(function(this: Menu, value: DefaultFocusState) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setDefaultFocusState(DefaultFocusStateEnum[value]);
    }
  })
  defaultFocus: DefaultFocusState = 'LIST_ROOT';

  protected listUpdateComplete: null|Promise<unknown> = null;

  protected get listElement() {
    if (!this.listElementInternal) {
      this.listElementInternal = this.renderRoot.querySelector('md-list');
      return this.listElementInternal;
    }

    return this.listElementInternal;
  }

  override click() {
    if (this.mdcRoot) {
      this.mdcRoot.focus();
      this.mdcRoot.click();
      return;
    }

    super.click();
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
          ?stayOpenOnBodyClick=${this.stayOpenOnBodyClick}
          class="md3-menu md3-menu-surface"
          @closed=${this.onClosed}
          @opened=${this.onOpened}
          @keydown=${this.onKeydown}>
        <md-list
          @action=${this.onAction}>
        <slot></slot>
      </md-list>
    </md-menu-surface>`;
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
      closeSurface: () => {
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
      focusItemAtIndex: (index) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }
        const element = listElement.items[index];

        if (element) {
          (element as HTMLElement).focus();
        }
      },
      focusListRoot: () => {
        if (this.listElement) {
          this.listElement.focus();
        }
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
    this.open = true;

    if (this.mdcFoundation) {
      this.mdcFoundation.handleMenuSurfaceOpened();
    }
  }

  protected onClosed() {
    this.open = false;
  }

  // tslint:disable:ban-ts-ignore
  protected override async getUpdateComplete() {
    await this.listUpdateComplete;
    // @ts-ignore
    const result = await super.getUpdateComplete();
    return result;
  }
  // tslint:enable:ban-ts-ignore

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

  getFocusedItemIndex() {
    // TODO(b/240177152): Implement keyboard navigation support.
    // const listElement = this.listElement;
    // if (listElement) {
    //   return listElement.getFocusedItemIndex();
    // }

    return -1;
  }

  focusItemAtIndex(index: number) {
    // TODO(b/240177152): Implement keyboard navigation support.
    // const listElement = this.listElement;
    // if (listElement) {
    //   listElement.focusItemAtIndex(index);
    // }
  }
}
