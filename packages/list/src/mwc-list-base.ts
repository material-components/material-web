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
import '@material/mwc-notched-outline';

import {BaseElement} from '@material/mwc-base/base-element.js';
import {MDCListAdapter} from '@material/list/adapter';
import MDCListFoundation from '@material/list/foundation.js';
import {html, query} from 'lit-element';
import {isNodeElement} from '@material/mwc-base/utils';
import {ListItemBase} from './mwc-list-item-base';

export abstract class ListBase extends BaseElement {
  protected mdcFoundation!: MDCListFoundation;

  protected readonly mdcFoundationClass = MDCListFoundation;

  @query('.mdc-list') protected mdcRoot!: HTMLElement;

  @query('slot') protected slotElement!: HTMLSlotElement|null;

  protected get assignedElements(): Element[] {
    const slot = this.slotElement;

    if (slot) {
      return slot.assignedNodes({flatten: true})
                 .filter((node) => (node.nodeType === Node.ELEMENT_NODE)) as
          Element[];
    }

    return [];
  }

  get items(): ListItemBase[] {
    const nodes = this.assignedElements;
    const listItems =
        nodes
            .map<Element|Element[]>((element) => {
              if (element instanceof ListItemBase) {
                return element;
              }

              return Array.from(element.querySelectorAll('.list-item'));
            })
            .reduce<Element[]>((listItems, listItemResult) => {
              return listItems.concat(listItemResult);
            }, []);

    return listItems as ListItemBase[];
  }

  render() {
    return html`
      <ul
          class="mdc-list"
          @keydown=${this.listOnKeydown}
          @click=${this.listOnClick}
          @focusin=${this.listOnFocusin}
          @focusout=${this.listOnFocusout}>
        <slot></slot>
      </ul>
    `;
  }

  createAdapter(): MDCListAdapter {
    return {
      getListItemCount: () => {
        if (this.mdcRoot) {
          const elements = this.items;
          return elements.length;
        }

        return 0;
      },
      getFocusedElementIndex: () => {
        if (!this.mdcRoot) {
          return -1;
        }

        const elements = this.items;

        if (!elements.length) {
          return -1;
        }

        const activeElement = this.getSlottedActiveElement();

        if (!activeElement) {
          return -1;
        }

        let activeItem: ListItemBase|Element|null = activeElement;

        while (activeItem && !(activeItem instanceof ListItemBase)) {
          const parent = activeItem.parentNode;
          if (!parent) {
            activeItem = null;
            continue;
          }

          if (parent.nodeType === Node.ELEMENT_NODE) {
            activeItem = parent as Element;
          } else {
            activeItem = null;
          }
        }

        const activeListItem = activeItem as ListItemBase | null;

        return activeListItem ? elements.indexOf(activeListItem) : -1;
      },
      getAttributeForElementIndex: (index, attr) => {
        const listElement = this.mdcRoot;
        if (!listElement) {
          return '';
        }

        const element = this.items[index];
        return element ? element.getAttribute(attr) : '';
      },
      setAttributeForElementIndex: (index, attr, val) => {
        if (!this.mdcRoot) {
          return;
        }

        const element = this.items[index];

        if (element) {
          element.setAttribute(attr, val);
        }
      },
      addClassForElementIndex: (index, className) => {
        if (!this.mdcRoot) {
          return;
        }

        const element = this.items[index];
        if (element) {
          element.classList.add(className);
        }
      },
      removeClassForElementIndex: (index, className) => {
        if (!this.mdcRoot) {
          return;
        }

        const element = this.items[index];
        if (element) {
          element.classList.remove(className);
        }
      },
      focusItemAtIndex: (index) => {
        if (!this.mdcRoot) {
          return;
        }

        const element = this.items[index];
        if (element && isNodeElement(element)) {
          (element as HTMLElement).focus();
        }
      },
      setTabIndexForListItemChildren: (index, tabIndex) => {
        if (!this.mdcRoot) {
          return;
        }

        const element = this.items[index];
        if (element) {
          element.setControlTabIndex(tabIndex);
        }
      },
      hasCheckboxAtIndex: (index) => {
        if (!this.mdcRoot) {
          return false;
        }

        const element = this.items[index];
        return element ? element.hasCheckbox : false;
      },
      hasRadioAtIndex: (index) => {
        if (!this.mdcRoot) {
          return false;
        }

        const element = this.items[index];
        return element ? element.hasRadio : false;
      },
      isCheckboxCheckedAtIndex: (index) => {
        if (!this.mdcRoot) {
          return false;
        }

        const element = this.items[index];
        return element ? element.hasCheckbox && element.isControlChecked() : false;
      },
      setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {
        if (!this.mdcRoot) {
          return;
        }

        const element = this.items[index];
        if (element) {
          element.setControlChecked(isChecked);
        }
      },
      notifyAction: (index) => {
        if (!this.mdcRoot) {
          return;
        }

        const init: CustomEventInit = {bubbles: true};
        init.detail = {index};
        const ev = new CustomEvent('action', init);
        this.mdcRoot.dispatchEvent(ev);
      },
      isFocusInsideList: () => {
        if (!this.mdcRoot) {
          return false;
        }

        return this.doContentsHaveFocus();
      },
      isRootFocused: () => {
        if (!this.mdcRoot) {
          return false;
        }

        const mdcRoot = this.mdcRoot;
        const root = mdcRoot.getRootNode() as unknown as DocumentOrShadowRoot;
        return root.activeElement === mdcRoot;
      },
      listItemAtIndexHasClass: (index, className) => {
        if (!this.mdcRoot) {
          return false;
        }

        const item = this.items[index];

        if (!item) {
          return false;
        }

        return item.classList.contains(className);
      },
    };
  }

