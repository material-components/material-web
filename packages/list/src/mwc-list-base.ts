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

import {BaseElement} from '@material/mwc-base/base-element.js';
import {observer} from '@material/mwc-base/observer.js';
import {deepActiveElementPath, doesElementContainFocus, findAssignedElement, isNodeElement} from '@material/mwc-base/utils.js';
import {html, property, query} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined.js';

import {MDCListAdapter} from './mwc-list-adapter.js';
import MDCListFoundation, {ActionDetail, isIndexSet, SelectedDetail} from './mwc-list-foundation.js';
import {MWCListIndex} from './mwc-list-foundation.js';
import {ListItemBase, RequestSelectedDetail} from './mwc-list-item-base.js';

export {createSetFromIndex, isEventMulti, isIndexSet, MWCListIndex} from './mwc-list-foundation.js';


const isListItem = (element: Element): element is ListItemBase => {
  return element.hasAttribute('mwc-list-item');
};

/**
 * @fires selected {SelectedDetail}
 * @fires action {ActionDetail}
 */
export abstract class ListBase extends BaseElement {
  protected mdcFoundation!: MDCListFoundation;
  protected mdcAdapter: MDCListAdapter|null = null;

  protected readonly mdcFoundationClass = MDCListFoundation;

  @query('.mdc-list') protected mdcRoot!: HTMLElement;

  @query('slot') protected slotElement!: HTMLSlotElement|null;

