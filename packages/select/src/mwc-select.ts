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
import {
  FormElement,
  Foundation,
  Adapter,
  customElement,
  query,
  html,
  classMap,
  property,
  observer
} from '@material/mwc-base/form-element';
import { findAssignedElement, emit } from '@material/mwc-base/utils';
import { Menu as MWCMenu } from '@material/mwc-menu/mwc-menu';
import { ListItem } from '@material/mwc-list/mwc-list-item';
import MDCSelectFoundation from '@material/select/foundation';
import { MDCLineRipple } from '@material/line-ripple';
import { MDCFloatingLabel } from '@material/floating-label';
import { MDCNotchedOutline } from '@material/notched-outline';
import { ripple } from '@material/mwc-ripple/ripple-directive';

import { style } from './mwc-select-css';

// elements to be registered ahead of time
import '@material/mwc-menu';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item-separator';

export interface SelectFoundation extends Foundation {
  setValue(value: String): void;
  setDisabled(value: Boolean): void;
  setSelectedIndex(value: Number): void;
  deactivateBottomLine(): void;
}

export interface SelectProxy {
  value?: string;
  text?: string;
  selectedIndex: number;
  selectedOptions?: any;
  selectedItems?: any;
  options?: any;
  items?: any;
}

export declare var SelectFoundation: {
  prototype: SelectFoundation;
  new(adapter: Adapter): SelectFoundation;
}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-select': Select;
  }
}

export class HTMLSelectElementProxy {
  get value(): string {
    return this.select instanceof HTMLSelectElement
      ? this.select.value
      : this.items[this.selectedIndex]
        ? this.items[this.selectedIndex].value
        : '';
  }

  set value(value: string) {
    if (this.select instanceof HTMLSelectElement) {
      if (this.select.value !== value) {
        this.select.value = value;
        emit(this.select, 'change');
      }
    } else {
      const selectedElement = this.items.filter(el => el.value === value)[0];
      this.selectedIndex = selectedElement
        ? this.items.indexOf(selectedElement)
        : -1;
    }
  }

  get selectedIndex(): number {
    return this.select.selectedIndex;
  }

  set selectedIndex(value: number) {
    if (this.select.selectedIndex !== value) {
      this.select.selectedIndex = value;
      
      if (this.select instanceof HTMLSelectElement) {
        emit(this.select, 'change');
      }
    }
  }

  get selectedOptions() {
    return this.select.selectedOptions || this.select.selectedItems;
  }
  
  get items() {
    return this.select.options || this.select.items;
  }

  get text() {
    const selectedOption = this.selectedOptions[0];
    return selectedOption
      ? selectedOption.label || selectedOption.text
      : '';
  }

  constructor(protected select: SelectProxy) {}
}

@customElement('mwc-select' as any)
export class Select extends FormElement {

  @query('.mdc-select')
  protected mdcRoot!: HTMLElement;

  @query('input')
  protected input!: HTMLInputElement;

  @query('slot[name="select"]')
  protected slotSelect!: HTMLSlotElement;

  @query('slot[name="menu"]')
  protected slotMenu!: HTMLSlotElement;

  @query('.mdc-line-ripple')
  protected lineRippleElement!: HTMLElement;

  @query('.mdc-floating-label')
  protected labelElement!: HTMLElement;

  @query('.mdc-notched-outline')
  protected outlineElement!: HTMLElement;

  @property({ type: Number })
  @observer(function(this: Select, value: Number) {
    this.mdcFoundation.setSelectedIndex(value);
  })
  selectedIndex = -1;

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  box = false;

  @property({ type: Boolean })
  outlined = false;

  @property({ type: Boolean })
  dense = false;

  @property({ type: Boolean })
  @observer(function(this: Select, value: Boolean) {
    this.mdcFoundation.setDisabled(value);
  })
  disabled = false;

