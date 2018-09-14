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
import {ComponentElement, html, MDCWebComponentMixin} from '@material/mwc-base/component-element.js';
import {MDCMenu, Corner} from '@material/menu';
import {style} from './mwc-menu-css.js';

// this element depend on the `mwc-list-item` and `mwc-list-item-separator`
// elements to be registered ahead of time
import '@material/mwc-list/mwc-list-item.js';
import '@material/mwc-list/mwc-list-item-separator.js';

export class MDCWCMenu extends MDCWebComponentMixin(MDCMenu) {
  get items() {
    return this.host.items;
  }

  get listItems() {
    return this.items.map((e) => e.listItem);
  }

  get anchor() {
    const parent = this.host.parentNode;
    if (parent.matches('mdc-menu-anchor')) {
      return parent;
    }
  }

  createAdapter() {
    return {
      hasAnchor: () => this.anchor,
      getAnchorDimensions: () => this.anchor.getBoundingClientRect(),
      isFocused: () => this.activeElement === this.host,
      getFocusedItemIndex: () => this.items.indexOf(this.activeElement),
      setAttrForOptionAtIndex: (index, attr, value) => this.listItems[index].setAttribute(attr, value),
      rmAttrForOptionAtIndex: (index, attr) => this.listItems[index].removeAttribute(attr),
      addClassForOptionAtIndex: (index, className) => this.listItems[index].classList.add(className),
      rmClassForOptionAtIndex: (index, className) => this.listItems[index].classList.remove(className),
      // TODO(sorvell): this is only used for disable-ment and we want this to come off of
      // the wrapped list item. This would be easier if there was an explicit `isItemDisabled`.
      getAttributeForEventTarget: (target, attr) => {
        target = target.listItem || target;
        return target.getAttribute(attr);
      },
    };
  }
}

export class Menu extends ComponentElement {
  static get ComponentClass() {
    return MDCWCMenu;
  }

  static get componentSelector() {
    return '.mdc-menu';
  }

  get Corner() {
    return Corner;
  }

  constructor() {
    super();
    this._asyncComponent = true;
  }

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-menu" tabindex="-1">
        <div class="mdc-menu__items mdc-list" role="menu" aria-hidden="true">
          <slot></slot>
        </div>
      </div>`;
  }

  get items() {
    return this.shadowRoot.querySelector('slot').assignedNodes({flatten: true})
      .filter((e) => e.localName == 'mwc-list-item');
  }

  get open() {
    return this._component && this._component.open;
  }

  /** @param {boolean} value */
  set open(value) {
    this.componentReady().then((component) => {
      component.open = value;
    });
  }

  /** @param {{focusIndex: ?number}=} options */
  show({focusIndex = null} = {}) {
    this.componentReady().then((component) => {
      component.open({focusIndex: focusIndex});
    });
  }

  close() {
    this.componentReady().then((component) => {
      component.close();
    });
  }

  /**
   * @param {Corner} corner Default anchor corner alignment of top-left
   *     menu corner.
   */
  setAnchorCorner(corner) {
    this.componentReady().then((component) => {
      component.setAnchorCorner(corner);
    });
  }

  /**
   * @param {AnchorMargin} margin
   */
  setAnchorMargin(margin) {
    this.componentReady().then((component) => {
      component.setAnchorMargin(margin);
    });
  }

  /**
   * Return the item within the menu that is selected.
   * @param {number} index
   * @return {?Element}
   */
  getOptionByIndex(index) {
    return this._component && this._component.getOptionByIndex(index);
  }

  /** @param {number} index */
  set selectedItemIndex(index) {
    this.componentReady().then((component) => {
      component.setSelectedIndex(index);
    });
  }

  /** @return {number} */
  get selectedItemIndex() {
    return this._component && this._component.getSelectedIndex();
  }

  /** @param {!boolean} rememberSelection */
  set rememberSelection(rememberSelection) {
    this.componentReady().then((component) => {
      component.setRememberSelection(rememberSelection);
    });
  }

  /** @param {boolean} quickOpen */
  set quickOpen(quickOpen) {
    this.componentReady().then((component) => {
      component.setQuickOpen(quickOpen);
    });
  }
}

customElements.define('mwc-menu', Menu);
