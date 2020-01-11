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

import {Corner, MDCMenuDistance} from './mwc-menu-surface-base';
import {MDCMenuAdapter} from '@material/menu/adapter';
import MDCMenuFoundation from '@material/menu/foundation.js';
import {BaseElement, observer} from '@material/mwc-base/base-element.js';
import {isNodeElement} from '@material/mwc-base/utils';
import {List} from '@material/mwc-list';
import {ListItemBase} from '@material/mwc-list/src/mwc-list-item-base';
import {html, property, query} from 'lit-element';
import {MenuSurface} from './mwc-menu-surface';
import {DefaultFocusState} from '@material/menu/constants';

export {Corner} from './mwc-menu-surface-base';
export {DefaultFocusState} from '@material/menu/constants';

/**
 * @fires selected
 */
export abstract class MenuBase extends BaseElement {
  protected mdcFoundation!: MDCMenuFoundation;

  protected readonly mdcFoundationClass = MDCMenuFoundation;

  @query('.mdc-menu') mdcRoot!: MenuSurface;

  @query('slot') slotElement!: HTMLSlotElement;

  @query('.mdc-list') listElement!: List;

  @property({type: Object}) anchor: HTMLElement|null = null;

  @property({type: Boolean, reflect: true}) open = false;

  @property({type: Boolean}) quick = false;

  @property({type: Boolean}) wrapFocus = false;

  @property({type: String, reflect: true}) role: 'menu'|'listbox' = 'menu';

  @property({type: String}) corner: Corner|null = null;

  @property({type: Number}) x: number|null = null;

  @property({type: Number}) y: number|null = null;

  @property({type: Boolean}) absolute = false;

  @property({type: Boolean}) fixed = false;

  @property({type: Number})
  @observer(function(this: MenuBase, value: DefaultFocusState) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setDefaultFocusState(value);
    }
  })
  defaultFocus: DefaultFocusState = DefaultFocusState.LIST_ROOT;

  get items(): ListItemBase[] {
    const listElement = this.listElement;

    if (listElement) {
      return listElement.items;
    }

    return [];
  }

  get selected(): ListItemBase|null {
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
          .wrapFocus=${this.wrapFocus}
          .x=${this.x}
          .y=${this.y}
          .absolute=${this.absolute}
          .fixed=${this.fixed}
          class="mdc-menu mdc-menu-surface"
          @closed=${this.onClosed}
          @opened=${this.onClosed}
          @keydown=${this.onKeydown}>
        <mwc-list
            class="mdc-list"
            .itemRoles=${itemRoles}
            @action=${this.onAction}>
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
      notifySelected: (evtData) => {
        if (!this.mdcRoot) {
          return;
        }

        const init: CustomEventInit = {};
        init.detail = {index: evtData.index, item: evtData};
        const ev = new CustomEvent('selected', init);
        this.mdcRoot.dispatchEvent(ev);
      },
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

        if (element && isNodeElement(element)) {
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

        if (!elementAtIndex) {
          return -1;
        }

        const groupEl = elementAtIndex.parentNode as HTMLElement;

        if (!isNodeElement(groupEl) &&
            !groupEl.hasAttribute('mwc-menu-group')) {
          return -1;
        }

        const selectedItemEl =
            groupEl.querySelector('[mwc-list-item][selected]') as ListItemBase |
            null;

        if (!selectedItemEl) {
          return -1;
        }

        const elements = listElement.items;

        return elements.indexOf(selectedItemEl);
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

        const groupEl = elementAtIndex.parentNode as HTMLElement;

        if (!isNodeElement(groupEl) &&
            !groupEl.hasAttribute('mwc-menu-group')) {
          return false;
        } else {
          return true;
        }
      },
    };
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleKeydown(evt);
    }
  }

  protected onAction(evt: CustomEvent<{index: number}>) {
    const listElement = this.listElement;
    if (this.mdcFoundation && listElement) {
      const el = listElement.items[evt.detail.index];
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

  setAnchorMargin(margin: MDCMenuDistance) {
    const surfaceElement = this.mdcRoot;
    if (surfaceElement) {
      surfaceElement.setAnchorMargin(margin);
    }
  }

  select(index: number) {
    const listElement = this.listElement;

    if (listElement) {
      listElement.select(index);
    }
  }
}