  @property({ type: Boolean })
  fullWidth = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: String })
  @observer(function(this: Select, value: String) {
    this.mdcFoundation.setValue(value);
  })
  value = '';

  protected get slottedElement() {
    return findAssignedElement(this.slotSelect, '*') || findAssignedElement(this.slotMenu, '*');
  }

  protected get select(): HTMLSelectElement {
    return (this.formElement instanceof HTMLSelectElement ? this.slottedElement : undefined) as HTMLSelectElement;
  }

  protected get menu(): MWCMenu {
    return (this.formElement instanceof HTMLInputElement ? this.slottedElement : undefined) as MWCMenu;
  }

  protected get isMenuOpen() {
    return this.menu && this.menu.open;
  }

  protected get items() {
    return this.selectProxy.items;
  }

  protected _selectProxyInstance!: HTMLSelectElementProxy;
  protected get selectProxy(): HTMLSelectElementProxy {
    if ( !this._selectProxyInstance ) {
      this._selectProxyInstance = new HTMLSelectElementProxy(
        (this.select || this.menu) as SelectProxy
      );
    }

    return this._selectProxyInstance!;
  }

  protected _formElementInstance!: HTMLElement;
  protected get formElement(): HTMLElement {
    if ( !this._formElementInstance ) {
      this._formElementInstance = this.slottedElement instanceof HTMLSelectElement
        ? this.slottedElement
        : this.input;
    }

    return this._formElementInstance;
  }

  private _lineRippleInstance!: MDCLineRipple;
  private get _lineRipple(): MDCLineRipple {
    if ( !this.outlined && this.lineRippleElement ) {
      this._lineRippleInstance = this._lineRippleInstance || new MDCLineRipple(this.lineRippleElement);
    }
    
    return this._lineRippleInstance;
  }

  private _labelInstance!: MDCFloatingLabel;
  private get _label(): MDCFloatingLabel {
    if ( this.label && this.labelElement ) {
      this._labelInstance = this._labelInstance || new MDCFloatingLabel(this.labelElement);
    }
    
    return this._labelInstance;
  }

  private _outlineInstance!: MDCNotchedOutline;
  private get _outline(): MDCNotchedOutline {
    if ( this.outlined && this.outlineElement ) {
      this._outlineInstance = this._outlineInstance || new MDCNotchedOutline(this.outlineElement);
    }
    
    return this._outlineInstance;
  }

  protected readonly mdcFoundationClass: typeof SelectFoundation = MDCSelectFoundation;

  protected mdcFoundation!: SelectFoundation;

  protected _isMouseDown!: Boolean;
  protected _isFocused!: Boolean;

  renderStyle() {
    return html`${style}`;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      floatLabel: (value) => {
        if (this.menu && this.menu.open) {
          return;
        }

        if (this._label) {
          this._label.float(value);
        }
      },
      activateBottomLine: () => {
        if (this._lineRipple) {
          this._lineRipple.activate();
        }

        if (this._outline) {
          this._openNotch();
        }
      },
      deactivateBottomLine: () => {
        if ( this._isMouseDown ) return;

        if (this._lineRipple) {
          this._lineRipple.deactivate();
        }

        if (this._outlineInstance && !this.selectProxy.value) {
          this._outline.closeNotch();
        }
      },
      setDisabled: (disabled) => {
        this.disabled = disabled;
      },
      registerInteractionHandler: (type, handler) => {
        this.formElement.addEventListener(type, handler);
      },
      deregisterInteractionHandler: (type, handler) => {
        this.formElement.removeEventListener(type, handler);
      },
      getSelectedIndex: () => {
        return this.selectProxy.selectedIndex;
      },
      setSelectedIndex: (index) => {
        this.selectProxy.selectedIndex = index;
      },
      getValue: () => {
        return this.selectProxy.value;
      },
      setValue: (value) => {
        this.selectProxy.value = value;
        this.input.value = this.selectProxy.text;
      },
    }
  }

  async firstUpdated() {
    super.firstUpdated();

    if (this.select) {
      this.select.classList.add('mdc-select__native-control');
      this.formElement.addEventListener('change', () => this._handleSelection());
      this.input.style.display = 'none';
    }

    if (this.menu) {
      this.menu.selectionGroup = true;
      this.input.style.minWidth = `${this.menu.getWidth() + 32}px`;
      this.formElement.addEventListener('keydown', evt => this._handleKeydown(evt));
      this.formElement.addEventListener('mousedown', () => this._handleMouseDown());
      this.menu.addEventListener('MDCMenu:closed', () => this._handleMenuClosed());
      this.menu.addEventListener('MDCMenu:selected', evt => this._handleMenuSelected(evt as CustomEvent))
    }

    this.formElement.addEventListener('focus', () => this._handleFocus());
    this.formElement.addEventListener('blur', () => this._handleBlur());
  }

  render() {
    const { label, disabled, box, outlined, fullWidth, value, dense } = this;
    
    const hostClassInfo = {
      'mdc-select--box': box,
      'mdc-select--dense': dense,
      'mdc-select--outlined': outlined,
      'mdc-select--disabled': disabled,
      'mdc-select--fullwidth': fullWidth
    };

    const labelClassInfo = {
      'mdc-floating-label--float-above': !!value
    };

    return html`
      ${this.renderStyle()}
      <div class="mdc-select ${classMap(hostClassInfo)}" .ripple="${!outlined ? ripple({ unbounded: false }) : undefined}">
        <input type="input" size="1" readonly class="mdc-select__selected-text" tabindex="0">
        <slot name="select"></slot>
        ${label ? html`<label class="mdc-floating-label ${classMap(labelClassInfo)}" for="select">${label}</label>` : ''}
        ${outlined
          ? html`
            <div class="mdc-notched-outline">
              <svg><path class="mdc-notched-outline__path"/></svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>`
          : html`<div class="mdc-line-ripple"></div>`
        }
      </div>
      <slot name="menu"></slot>
    `;
  }

  _openNotch() {
    const isRtl = window.getComputedStyle(this.mdcRoot).getPropertyValue('direction') === 'rtl';
    const labelWidth = !!this._label ? this._label.getWidth() : -12; // due to notched outline label spacing
    this._outline.notch(labelWidth * (this.dense ? .923 : .75), isRtl);
  }

  /**
   * Updates value and selectedIndex
   */
  _handleSelection() {
    this.selectedIndex = this.selectProxy.selectedIndex;
    this.value = this.selectProxy.value;
    
    if (this._outline && !this._isMouseDown) {
      if (this.selectedIndex !== -1) {
        this._openNotch();
      } else {
        this._outline.closeNotch();
      }
    }
  }

  /**
   * Updates value and selectedIndex
   */
  _handleMenuSelected(evt: CustomEvent) {
    var detail = evt.detail;
    this.selectedIndex = detail.index;
    this.value = this.selectedIndex !== -1 ? this.items[this.selectedIndex].value : '';

    if (this._outline && !this._isMouseDown) {
      if (this.selectedIndex !== -1) {
        this._openNotch();
      } else {
        this._outline.closeNotch();
      }
    }
  }

  /**
   * Recover focus
   */
  _handleMenuClosed() {
    if (this._isMouseDown) {
      this._isMouseDown = false;
    } else {
      // Prevent focus if another select was focused
      if (
        document.activeElement instanceof HTMLSelectElement === false &&
        (document.activeElement instanceof ListItem === false || this.contains(document.activeElement))
      ) {
        this.input.focus();
      } else {
        this._isMouseDown = false;
        emit(this.input, 'blur');
      }
    }
  }

  /**
   * Opens menu if already focused
   */
  _handleMouseDown() {
    this._isMouseDown = true;

    if (this.isMenuOpen) {
      return;
    };

    if (this._isFocused) {
      this.openMenu();
    }
  }

  /**
   * Handle keys that open the menu
   */
  _handleKeydown(evt) {
    const { key, keyCode } = evt;

    const isSpace = key === 'Space' || keyCode === 32;
    const isEnter = key === 'Enter' || keyCode === 13
    
    if (isSpace || isEnter) {
      this._isMouseDown = true;
      this.openMenu();
    }
  }

  /**
   * Adds focused class, opens menu and redirects focus even to mdcRoot
   */
  _handleFocus() {
    this.mdcRoot.classList.add('mdc-select--focused');
    this._isFocused = true;

    if ( this._isMouseDown ) {
      this.openMenu();
    }

    emit(this.mdcRoot, 'focus');
  }

  /**
   * Removes focused class and redirects blur event to mdcRoot
   */
  _handleBlur() {
    if ( this._isMouseDown ) {
      this._isMouseDown = false;
      return;
    }

    this.mdcRoot.classList.remove('mdc-select--focused');
    this._isFocused = false;

    emit(this.mdcRoot, 'blur');
  }

  openMenu() {
    if (this.menu && !this.menu.open) {
      this.menu.open = true;
    }
  }

  closeMenu() {
    if (this.menu && this.menu.open) {
      this.menu.open = false;
    }
  }
}