  @property({type: Boolean})
  @observer(function(this: ListBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setUseActivatedClass(value);
    }
  })
  activatable = false;


  @property({type: Boolean})
  @observer(function(this: ListBase, newValue: boolean, oldValue: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setMulti(newValue);
    }

    if (oldValue !== undefined) {
      this.layout();
    }
  })
  multi = false;

  @property({type: Boolean})
  @observer(function(this: ListBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setWrapFocus(value);
    }
  })
  wrapFocus = false;

  @property({type: String})
  @observer(function(this: ListBase, _newValue, oldValue: string|null) {
    if (oldValue !== undefined) {
      this.updateItems();
    }
  })
  itemRoles: string|null = null;

  @property({type: String}) innerRole: string|null = null;

  @property({type: String}) innerAriaLabel: string|null = null;

  @property({type: Boolean}) rootTabbable = false;

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
      return slot.assignedNodes({flatten: true}).filter<Element>(isNodeElement);
    }

    return [];
  }

  protected items_: ListItemBase[] = [];

  get items(): ListItemBase[] {
    return this.items_;
  }

  protected updateItems() {
    const nodes = this.assignedElements;

    const listItems: ListItemBase[] = [];

    for (const node of nodes) {
      if (isListItem(node)) {
        listItems.push(node);
      }

      if (node.hasAttribute('divider') && !node.hasAttribute('role')) {
        node.setAttribute('role', 'separator');
      }
    }

    this.items_ = listItems;
    const selectedIndices = new Set<number>();

    this.items_.forEach((item, index) => {
      if (this.itemRoles) {
        item.setAttribute('role', this.itemRoles);
      } else {
        item.removeAttribute('role');
      }

      if (item.selected) {
        selectedIndices.add(index);
      }
    });

    if (this.multi) {
      this.select(selectedIndices);
    } else {
      const index =
          selectedIndices.size ? selectedIndices.entries().next().value[1] : -1;
      this.select(index);
    }
  }

  get selected(): ListItemBase|ListItemBase[]|null {
    const index = this.index;

    if (!isIndexSet(index)) {
      if (index === -1) {
        return null;
      }

      return this.items[index];
    }

    const selected: ListItemBase[] = [];

    for (const entry of index) {
      selected.push(this.items[entry]);
    }

    return selected;
  }

  get index(): MWCListIndex {
    if (this.mdcFoundation) {
      return this.mdcFoundation.getSelectedIndex();
    }

    return -1;
  }

  render() {
    const role = this.innerRole === null ? undefined : this.innerRole;
    const ariaLabel =
        this.innerAriaLabel === null ? undefined : this.innerAriaLabel;
    const tabindex = this.rootTabbable ? '0' : '-1';
    return html`
      <!-- @ts-ignore -->
      <ul
          tabindex=${tabindex}
          role="${ifDefined(role)}"
          aria-label="${ifDefined(ariaLabel)}"
          class="mdc-list"
          @keydown=${this.onKeydown}
          @focusin=${this.onFocusIn}
          @focusout=${this.onFocusOut}
          @request-selected=${this.onRequestSelected}
          @list-item-rendered=${this.onListItemConnected}>
        <slot></slot>
      </ul>
    `;
  }

  firstUpdated() {
    super.firstUpdated();

    if (!this.items.length) {
      // required because this is called before observers
      this.mdcFoundation.setMulti(this.multi);
      // for when children upgrade before list
      this.layout();
    }
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
      const isRootListItem = isListItem(target);
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

      const selected = evt.detail.selected;
      const source = evt.detail.source;

      this.mdcFoundation.handleSingleSelection(
          index, source === 'interaction', selected);

      evt.stopPropagation();
    }
  }

  protected getIndexOfTarget(evt: Event): number {
    const elements = this.items;
    const path = evt.composedPath();

    for (const pathItem of path as Node[]) {
      let index = -1;
      if (isNodeElement(pathItem) && isListItem(pathItem)) {
        index = elements.indexOf(pathItem);
      }

      if (index !== -1) {
        return index;
      }
    }

    return -1;
  }

  protected createAdapter(): MDCListAdapter {
    this.mdcAdapter = {
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

          if (isListItem(activeItem)) {
            return this.items.indexOf(activeItem);
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
      focusItemAtIndex: (index) => {
        const element = this.items[index];
        if (element) {
          element.focus();
        }
      },
      setTabIndexForElementIndex: (index, value) => {
        const item = this.items[index];

        if (item) {
          item.tabindex = value;
        }
      },
      notifyAction: (index) => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        init.detail = {index};
        const ev = new CustomEvent<ActionDetail>('action', init);
        this.dispatchEvent(ev);
      },
      notifySelected: (index, diff) => {
        const init: CustomEventInit = {bubbles: true, composed: true};
        init.detail = {index, diff};
        const ev = new CustomEvent<SelectedDetail>('selected', init);
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
      setDisabledStateForElementIndex: (index, value) => {
        const item = this.items[index];

        if (!item) {
          return;
        }

        item.disabled = value;
      },
      getDisabledStateForElementIndex: (index) => {
        const item = this.items[index];

        if (!item) {
          return false;
        }

        return item.disabled;
      },
      setSelectedStateForElementIndex: (index, value) => {
        const item = this.items[index];

        if (!item) {
          return;
        }

        item.selected = value;
      },
      getSelectedStateForElementIndex: (index) => {
        const item = this.items[index];

        if (!item) {
          return false;
        }

        return item.selected;
      },
      setActivatedStateForElementIndex: (index, value) => {
        const item = this.items[index];

        if (!item) {
          return;
        }

        item.activated = value;
      },
    };

    return this.mdcAdapter;
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

  select(index: MWCListIndex) {
    if (!this.mdcFoundation) {
      return;
    }

    this.mdcFoundation.setSelectedIndex(index);
  }

  toggle(index: number, force?: boolean) {
    if (this.multi) {
      this.mdcFoundation.toggleMultiAtIndex(index, force);
    }
  }

  protected onListItemConnected(e: Event) {
    const target = e.target as ListItemBase;

    this.layout(this.items.indexOf(target) === -1);
  }

  layout(updateItems = true) {
    if (updateItems) {
      this.updateItems();
    }

    const first: ListItemBase|undefined = this.items[0];

    for (const item of this.items) {
      item.tabindex = -1;
    }

    if (first) {
      if (this.noninteractive) {
        if (!this.previousTabindex) {
          this.previousTabindex = first;
        }
      } else {
        first.tabindex = 0;
      }
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
