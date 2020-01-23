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

import {MDCListAdapter} from '@material/list/adapter';
import MDCListFoundation from '@material/list/foundation.js';
import {BaseElement, observer} from '@material/mwc-base/base-element.js';
import {deepActiveElementPath, doesElementContainFocus, findAssignedElement, isNodeElement} from '@material/mwc-base/utils';
import {html, property, query} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined';

import {ListItemBase, RequestSelectedDetail} from './mwc-list-item-base';

export {MDCListIndex} from '@material/list/types';

export abstract class ListBase extends BaseElement {
  protected mdcFoundation!: MDCListFoundation;

  protected readonly mdcFoundationClass = MDCListFoundation;

  @query('.mdc-list') protected mdcRoot!: HTMLElement;

  @query('slot') protected slotElement!: HTMLSlotElement|null;

  @property({type: Boolean})
  @observer(function(this: ListBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setSingleSelection(!value);
    }
  })
  selectable = false;

  @property({type: Boolean})
  @observer(function(this: ListBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setUseActivatedClass(value);
    }
  })
  activatable = false;

  @property({type: Boolean})
  @observer(function(this: ListBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setWrapFocus(!value);
    }
  })
  wrapFocus = false;

  @property({type: String})
  @observer(function(this: ListBase) {
    this.updateItems();
  })
  itemRoles: string|null = null;

  @property({type: String}) innerRole: string|null = null;


  protected previousTabindex: Element|null = null;

  @property({type: Boolean, reflect: true})
  @observer(function(this: ListBase, value: boolean) {
    const slot = this.slotElement;

    if (value && slot) {
      const tabbable = findAssignedElement(slot, '[tabindex="0"]');
      this.previousTabindex = tabbable;
      if (tabbable) {
        tabbable.setAttribute('tabindex', '-1');
      }
    } else if (!value && this.previousTabindex) {
      this.previousTabindex.setAttribute('tabindex', '0');
      this.previousTabindex = null;
    }
  })
  noninteractive = false;

  protected get assignedElements(): Element[] {
    const slot = this.slotElement;

    if (slot) {
      return slot.assignedNodes({flatten: true})
                 .filter((node) => isNodeElement(node)) as Element[];
    }

    return [];
  }

  protected items_: ListItemBase[] = [];

  get items(): ListItemBase[] {
    return this.items_;
  }

  protected updateItems() {
    const nodes = this.assignedElements;
    const listItems =
        nodes
            .map<Element|Element[]>((element) => {
              if (element.hasAttribute('mwc-list-item')) {
                return element;
              }

              if (element.hasAttribute('divider') &&
                  !element.hasAttribute('role')) {
                element.setAttribute('role', 'separator');
              }

              return Array.from(element.querySelectorAll('[mwc-list-item]'));
            })
            .reduce<Element[]>((listItems, listItemResult) => {
              return listItems.concat(listItemResult);
            }, []);

    this.items_ = listItems as ListItemBase[];
    const selectedIndicies: number[] = [];

    this.items_.forEach((item, index) => {
      if (this.itemRoles) {
        item.setAttribute('role', this.itemRoles);
      } else {
        item.removeAttribute('role');
      }

      if (item.selected) {
        selectedIndicies.push(index);
      }
    });

    if (selectedIndicies.length) {
      const index = selectedIndicies.length === 1 ? selectedIndicies[0] :
                                                    selectedIndicies;
      this.select(index);
    }
  }

  get selected(): ListItemBase|ListItemBase[]|null {
    const index = this.index;

    if (Number.isInteger(index as number)) {
      if (index === -1) {
        return null;
      }

      return this.items[index as number];
    }

    return (index as number[]).map((i) => this.items[i]);
  }

  get index(): number|number[] {
    if (this.mdcFoundation) {
      return this.mdcFoundation.getSelectedIndex();
    }

    return -1;
  }

  render() {
    return html`
      <!-- @ts-ignore -->
      <ul
          role="${ifDefined(this.innerRole)}"
          class="mdc-list"
          @keydown=${this.onKeydown}
          @focusin=${this.onFocusIn}
          @focusout=${this.onFocusOut}
          @request-selected=${this.onRequestSelected}>
        <slot
            @slotchange=${this.onSlotChange}
            @list-item-rendered=${this.onListItemConnected}>
        </slot>
      </ul>
    `;
  }

  protected onFocusIn(evt: FocusEvent) {
    if (this.mdcFoundation && this.mdcRoot) {
      const index = this.getIndexOfTarget(evt);
      this.mdcFoundation.handleFocusIn(evt, index);
    }
  }

  protected onFocusOut(evt: FocusEvent) {
    if (this.mdcFoundation && this.mdcRoot) {
      const index = this.getIndexOfTarget(evt);
      this.mdcFoundation.handleFocusOut(evt, index);
    }
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation && this.mdcRoot) {
      const index = this.getIndexOfTarget(evt);
      const target = evt.target as Element;
      const isRootListItem = target.hasAttribute('mwc-list-item');
      this.mdcFoundation.handleKeydown(evt, isRootListItem, index);
    }
  }

  protected onRequestSelected(evt: CustomEvent<RequestSelectedDetail>) {
    if (this.mdcFoundation) {
      const index = this.getIndexOfTarget(evt);

      if (index === -1) {
        return;
      }

      const element = this.items[index];

      if (element.disabled) {
        return;
      }

      const toggleCheckbox = evt.detail.hasCheckboxOrRadio;

      this.mdcFoundation.handleClick(index, toggleCheckbox);
    }
  }

  protected getIndexOfTarget(evt: Event): number {
    const elements = this.items;
    const path = evt.composedPath();

    for (const pathItem of path) {
      let index = -1;
      if (isNodeElement(pathItem as Node) &&
          (pathItem as HTMLElement).hasAttribute('mwc-list-item')) {
        index = elements.indexOf(pathItem as ListItemBase);
      }

      if (index !== -1) {
        return index;
      }
    }

    return -1;
  }

  createAdapter(): MDCListAdapter {
    return {
      getListItemCount: () => {
        if (this.mdcRoot) {
          return this.items.length;
        }

        return 0;
      },
      getFocusedElementIndex: () => {
        if (!this.mdcRoot) {
          return -1;
        }

        if (!this.items.length) {
          return -1;
        }

        const activeElementPath = deepActiveElementPath();

        if (!activeElementPath.length) {
          return -1;
        }

        for (let i = activeElementPath.length - 1; i >= 0; i--) {
          const activeItem = activeElementPath[i];

          if (activeItem.hasAttribute('mwc-list-item')) {
            return this.items.indexOf(activeItem as ListItemBase);
          }
        }

        return -1;
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
          if (className === 'mdc-list-item--selected') {
            this.selectUi(index);
          } else if (className === 'mdc-list-item--activated') {
            this.selectUi(index, true);
          } else {
            element.classList.add(className);
          }
        }
      },
      removeClassForElementIndex: (index, className) => {
        const element = this.items[index];

        if (!element) {
          this.remove;
        }

        element.classList.remove(className);

        if (className === 'mdc-list-item--selected' ||
            className === 'mdc-list-item--activated') {
          this.deselectUi(index);
        }
      },
      focusItemAtIndex: (index) => {
        const element = this.items[index];
        if (element && isNodeElement(element)) {
          (element as HTMLElement).focus();
        }
      },
      setTabIndexForListItemChildren: () => { /* Handled by list-item-base */ },
      hasCheckboxAtIndex: (index) => {
        const element = this.items[index];
        const isChecklist =
            element ? element.hasAttribute('mwc-check-list-item') : false;

        if (isChecklist) {
          this.innerRole = 'group';
          this.itemRoles = 'checkbox';
        }

        return isChecklist;
      },
      hasRadioAtIndex: (index) => {
        const element = this.items[index];
        const isRadioList =
            element ? element.hasAttribute('mwc-radio-list-item') : false;

        if (isRadioList) {
          this.innerRole = 'radiogroup';
          this.itemRoles = 'radio';
        }

        return isRadioList;
      },
      isCheckboxCheckedAtIndex: (index) => {
        const element = this.items[index];
        const hasCheckbox = element.hasAttribute('mwc-check-list-item');
        return element ? hasCheckbox && element.selected : false;
      },
      setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {
        const element = this.items[index];
        if (element) {
          element.selected = isChecked;
        }
      },
      notifyAction: (index) => {
        const init: CustomEventInit = {bubbles: true};
        init.detail = {index};
        const ev = new CustomEvent('action', init);
        this.dispatchEvent(ev);
      },
      isFocusInsideList: () => {
        return doesElementContainFocus(this);
      },
      isRootFocused: () => {
        const mdcRoot = this.mdcRoot;
        const root = mdcRoot.getRootNode() as unknown as DocumentOrShadowRoot;
        return root.activeElement === mdcRoot;
      },
      listItemAtIndexHasClass: (index, className) => {
        const item = this.items[index];

        if (!item) {
          return false;
        }

        return item.classList.contains(className);
      },
    };
  }

  protected selectUi(index: number, activate = false) {
    const item = this.items[index];
    if (item) {
      item.selected = true;
      item.activated = activate;
    }
  }

  protected deselectUi(index: number) {
    const item = this.items[index];
    if (item) {
      item.selected = false;
      item.activated = false;
    }
  }

  select(index: number|number[]) {
    if (!this.mdcFoundation) {
      return;
    }

    this.mdcFoundation.setSelectedIndex(index);

    if (Number.isInteger(index as number)) {
      this.selectUi(index as number);
    } else {
      for (const i of index as number[]) {
        this.selectUi(i);
      }
    }

    const selectedEvInit = {
      bubbles: true,
      composed: true,
      detail: {index},
    };
    const selectedEv =
        new CustomEvent<{index: number | number[]}>('selected', selectedEvInit);
    this.dispatchEvent(selectedEv);
  }

  onSlotChange() {
    this.layout();
  }

  onListItemConnected(e) {
    const target = e.target as ListItemBase;

    if (this.items.indexOf(target) === -1) {
      this.updateItems();
    }

    this.layout(false);
  }

  layout(updateItems = true) {
    if (updateItems) {
      this.updateItems();
    }

    this.mdcFoundation.layout();
    const first = this.items[0];

    if (first) {
      first.setAttribute('tabIndex', '0');
    }
  }

  focus() {
    const root = this.mdcRoot;

    if (root) {
      root.focus();
    }
  }

  blur() {
    const root = this.mdcRoot;

    if (root) {
      root.blur();
    }
  }
}