  protected getSlottedActiveElement(): Element|null {
    const first = this.items[0];
    if (!first) {
      return null;
    }

    const root = first.getRootNode() as unknown as DocumentOrShadowRoot;
    return root ? root.activeElement : null;
  }

  protected doContentsHaveFocus(): boolean {
    const activeElement = this.getSlottedActiveElement();
    if (!activeElement) {
      return false;
    }

    const elements = this.assignedElements;

    return elements.reduce((isContained: boolean, listItem) => {
      return isContained || listItem === activeElement ||
          listItem.contains(activeElement);
    }, false);
  }

  protected listOnFocusin(evt: FocusEvent) {
    if (this.mdcFoundation && this.mdcRoot) {
      const index = this.getIndexOfTarget(evt);
      this.mdcFoundation.handleFocusIn(evt, index);
    }
  }

  protected listOnFocusout(evt: FocusEvent) {
    if (this.mdcFoundation && this.mdcRoot) {
      const index = this.getIndexOfTarget(evt);
      this.mdcFoundation.handleFocusOut(evt, index);
    }
  }

  protected listOnKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation && this.mdcRoot) {
      const index = this.getIndexOfTarget(evt);
      const target = evt.target as Element;
      const isRootListItem = target instanceof ListItemBase;
      this.mdcFoundation.handleKeydown(evt, isRootListItem, index);
    }
  }

  protected listOnClick(evt: MouseEvent) {
    if (this.mdcFoundation && this.mdcRoot) {
      const index = this.getIndexOfTarget(evt);
      const target = evt.target as Element | null;
      const toggleCheckbox = target && 'getAttribute' in target ?
          target.getAttribute('role') === 'radio' &&
              target.getAttribute('aria-checked') === 'true' :
          false;
      this.mdcFoundation.handleClick(index, toggleCheckbox);
    }
  }

  protected getIndexOfTarget(evt: Event): number {
    const elements = this.items;
    const path = evt.composedPath();

    for (const pathItem of path) {
      let index = -1;
      if (pathItem instanceof ListItemBase) {
        index = elements.indexOf(pathItem);
      }

      if (index !== -1) {
        return index;
      }
    }

    return -1;
  }
}
