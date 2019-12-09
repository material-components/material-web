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

import {closest} from '@material/dom/ponyfill';
import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation.js';
import {MDCLineRippleFoundation} from '@material/line-ripple/foundation.js';
import {addHasRemoveClass, FormElement} from '@material/mwc-base/form-element.js';
import MDCSelectFoundation from '@material/select/foundation.js';
import MDCMenuFoundation from '@material/menu/foundation.js';
import MDCMenuSurfaceFoundation from '@material/menu-surface/foundation.js';
import MDCListFoundation from '@material/list/foundation.js';
import {html, query, property, TemplateResult, PropertyValues} from 'lit-element';
import { MDCSelectAdapter } from '@material/select/adapter';
import {lineRipple, LineRipple} from '@material/mwc-line-ripple';
import {floatingLabel, FloatingLabel} from '@material/mwc-floating-label';
import {NotchedOutline} from '@material/mwc-notched-outline';
import { MDCMenuAdapter } from '@material/menu/adapter';
import { MDCMenuSurfaceAdapter } from '@material/menu-surface/adapter';
import {classMap} from 'lit-html/directives/class-map';

import * as mwcMenu from './mwc-menu-ponyfill';
import * as mwcList from './mwc-list-ponyfill';
import * as mwcListItem from './mwc-list-item-ponyfill';
import { MDCListAdapter } from '@material/list/adapter';
import { menuAnchor } from './mwc-menu-surface-directive';

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

  protected mdcListFoundation: MDCListFoundation|undefined;

  protected mdcMenuSurfaceFoundation: MDCMenuSurfaceFoundation|undefined;

  protected readonly mdcFoundationClass = MDCSelectFoundation;

  @query('.mdc-select') protected mdcRoot!: HTMLElement;

  @query('.formElement') protected formElement!: HTMLDivElement;

  @query('#mainSlot') protected slotElement!: HTMLSlotElement|null;

  @query('select') protected nativeSelectElement!: HTMLSelectElement|null;

  @query('input') protected nativeInputElement!: HTMLInputElement|null;

  @query('.mdc-line-ripple') protected lineRippleElement!: LineRipple|null;

  @query('.mdc-floating-label') protected labelElement!: FloatingLabel|null;

  @query('mwc-notched-outline') protected outlineElement!: NotchedOutline|null;

  @query('.mdc-menu') protected menuElement!: HTMLDivElement|null;

  @query('.mdc-list') protected listElement!: HTMLDivElement|null;

  @query('.mdc-select__selected-text') protected selectedTextElement!: HTMLDivElement | null;

  @query('.mdc-select__anchor') protected anchorElement!: HTMLDivElement | null;

  @property({type: Boolean, attribute: 'disabled', reflect: true}) disabled = false;

  @property({type: Boolean}) outlined = false;

  @property({type: String}) label = '';

  @property({type: Boolean}) outlineOpen = false;

  @property({type: Number}) outlineWidth = 0;

  @property({type: String}) value = '';

  @property({type: String}) protected selectedText = '';

  @property({type: String}) icon = '';

  protected listeners = [];

  render () {
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
            @opened=${this.onOpened}
            @closed=${this.onClosed}>
          <ul class="mdc-list">
            <slot></slot>
          </ul>
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
    this.createListFoundation();
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

        return mwcList.selected(listElement);
      },
      hasLabel: () => {
        return !!this.label;
      },
      floatLabel: () => {
        if (this.labelElement) {
          this.labelElement.floatingLabelFoundation.float(true);
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
        const ev = new Event('change', {bubbles:true});
        this.dispatchEvent(ev);
      },
      setSelectedText: (value) => this.selectedText = value,
      isSelectedTextFocused: () => {
        const selectedTextElement = this.selectedTextElement;

        if (!selectedTextElement) {
          return false;
        }

        const rootNode = selectedTextElement.getRootNode() as ShadowRoot | Document;

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
      setMenuAnchorElement: () => {},
      setMenuAnchorCorner: (anchorCorner) => {
        if (this.mdcMenuSurfaceFoundation) {
          mwcMenu.setAnchorCorner(this.mdcMenuSurfaceFoundation, anchorCorner);
        }
      },
      setMenuWrapFocus: (wrapFocus) => {
        if (this.mdcListFoundation) {
          mwcList.wrapFocus(this.mdcListFoundation, wrapFocus);
        }
      },
      setAttributeAtIndex: (index: number, attr: string, value: string) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(listElement, index);

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

        const element = mwcList.getElementAtIndex(listElement, index);

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

        const element = mwcList.getElementAtIndex(listElement, index);

        if (!element) {
          return;
        }

        (element as HTMLElement).focus();
      },
      getMenuItemCount: () => {
        const listElement = this.listElement;

        if (listElement) {
          const elements = mwcList.listElements(listElement);
          return elements.length;
        }

        return 0;
      },
      getMenuItemValues: () => {
        const listElement = this.listElement;

        if (!listElement) {
          return [];
        }

        const items = mwcList.listElements(listElement);

        return items.map(item => mwcListItem.value(item));
      },
      getMenuItemTextAtIndex: (index) => {
        const listElement = this.listElement;
        if (!listElement) {
          return '';
        }

        const element = mwcList.getElementAtIndex(listElement, index);

        if (!element) {
          return '';
        }

        return element.textContent as string;
      },
      getMenuItemAttr: (menuItem, attr) => {
        return menuItem.getAttribute(attr);
      },
      addClassAtIndex: (index, className) => {
        const listElement = this.listElement;
        if (!listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(listElement, index);

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

        const element = mwcList.getElementAtIndex(listElement, index);

        if (!element) {
          return;
        }

        element.classList.remove(className);
      },
    };
  }

  createListFoundation() {
    if (!this.listElement) {
      return;
    }

    if (this.mdcListFoundation) {
      this.mdcListFoundation.destroy();
    };

    const mdcListAdapter: MDCListAdapter = {
      getListItemCount: () => {
        if (this.listElement) {
          const elements = mwcList.listElements(this.listElement);
          return elements.length;
        }

        return 0;
      },
      getFocusedElementIndex: () => {
        if (!this.listElement) {
          return -1;
        }

        const elements = mwcList.listElements(this.listElement);

        if (!elements.length) {
          return -1;
        }

        const activeElement = mwcList.getSlottedActiveElement(this.listElement);

        if (!activeElement) {
          return -1;
        }

        return elements.indexOf(activeElement);
      },
      getAttributeForElementIndex: (index, attr) => {
        const listElement = this.listElement;
        if (!listElement) {
          return '';
        }

        const element = mwcList.getElementAtIndex(listElement, index);
        return element ? element.getAttribute(attr) : '';
      },
      setAttributeForElementIndex: (index, attr, val) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);

        if (element) {
          element.setAttribute(attr, val);
        }
      },
      addClassForElementIndex: (index, className) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        if (element) {
          element.classList.add(className);
        }
      },
      removeClassForElementIndex: (index, className) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        if (element) {
          element.classList.remove(className);
        }
      },
      focusItemAtIndex: (index) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        if (element && element instanceof HTMLElement) {
          element.focus();
        }
      },
      setTabIndexForListItemChildren: (index, tabIndex) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        if (element) {
          mwcListItem.controlTabIndex(element, tabIndex);
        }
      },
      hasCheckboxAtIndex: (index) => {
        if (!this.listElement) {
          return false;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        return element ? mwcListItem.hasCheckbox(element) : false;
      },
      hasRadioAtIndex: (index) => {
        if (!this.listElement) {
          return false;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        return element ? mwcListItem.hasRadio(element) : false;
      },
      isCheckboxCheckedAtIndex: (index) => {
        if (!this.listElement) {
          return false;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        return element ? mwcListItem.hasRadio(element) : false;
      },
      setCheckedCheckboxOrRadioAtIndex: (index, isChecked) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);
        if (element) {
          mwcListItem.setChecked(element, isChecked);
        }
      },
      notifyAction: (index) => {
        if (!this.listElement) {
          return;
        }

        const init: CustomEventInit = {};
        init.detail = {index};
        const ev = new CustomEvent('action', init);
        this.listElement.dispatchEvent(ev);
      },
      isFocusInsideList: () => {
        if (!this.listElement) {
          return false;
        }

        return mwcList.doContentsHaveFocus(this.listElement);
      },
      isRootFocused: () => {
        if (!this.listElement) {
          return false;
        }

        const mdcRoot = mwcList.mdcRoot(this.listElement);
        const root = mdcRoot.getRootNode() as unknown as DocumentOrShadowRoot;
        return root.activeElement === mdcRoot;
      },
      listItemAtIndexHasClass: (index, className) => {
        if (!this.listElement) {
          return false;
        }

        const item = mwcList.getElementAtIndex(this.listElement, index);

        if (!item) {
          return false;
        }

        return mwcListItem.hasClass(item, className);
      },
    };

    this.mdcListFoundation = new MDCListFoundation(mdcListAdapter);
    this.mdcListFoundation.init();
  }

  createMenuFoundation() {
    if (!this.menuElement) {
      return;
    }

    if (this.mdcMenuFoundation) {
      this.mdcMenuFoundation.destroy();
    };

    const mdcMenuAdapter: MDCMenuAdapter = {
      addClassToElementAtIndex: (index, className) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);

        if (!element) {
          return;
        }

        element.classList.add(className);
      },
      removeClassFromElementAtIndex: (index, className) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);

        if (!element) {
          return;
        }

        element.classList.remove(className);
      },
      addAttributeToElementAtIndex: (index, attr, value) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);

        if (!element) {
          return;
        }

        element.setAttribute(attr, value);
      },
      removeAttributeFromElementAtIndex: (index, attr) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);

        if (!element) {
          return;
        }

        element.removeAttribute(attr);
      },
      elementContainsClass: (element, className) => element.classList.contains(className),
      closeSurface: () => {
        if (this.mdcMenuSurfaceFoundation) {
          mwcMenu.close(this.mdcMenuSurfaceFoundation);
        }
      },
      getElementIndex: (element) => {
        if (this.listElement) {
          return mwcList.listElements(this.listElement).indexOf(element);
        }

        return -1;
      },
      notifySelected: (evtData) => {
        if (!this.menuElement) {
          return;
        }

        const init: CustomEventInit = {};
        init.detail = {
          index: evtData.index,
          item: evtData
        };
        const ev = new CustomEvent('selected', init);
        this.menuElement.dispatchEvent(ev);
      },
      getMenuItemCount: () => {
        if (!this.listElement) {
          return 0;
        }

        return mwcList.listElements(this.listElement).length;
      },
      focusItemAtIndex: (index) => {
        if (!this.listElement) {
          return;
        }

        const element = mwcList.getElementAtIndex(this.listElement, index);

        if (element && element instanceof HTMLElement) {
          element.focus();
        }
      },
      focusListRoot: () => {
        if (this.listElement) {
          this.listElement.focus();
        }
      },
      getSelectedSiblingOfItemAtIndex: (index) => {
        if (!this.listElement) {
          return -1;
        }

        const elementAtIndex = mwcList.getElementAtIndex(this.listElement, index);

        if (!elementAtIndex) {
          return -1;
        }

        const selectionGroupEl = closest(elementAtIndex, `.mdc-menu__selection-group`);

        if (!selectionGroupEl) {
          return -1;
        }

        const selectedItemEl = selectionGroupEl.querySelector(`.mdc-menu-item--selected`);

        if (!selectedItemEl) {
          return -1;
        }

        const elements = mwcList.listElements(this.listElement);

        return elements.indexOf(selectedItemEl);

      },
      isSelectableItemAtIndex: (index) => {
        if (!this.listElement) {
          return false;
         }

        const elementAtIndex = mwcList.getElementAtIndex(this.listElement, index);

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
    };

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
          mwcMenu.setTransformOrigin(this.menuElement, origin)
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

        if (!menuElement) {
          return;
        }

        const activeElement = mwcMenu.shadowRoot(menuElement).activeElement;

        if (!activeElement) {
          return;
        }

        const mdcRoot = mwcMenu.mdcRoot(menuElement);
        const previousFocus = mwcMenu.getPreviousFocus(menuElement);

        if (!previousFocus || !mdcRoot) {
          return;
        }

        if (mdcRoot.contains(previousFocus)) {
          if ('focus' in previousFocus) {
            previousFocus.focus();
          }
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
        debugger;

        return anchorElement ? anchorElement.getBoundingClientRect() : null;
      },
      getBodyDimensions: () => {
        return {
          width: document.body.clientWidth,
          height: document.body.clientHeight,
        }
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

        const mdcRoot = mwcMenu.mdcRoot(menuElement) as HTMLElement;

        if (!mdcRoot) {
          return;
        }

        mdcRoot.style.left = 'left' in position ? `${position.left}px` : '';
        mdcRoot.style.right = 'right' in position ? `${position.right}px` : '';
        mdcRoot.style.top = 'top' in position ? `${position.top}px` : '';
        mdcRoot.style.bottom = 'bottom' in position ? `${position.bottom}px` : '';
      },
      setMaxHeight: (height) => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return;
        }

        const mdcRoot = mwcMenu.mdcRoot(menuElement) as HTMLElement;

        if (!mdcRoot) {
          return;
        }

        mdcRoot.style.maxHeight = height;
      },
    };

    this.mdcMenuSurfaceFoundation = new MDCMenuSurfaceFoundation(mdcMenuSurfaceAdapter);
    this.mdcMenuSurfaceFoundation.init();
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('value') &&
        changedProperties.get('value') !== undefined) {
      this.mdcFoundation.setValue(this.value);
    }
  }

  async firstUpdated() {
    const outlineElement = this.outlineElement;
    if (outlineElement) {
      await outlineElement.updateComplete;
    }

    super.firstUpdated();

    // if (this.validateOnInitialRender) {
    //   this.reportValidity();
    // }

    // if (this.selectedText_.hasAttribute(strings.ARIA_CONTROLS)) {
    //   const helperTextElement = document.getElementById(this.selectedText_.getAttribute(strings.ARIA_CONTROLS)!);
    //   if (helperTextElement) {
    //     this.helperText_ = helperTextFactory(helperTextElement);
    //   }
    // }

    // this.menu_ = new MdcMenu(this.menuElement_);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

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

  protected onClick(evt: MouseEvent | TouchEvent) {
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
      this.mdcFoundation.handleClick(normalizedX)
    }
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleKeydown(evt);
    }
  }

  protected onSelected(evt: CustomEvent<{index:number}>) {
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
