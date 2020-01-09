/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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
import '@material/mwc-list';

import {closest} from '@material/dom/ponyfill';
import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation.js';
import {MDCLineRippleFoundation} from '@material/line-ripple/foundation.js';
import {MDCMenuSurfaceAdapter} from '@material/menu-surface/adapter';
import MDCMenuSurfaceFoundation from '@material/menu-surface/foundation.js';
import {MDCMenuAdapter} from '@material/menu/adapter';
import MDCMenuFoundation from '@material/menu/foundation.js';
import {addHasRemoveClass, FormElement, observer} from '@material/mwc-base/form-element.js';
import {isNodeElement, slotActiveElement, doesSlotContainElement} from '@material/mwc-base/utils';
import {floatingLabel, FloatingLabel} from '@material/mwc-floating-label';
import {lineRipple, LineRipple} from '@material/mwc-line-ripple';
import {List} from '@material/mwc-list';
import {ListItemBase} from '@material/mwc-list/mwc-list-item-base';
import {NotchedOutline} from '@material/mwc-notched-outline';
import {MDCSelectAdapter} from '@material/select/adapter';
import MDCSelectFoundation from '@material/select/foundation.js';
import {html, property, query, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

import * as mwcMenu from './mwc-menu-ponyfill';
import {menuAnchor} from './mwc-menu-surface-anchor-directive';

// must be done to get past lit-analyzer checks
declare global {
  interface Element {
    floatingLabelFoundation?: MDCFloatingLabelFoundation;
    lineRippleFoundation?: MDCLineRippleFoundation;
  }
}

export abstract class SelectBase extends FormElement {
  protected mdcFoundation!: MDCSelectFoundation;

  protected mdcMenuFoundation: MDCMenuFoundation|undefined;

  protected mdcMenuSurfaceFoundation: MDCMenuSurfaceFoundation|undefined;

  protected readonly mdcFoundationClass = MDCSelectFoundation;

  @query('.mdc-select') protected mdcRoot!: HTMLElement;

  @query('.formElement') protected formElement!: HTMLDivElement;

  @query('slot') protected slotElement!: HTMLSlotElement|null;

  @query('select') protected nativeSelectElement!: HTMLSelectElement|null;

  @query('input') protected nativeInputElement!: HTMLInputElement|null;

  @query('.mdc-line-ripple') protected lineRippleElement!: LineRipple|null;

  @query('.mdc-floating-label') protected labelElement!: FloatingLabel|null;

  @query('mwc-notched-outline') protected outlineElement!: NotchedOutline|null;

  @query('.mdc-menu') protected menuElement!: HTMLDivElement|null;

  @query('mwc-list') protected listElement!: List|null;

  @query('.mdc-select__selected-text')
  protected selectedTextElement!: HTMLDivElement|null;

  @query('.mdc-select__anchor') protected anchorElement!: HTMLDivElement|null;

  @property({type: Boolean, attribute: 'disabled', reflect: true})
  @observer(function(this: SelectBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setDisabled(value);
    }
  })
  disabled = false;

  @property({type: Boolean}) outlined = false;

  @property({type: String}) label = '';

  @property({type: Boolean}) outlineOpen = false;

  @property({type: Number}) outlineWidth = 0;

  @property({type: String}) value = '';

  @property({type: String}) protected selectedText = '';

  @property({type: String}) icon = '';

  protected listeners: ({
    target: Element;
    name: string;
    cb: EventListenerOrEventListenerObject;
  })[] = [];
  protected onBodyClickBound: (evt: MouseEvent) => void = () => {};
  protected _outlineUpdateComplete: null|Promise<unknown> = null;
  protected _listUpdateComplete: null|Promise<unknown> = null;

  render() {
    let outlinedOrUnderlined = html``;

    if (this.outlined) {
      outlinedOrUnderlined = this.renderOutlined();
    } else {
      outlinedOrUnderlined = this.renderUnderlined();
    }

    const classes = {
      'mdc-select--disabled': this.disabled,
      'mdc-select--no-label': !this.label,
      'mdc-select--outlined': this.outlined,
      'mdc-select--with-leading-icon': this.icon,
    };

    return html`
      <div class="mdc-select ${classMap(classes)}">
        <input class=".formElement" .value=${this.value} hidden>
        ${this.icon ? this.renderIcon(this.icon) : ''}
        <!-- @ts-ignore -->
        <div class="mdc-select__anchor" .anchoring=${menuAnchor('.mdc-menu')}>
          <i class="mdc-select__dropdown-icon"></i>
          <!-- @ts-ignore -->
          <div
              class="mdc-select__selected-text"
              role="button"
              aria-haspopup="listbox"
              aria-labelledby="label"
              @focus=${this.onFocus}
              @blur=${this.onBlur}
              @keydown=${this.onKeydown}
              @click=${this.onClick}>
            ${this.selectedText}
          </div>
          ${outlinedOrUnderlined}
        </div>
        <div
            role="listbox"
            class="mdc-select__menu mdc-menu mdc-menu-surface"
            @selected=${this.onSelected}
            @action=${this.menuOnAction}>
          <mwc-list class="mdc-list">
            <slot></slot>
          </mwc-list>
        </div>
      </div>`;
  }

  protected renderOutlined() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label) {
      labelTemplate = this.renderLabel();
    }
    return html`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${labelTemplate}
      </mwc-notched-outline>`;
  }

  protected renderUnderlined() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label) {
      labelTemplate = this.renderLabel();
    }

    return html`
      ${labelTemplate}
      <div .lineRippleFoundation=${lineRipple()}></div>
    `;
  }

  protected renderLabel() {
    return html`
      <label
          .floatingLabelFoundation=${floatingLabel(this.label)}
          @labelchange=${this.onLabelChange}
          id="label">
        ${this.label}
      </label>
    `;
  }

  protected renderIcon(icon: string) {
    return html`<i class="material-icons mdc-text-field__icon">${icon}</i>`;
  }

  createAdapter(): MDCSelectAdapter {
    this.createMenuSurfaceFoundation();
    this.createMenuFoundation();

    return {
      ...addHasRemoveClass(this.mdcRoot),
      activateBottomLine: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.activate();
        }
      },
      deactivateBottomLine: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.deactivate();
        }
      },
      getSelectedMenuItem: () => {
        const listElement = this.listElement;

        if (!listElement) {
          return null;
        }

        return listElement.selected;
      },
      hasLabel: () => {
        return !!this.label;
      },
      floatLabel: (shouldFloat) => {
        if (this.labelElement) {
          this.labelElement.floatingLabelFoundation.float(shouldFloat);
        }
      },
      getLabelWidth: () => {
        if (this.labelElement) {
          return this.labelElement.floatingLabelFoundation.getWidth();
        }

        return 0;
      },
      hasOutline: () => this.outlined,
      notchOutline: (labelWidth) => {
        const outlineElement = this.outlineElement;
        if (outlineElement && !this.outlineOpen) {
          this.outlineWidth = labelWidth;
          this.outlineOpen = true;
        }
      },
      closeOutline: () => {
        if (this.outlineElement) {
          this.outlineOpen = false;
        }
      },
      setRippleCenter: (normalizedX) => {
        if (this.lineRippleElement) {
          const foundation = this.lineRippleElement.lineRippleFoundation;
          foundation.setRippleCenter(normalizedX);
        }
      },
      notifyChange: (value) => {
        this.value = value;
        const ev = new Event('change', {bubbles: true});
        this.dispatchEvent(ev);
      },
      setSelectedText: (value) => this.selectedText = value,
      isSelectedTextFocused: () => {
        const selectedTextElement = this.selectedTextElement;

        if (!selectedTextElement) {
          return false;
        }

        const rootNode =
            selectedTextElement.getRootNode() as ShadowRoot | Document;

        return rootNode.activeElement === selectedTextElement;
      },
      getSelectedTextAttr: (attr) => {
        const selectedTextElement = this.selectedTextElement;

        if (!selectedTextElement) {
          return null;
        }

        return selectedTextElement.getAttribute(attr);
      },
      setSelectedTextAttr: (attr, value) => {
        const selectedTextElement = this.selectedTextElement;

        if (!selectedTextElement) {
          return;
        }

        return selectedTextElement.setAttribute(attr, value);
      },
      openMenu: () => {
        if (this.mdcMenuSurfaceFoundation) {
          mwcMenu.open(this.mdcMenuSurfaceFoundation);
        }
      },
      closeMenu: () => {
        if (this.mdcMenuSurfaceFoundation) {
          mwcMenu.close(this.mdcMenuSurfaceFoundation);
        }
      },
      getAnchorElement: () => this.anchorElement,
      setMenuAnchorElement: () => {
        /* Handled by anchor directive */
      },
      setMenuAnchorCorner: (anchorCorner) => {
        if (this.mdcMenuSurfaceFoundation) {
          mwcMenu.setAnchorCorner(this.mdcMenuSurfaceFoundation, anchorCorner);
        }
      },
      setMenuWrapFocus: (wrapFocus) => {
        const listElement = this.listElement;
        if (listElement) {
          listElement.wrapFocus(wrapFocus);
        }
      },
      setAttributeAtIndex: (index: number, attr: string, value: string) => {
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
      removeAttributeAtIndex: (index, attr) => {
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
      focusMenuItemAtIndex: (index) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }

        const element = listElement.items[index];

        if (!element) {
          return;
        }

        (element as HTMLElement).focus();
      },
      getMenuItemCount: () => {
        const listElement = this.listElement;

        if (listElement) {
          return listElement.items.length;
        }

        return 0;
      },
      getMenuItemValues: () => {
        const listElement = this.listElement;

        if (!listElement) {
          return [];
        }

        const items = listElement.items;

        return items.map((item) => item.value);
      },
      getMenuItemTextAtIndex: (index) => {
        const listElement = this.listElement;
        if (!listElement) {
          return '';
        }

        const element = listElement.items[index];

        if (!element) {
          return '';
        }

        return element.text;
      },
      getMenuItemAttr: (menuItem) => {
        const listItem = menuItem as ListItemBase;
        return listItem.value;
      },
      addClassAtIndex: (index, className) => {
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
      removeClassAtIndex: (index, className) => {
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
    };
  }

  createMenuFoundation() {
    if (!this.menuElement) {
      return;
    }

    if (this.mdcMenuFoundation) {
      this.mdcMenuFoundation.destroy();
    }

    const mdcMenuAdapter: MDCMenuAdapter = {
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
        if (this.mdcMenuSurfaceFoundation) {
          mwcMenu.close(this.mdcMenuSurfaceFoundation);
        }
      },
      getElementIndex: (element) => {
        const listElement = this.listElement;
        if (listElement) {
          return listElement.items.indexOf(element as ListItemBase);
        }

        return -1;
      },
      notifySelected: (evtData) => {
        if (!this.menuElement) {
          return;
        }

        const init: CustomEventInit = {};
        init.detail = {index: evtData.index, item: evtData};
        const ev = new CustomEvent('selected', init);
        this.menuElement.dispatchEvent(ev);
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

        const selectionGroupEl =
            closest(elementAtIndex, '.mdc-menu__selection-group');

        if (!selectionGroupEl) {
          return -1;
        }

        const selectedItemEl =
            selectionGroupEl.querySelector('[selected]') as ListItemBase | null;

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

        return !!closest(elementAtIndex, '.mdc-menu__selection-group');
      },
    };

    this.mdcMenuFoundation = new MDCMenuFoundation(mdcMenuAdapter);
    this.mdcMenuFoundation.init();
  }

  createMenuSurfaceFoundation() {
    if (!this.menuElement) {
      return;
    }

    if (this.mdcMenuSurfaceFoundation) {
      this.mdcMenuSurfaceFoundation.destroy();
    }

    const mdcMenuSurfaceAdapter: MDCMenuSurfaceAdapter = {
      ...addHasRemoveClass(this.menuElement),
      hasAnchor: () => {
        if (!this.menuElement) {
          return false;
        }

        return !!mwcMenu.anchorElement(this.menuElement);
      },
      notifyClose: () => {
        if (!this.menuElement) {
          return;
        }

        const init: CustomEventInit = {};
        const ev = new CustomEvent('closed', init);
        this.menuElement.dispatchEvent(ev);
      },
      notifyOpen: () => {
        if (!this.menuElement) {
          return;
        }

        const init: CustomEventInit = {};
        const ev = new CustomEvent('opened', init);
        this.menuElement.dispatchEvent(ev);
      },
      isElementInContainer: (element) => {
        if (!this.menuElement) {
          return false;
        }

        return mwcMenu.isElementInMenu(this.menuElement, element);
      },
      isRtl: () => {
        if (this.menuElement) {
          return getComputedStyle(this.menuElement).direction === 'rtl';
        }

        return false;
      },
      setTransformOrigin: (origin) => {
        if (this.menuElement) {
          mwcMenu.setTransformOrigin(this.menuElement, origin);
        }
      },
      isFocused: () => {
        const menuElement = this.menuElement;
        if (!menuElement) {
          return false;
        }

        const mdcRoot = mwcMenu.mdcRoot(menuElement);

        if (!mdcRoot) {
          return false;
        }

        const docRoot = mdcRoot.getRootNode() as Document | ShadowRoot;

        return docRoot.activeElement === mdcRoot;
      },
      saveFocus: () => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return;
        }

        const deepFocused = mwcMenu.getDeepFocus();
        mwcMenu.setPreviousFocus(menuElement, deepFocused);
      },
      restoreFocus: () => {
        const menuElement = this.menuElement;
        const slotElement = this.slotElement;

        if (!slotElement || !menuElement) {
          return;
        }

        const activeElement = slotActiveElement(slotElement);

        if (!activeElement) {
          return;
        }

        const menuHasFocus = doesSlotContainElement(slotElement, activeElement);

        if (!menuHasFocus) {
          return;
        }

        const previousFocus = mwcMenu.getPreviousFocus(menuElement);

        if (!previousFocus) {
          return;
        }

        if ('focus' in previousFocus) {
          previousFocus.focus();
        }
      },
      getInnerDimensions: () => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return {width: 0, height: 0};
        }

        const mdcRoot = mwcMenu.mdcRoot(menuElement) as HTMLElement;

        if (!mdcRoot) {
          return {width: 0, height: 0};
        }

        return {width: mdcRoot.offsetWidth, height: mdcRoot.offsetHeight};
      },
      getAnchorDimensions: () => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return null;
        }

        const anchorElement = mwcMenu.anchorElement(menuElement);

        return anchorElement ? anchorElement.getBoundingClientRect() : null;
      },
      getBodyDimensions: () => {
        return {
          width: document.body.clientWidth,
          height: document.body.clientHeight,
        };
      },
      getWindowDimensions: () => {
        return {
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      getWindowScroll: () => {
        return {
          x: window.pageXOffset,
          y: window.pageYOffset,
        };
      },
      setPosition: (position) => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return;
        }

        mwcMenu.position(menuElement, position);
      },
      setMaxHeight: (height) => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return;
        }

        mwcMenu.maxHeight(menuElement, height);
      },
    };

    this.mdcMenuSurfaceFoundation =
        new MDCMenuSurfaceFoundation(mdcMenuSurfaceAdapter);
    this.mdcMenuSurfaceFoundation.init();
  }

  protected menuSurfaceOnKeydown(evt: KeyboardEvent) {
    if (this.mdcMenuSurfaceFoundation) {
      this.mdcMenuSurfaceFoundation.handleKeydown(evt);
    }
  }

  protected onBodyClick(evt: MouseEvent) {
    if (this.mdcMenuSurfaceFoundation) {
      this.mdcMenuSurfaceFoundation.handleBodyClick(evt);
    }
  }

  protected menuSurfaceRegisterBodyClick() {
    this.onBodyClickBound = this.onBodyClick.bind(this);
    document.body.addEventListener('click', this.onBodyClickBound);
  }

  protected menuSurfaceDeregisterBodyClick() {
    document.body.removeEventListener('click', this.onBodyClickBound);
  }

  protected menuOnKeydown(evt: KeyboardEvent) {
    if (this.mdcMenuFoundation) {
      this.mdcMenuFoundation.handleKeydown(evt);
    }
  }

  protected menuOnAction(evt: CustomEvent<{index: number}>) {
    const listElement = this.listElement;
    if (this.mdcMenuFoundation && listElement) {
      const el = listElement.items[evt.detail.index];
      if (el) {
        this.mdcMenuFoundation.handleItemAction(el);
      }
    }
  }

  protected menuOnOpened() {
    if (this.mdcMenuFoundation) {
      this.mdcMenuFoundation.handleMenuSurfaceOpened();
    }
  }

  async _getUpdateComplete() {
    await super._getUpdateComplete();
    await Promise.all([
      this._outlineUpdateComplete,
      this._listUpdateComplete,
    ]);
  }

  async firstUpdated() {
    const listElement = this.listElement;
    const outlineElement = this.outlineElement;
    if (outlineElement) {
      this._outlineUpdateComplete = outlineElement.updateComplete;
      await this._outlineUpdateComplete;
    }

    if (listElement) {
      this._listUpdateComplete = listElement.updateComplete;
      await this._listUpdateComplete;
    }

    super.firstUpdated();

    this.mdcFoundation.setDisabled(this.disabled);

    // if (this.validateOnInitialRender) {
    //   this.reportValidity();
    // }

    const menuElement = this.menuElement;
    if (!menuElement) {
      return;
    }

    this.listeners = [
      {
        target: menuElement,
        name: 'keydown',
        cb: this.menuSurfaceOnKeydown.bind(this) as
            EventListenerOrEventListenerObject,
      },
      {
        target: menuElement,
        name: 'opened',
        cb: this.menuSurfaceRegisterBodyClick.bind(this),
      },
      {
        target: menuElement,
        name: 'closed',
        cb: this.menuSurfaceDeregisterBodyClick.bind(this),
      },
      {
        target: menuElement,
        name: 'opened',
        cb: this.menuOnOpened.bind(this),
      },
      {
        target: menuElement,
        name: 'keydown',
        cb: this.menuOnKeydown.bind(this) as EventListenerOrEventListenerObject,
      },
      {
        target: menuElement,
        name: 'opened',
        cb: this.onOpened.bind(this),
      },
      {
        target: menuElement,
        name: 'closed',
        cb: this.onClosed.bind(this),
      }
    ];

    for (const listener of this.listeners) {
      listener.target.addEventListener(
          listener.name, listener.cb as EventListenerOrEventListenerObject);
    }

    if (menuElement && listElement) {
      const selected = listElement.selected;

      if (selected) {
        const listIndex = listElement.index;
        const index = listIndex instanceof Array ? listIndex[0] : listIndex;
        if (index !== -1 && this.mdcFoundation) {
          this.mdcFoundation.setSelectedIndex(index);
        }
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    for (const listener of this.listeners) {
      listener.target.removeEventListener(listener.name, listener.cb);
    }
  }

  focus() {
    const focusEvt = new CustomEvent('focus');
    const selectedTextElement = this.selectedTextElement;

    if (selectedTextElement) {
      selectedTextElement.dispatchEvent(focusEvt);
      selectedTextElement.focus();
    }
  }

  blur() {
    const focusEvt = new CustomEvent('blur');
    const selectedTextElement = this.selectedTextElement;

    if (selectedTextElement) {
      selectedTextElement.dispatchEvent(focusEvt);
      selectedTextElement.blur();
    }
  }

  protected onFocus() {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleFocus();
    }
  }

  protected onBlur() {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleBlur();
    }
  }

  protected onClick(evt: MouseEvent|TouchEvent) {
    if (this.mdcFoundation) {
      this.focus();
      const targetClientRect = (evt.target as Element).getBoundingClientRect();
      let xCoord = 0;

      if (evt instanceof TouchEvent) {
        xCoord = evt.touches[0].clientX;
      } else {
        xCoord = evt.clientX;
      }

      const normalizedX = xCoord - targetClientRect.left;
      this.mdcFoundation.handleClick(normalizedX);
    }
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleKeydown(evt);
    }
  }

  protected onSelected(evt: CustomEvent<{index: number}>) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleMenuItemAction(evt.detail.index);
    }
  }

  protected onOpened() {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleMenuOpened();
    }
  }

  protected onClosed() {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleMenuClosed();
    }
  }

  protected async onLabelChange() {
    if (this.label) {
      await this.layout();
    }
  }

  async layout() {
    if (this.mdcFoundation) {
      this.mdcFoundation.layout();
    }

    await this.updateComplete;

    if (this.labelElement && this.outlineElement) {
      /* When the textfield automatically notches due to a value and label
       * being defined, the textfield may be set to `display: none` by the user.
       * this means that the notch is of size 0px. We provide this function so
       * that the user may manually resize the notch to the floated label's
       * width.
       */
      if (this.outlineOpen) {
        const labelWidth = this.labelElement.floatingLabelFoundation.getWidth();
        this.outlineWidth = labelWidth;
      }
    }
  }
}
