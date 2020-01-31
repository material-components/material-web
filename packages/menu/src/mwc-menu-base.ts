/**
@license
Copyright 2020 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import '@material/mwc-list';
import './mwc-menu-surface';

import {Corner as CornerEnum} from '@material/menu-surface/constants';
import {MDCMenuAdapter} from '@material/menu/adapter';
import {DefaultFocusState} from '@material/menu/constants';
import MDCMenuFoundation from '@material/menu/foundation.js';
import {BaseElement, observer} from '@material/mwc-base/base-element.js';
import {List, MWCListIndex} from '@material/mwc-list';
import {isEventMulti, SelectedEvent} from '@material/mwc-list/mwc-list-foundation';
import {ListItemBase} from '@material/mwc-list/src/mwc-list-item-base';
import {html, property, query} from 'lit-element';

import {MenuSurface} from './mwc-menu-surface';
import {Corner, MDCMenuDistance} from './mwc-menu-surface-base';

export {DefaultFocusState} from '@material/menu/constants';
export {createSetFromIndex, isEventMulti, isIndexSet, MWCListIndex} from '@material/mwc-list/mwc-list-foundation';
export {Corner} from './mwc-menu-surface-base';

/**
 * @fires selected {SelectedDetail}
 * @fires opened
 * @fires closed
 */
export abstract class MenuBase extends BaseElement {
  protected mdcFoundation!: MDCMenuFoundation;

  protected readonly mdcFoundationClass = MDCMenuFoundation;

  protected listElement_: List|null = null;

  @query('.mdc-menu') mdcRoot!: MenuSurface;

  @query('slot') slotElement!: HTMLSlotElement|null;

  @property({type: Object}) anchor: HTMLElement|null = null;

  @property({type: Boolean, reflect: true}) open = false;

  @property({type: Boolean}) quick = false;

  @property({type: Boolean}) wrapFocus = false;

  @property({type: String, reflect: true}) role: 'menu'|'listbox' = 'menu';

  @property({type: String}) corner: Corner|null = null;

  @property({type: Number}) x: number|null = null;

  @property({type: Number}) y: number|null = null;

  @property({type: Boolean}) absolute = false;

  @property({type: Boolean}) multi = false;

  @property({type: Boolean}) activatable = false;

  @property({type: Boolean}) fixed = false;

  @property({type: Number})
  @observer(function(this: MenuBase, value: DefaultFocusState) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setDefaultFocusState(value);
    }
  })
  defaultFocus: DefaultFocusState = DefaultFocusState.FIRST_ITEM;

  protected get listElement() {
    if (!this.listElement_) {
      this.listElement_ = this.renderRoot.querySelector('mwc-list');
      return this.listElement_;
    }

    return this.listElement_;
  }

  get items(): ListItemBase[] {
    const listElement = this.listElement;

    if (listElement) {
      return listElement.items;
    }

    return [];
  }

  get index(): MWCListIndex {
    const listElement = this.listElement;

    if (listElement) {
      return listElement.index;
    }

    return -1;
  }

  get selected(): ListItemBase|ListItemBase[]|null {
    const listElement = this.listElement;

    if (listElement) {
      return listElement.selected;
    }

    return null;
  }

  render() {
    const itemRoles = this.role === 'menu' ? 'menuitem' : 'option';

    return html`
      <mwc-menu-surface
          .anchor=${this.anchor}
          .open=${this.open}
          .quick=${this.quick}
          .corner=${this.corner}
          .x=${this.x}
          .y=${this.y}
          .absolute=${this.absolute}
          .fixed=${this.fixed}
          class="mdc-menu mdc-menu-surface"
          @closed=${this.onClosed}
          @opened=${this.onOpened}
          @keydown=${this.onKeydown}
          role=${this.role}>
          <mwc-list
            .multi=${this.multi}
            class="mdc-list"
            .itemRoles=${itemRoles}
            .wrapFocus=${this.wrapFocus}
            .activatable=${this.activatable}
            @selected=${this.onSelected}>
          <slot></slot>
        </mwc-list>
      </mwc-menu-surface>`;
  }

  createAdapter(): MDCMenuAdapter {
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

        if (className === 'mdc-menu-item--selected') {
          if (this.multi) {
            listElement.toggle(index, true);
          }
        } else {
          element.classList.add(className);
        }
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

        if (className === 'mdc-menu-item--selected') {
          if (this.multi) {
            listElement.toggle(index, false);
          }
        } else {
          element.classList.remove(className);
        }
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }

        const element = listElement.items[index];

        if (!element) {
          return;
        }

        element.setAttribute(attr, value);
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
      elementContainsClass: (element, className) =>
          element.classList.contains(className),
      closeSurface: () => {
        this.open = false;
      },
      getElementIndex: (element) => {
        const listElement = this.listElement;
        if (listElement) {
          return listElement.items.indexOf(element as ListItemBase);
        }

        return -1;
      },
      notifySelected: () => { /** handled by list */ },
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

        const elementAtIndex = listElement.items[index];

        if (!elementAtIndex || !elementAtIndex.group) {
          return -1;
        }

        for (let i = 0; i < listElement.items.length; i++) {
          if (i === index) {
            continue;
          }

          const current = listElement.items[i];
          if (current.selected && current.group === elementAtIndex.group) {
            return i;
          }
        }

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

  protected onSelected(evt: SelectedEvent) {
    const listElement = this.listElement;
    if (this.mdcFoundation && listElement) {
      let index = -1;

      if (isEventMulti(evt)) {
        if (evt.detail.diff.added.length) {
          index = evt.detail.diff.added[0];
        }
      } else {
        index = evt.detail.index;
      }

      const el = listElement.items[index];

      if (el && index !== -1) {
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

  setAnchorMargin(margin: MDCMenuDistance) {
    const surfaceElement = this.mdcRoot;
    if (surfaceElement) {
      surfaceElement.setAnchorMargin(margin);
    }
  }

  select(index: MWCListIndex) {
    const listElement = this.listElement;

    if (listElement) {
      listElement.select(index);
    }
  }

  setAnchorCorner(corner: CornerEnum) {
    const surface = this.mdcRoot;

    if (surface) {
      surface.setAnchorCorner(corner);
    }
  }

  close() {
    this.open = false;
  }

  show() {
    this.open = true;
  }
}
