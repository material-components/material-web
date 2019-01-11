var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

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
import { BaseElement, customElement, query, html, property, observer } from '@material/mwc-base/base-element.js';
import { ListItem } from '@material/mwc-list';
import { MDCList } from '@material/list';
import { MDCMenuFoundation, Corner } from '@material/menu';
import { MDCMenuSurface } from '@material/menu-surface';
import { emit } from '@material/mwc-base/utils';
import { style } from './mwc-menu-css.js';
let Menu = class Menu extends BaseElement {
    constructor() {
        super(...arguments);
        this.selectionGroup = false;
        this.open = false;
        this.multiselect = false;
        this._selectedIndex = -1;
        this.mdcFoundationClass = MDCMenuFoundation;
    }
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        this._selectedIndex = value;
        const selectedElement = this.items[this._selectedIndex];
        this._list.selectedIndex = this.enabledItems.indexOf(selectedElement);
    }
    get Corner() {
        return Corner;
    }
    get items() {
        return this.shadowRoot
            .querySelector('slot')
            .assignedNodes({ flatten: true })
            .filter(el => el instanceof ListItem)
            .map(el => el);
    }
    get enabledItems() {
        return this.items.filter(el => el.getAttribute('aria-disabled') === 'false');
    }
    get selectedItems() {
        return this.items.filter(el => el.getAttribute('aria-selected') === 'true');
    }
    get _menuSurface() {
        if (!this._menuSurfaceInstance) {
            let previousFocus_;
            this._menuSurfaceInstance = new MDCMenuSurface(this.mdcRoot);
            this._menuSurfaceInstance.foundation_.adapter_.isFocused = () => {
                return document.activeElement === this.mdcRoot;
            };
            this._menuSurfaceInstance.foundation_.adapter_.saveFocus = () => {
                if (document.activeElement) {
                    previousFocus_ = document.activeElement.shadowRoot
                        ? document.activeElement.shadowRoot.activeElement
                        : document.activeElement;
                }
            };
            this._menuSurfaceInstance.foundation_.adapter_.restoreFocus = () => {
                if (this.mdcRoot.contains(document.activeElement)) {
                    if (previousFocus_ && previousFocus_.focus) {
                        previousFocus_.focus();
                    }
                }
            };
            this._menuSurfaceInstance.foundation_.adapter_.isElementInContainer = el => {
                return this === el || this.contains(el);
            };
        }
        return this._menuSurfaceInstance;
    }
    get _list() {
        if (!this._listInstance) {
            this._listInstance = new MDCList(this.list);
            this._listInstance.wrapFocus = true;
            this._listInstance.selectedIndex = this.selectedIndex;
            // Prevents default listeners conflicts
            this._listInstance.destroy();
            this._listInstance.getListItemIndex_ = evt => {
                return evt.target instanceof ListItem ? this.enabledItems.indexOf(evt.target) : -1;
            };
            this._listInstance.handleKeydown_ = evt => {
                const index = this._listInstance.getListItemIndex_(evt);
                if (index >= 0) {
                    this._listInstance.foundation_.handleKeydown(evt, evt.target instanceof ListItem, index);
                }
            };
            this._listInstance.foundation_.adapter_ = Object.assign({}, this._listInstance.foundation_.adapter_, { getListItemCount: () => this.enabledItems.length, getFocusedElementIndex: () => {
                    return this.enabledItems.indexOf(document.activeElement);
                }, setAttributeForElementIndex: (index, attr, value) => {
                    const element = this.enabledItems[index];
                    if (element) {
                        element.setAttribute(attr, value);
                    }
                }, removeAttributeForElementIndex: (index, attr) => {
                    const element = this.enabledItems[index];
                    if (element) {
                        element.removeAttribute(attr);
                    }
                }, addClassForElementIndex: (index, className) => {
                    const element = this.enabledItems[index];
                    if (element) {
                        element.classList.add(className);
                    }
                }, removeClassForElementIndex: (index, className) => {
                    const element = this.enabledItems[index];
                    if (element) {
                        element.classList.remove(className);
                    }
                }, focusItemAtIndex: (index) => {
                    const element = this.enabledItems[index];
                    if (element) {
                        element.focus();
                    }
                }, setTabIndexForListItemChildren: (listItemIndex, tabIndexValue) => {
                    const element = this.enabledItems[listItemIndex];
                    element.setAttribute('tabindex', tabIndexValue);
                }, followHref: (index) => {
                    const listItem = this.enabledItems[index];
                    if (listItem && listItem['href']) {
                        listItem.click();
                    }
                }, toggleCheckbox: ( /* index */) => {
                    // let checkboxOrRadioExists = false;
                    // const listItem = this.enabledItems[index];
                    // const elementsToToggle =
                    //   [].slice.call(listItem.querySelectorAll(strings.CHECKBOX_RADIO_SELECTOR));
                    // elementsToToggle.forEach((element) => {
                    //   const event = document.createEvent('Event');
                    //   event.initEvent('change', true, true);
                    //   if (!element.checked || element.type !== 'radio') {
                    //     element.checked = !element.checked;
                    //     element.dispatchEvent(event);
                    //   }
                    //   checkboxOrRadioExists = true;
                    // });
                    // return checkboxOrRadioExists;
                    return false;
                } });
        }
        return this._listInstance;
    }
    renderStyle() {
        return style;
    }
    createAdapter() {
        return Object.assign({}, super.createAdapter(), { addClassToElementAtIndex: (index, className) => {
                const list = this.items;
                list[index].classList.add(className);
            }, removeClassFromElementAtIndex: (index, className) => {
                const list = this.items;
                list[index].classList.remove(className);
            }, addAttributeToElementAtIndex: (index, attr, value) => {
                const list = this.items;
                list[index].setAttribute(attr, value);
            }, removeAttributeFromElementAtIndex: (index, attr) => {
                const list = this.items;
                list[index].removeAttribute(attr);
            }, elementContainsClass: (element, className) => {
                return element && element.classList.contains(className);
            }, closeSurface: () => {
                this.open = false;
            }, getElementIndex: element => this.items.indexOf(element), getParentElement: element => {
                if (!element)
                    return null;
                switch (element.localName) {
                    case 'mwc-list-item':
                        return this._selectionGroup || this.list;
                    default:
                        return element.parentElement;
                }
            }, getSelectedElementIndex: () => {
                const selectedElement = this.selectedItems[0];
                return this.items.indexOf(selectedElement);
            }, notifySelected: (evtData) => {
                this._notifySelected(evtData);
            } });
    }
    firstUpdated() {
        super.firstUpdated();
        this._handleKeydown = evt => {
            this.mdcFoundation.handleKeydown(evt);
            this._list.handleKeydown_(evt);
        };
        this._handleClick = evt => this.mdcFoundation.handleClick(evt);
        this._menuSurface.listen('MDCMenuSurface:opened', () => this._afterOpenedCallback());
        this._menuSurface.listen('MDCMenuSurface:closed', () => this._afterClosedCallback());
    }
    render() {
        return html `
      ${this.renderStyle()}
      <div class="mdc-menu mdc-menu-surface" tabindex="-1">
        <div class="mdc-menu__items mdc-list" role="menu" aria-hidden="true">
          <div class="${this.selectionGroup ? 'mdc-menu__selection-group' : ''}">
            <slot></slot>
          </div>
        </div>
      </div>`;
    }
    _notifySelected(data) {
        const selectedElement = this.items[data.index];
        this._list.selectedIndex = this.enabledItems.indexOf(selectedElement);
        this.selectedIndex = data.index;
        emit(this, 'MDCMenu:selected', { index: data.index, item: this.items[data.index] });
    }
    /**
     * Default anchor corner alignment of top-left
     */
    setAnchorCorner(corner) {
        this._menuSurface.setAnchorCorner(corner);
    }
    setAnchorMargin(margin) {
        this._menuSurface.setAnchorMargin(margin);
    }
    /**
     * Return the item within the menu at the index specified.
     */
    getOptionByIndex(index) {
        const items = this.items;
        if (index < items.length) {
            return this.items[index];
        }
        else {
            return null;
        }
    }
    set quickOpen(quickOpen) {
        this._menuSurface.quickOpen = quickOpen;
    }
    setFixedPosition(isFixed) {
        this._menuSurface.setFixedPosition(isFixed);
    }
    /**
     * Return the menu width
     */
    getWidth() {
        this.mdcRoot.style.display = 'block';
        const width = this.mdcRoot.offsetWidth;
        this.mdcRoot.style.display = null;
        return width;
    }
    hoistMenuToBody() {
        this._menuSurface.hoistMenuToBody();
    }
    setIsHoisted(isHoisted) {
        this._menuSurface.setIsHoisted(isHoisted);
    }
    setAbsolutePosition(x, y) {
        this._menuSurface.setAbsolutePosition(x, y);
    }
    setAnchorElement(element) {
        this._menuSurface.anchorElement = element;
    }
    _afterOpenedCallback() {
        if (this.enabledItems.length > 0) {
            this.items[this.selectedIndex !== -1 ? this.selectedIndex : 0].focus();
        }
        emit(this, 'MDCMenu:opened');
        document.addEventListener('keydown', this._handleKeydown);
        this.addEventListener('click', this._handleClick);
    }
    _afterClosedCallback() {
        this.open = false;
        emit(this, 'MDCMenu:closed');
        document.removeEventListener('keydown', this._handleKeydown);
        this.removeEventListener('click', this._handleClick);
    }
};
__decorate([
    query('.mdc-menu')
], Menu.prototype, "mdcRoot", void 0);
__decorate([
    query('.mdc-list')
], Menu.prototype, "list", void 0);
__decorate([
    query('.mdc-menu__selection-group')
], Menu.prototype, "_selectionGroup", void 0);
__decorate([
    property({ type: Boolean })
], Menu.prototype, "selectionGroup", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (value) {
        if (value !== this._menuSurface.open) {
            this._menuSurface.open = value;
        }
    })
], Menu.prototype, "open", void 0);
__decorate([
    property({ type: Boolean })
], Menu.prototype, "multiselect", void 0);
Menu = __decorate([
    customElement('mwc-menu')
], Menu);
export { Menu };
//# sourceMappingURL=mwc-menu.js.map