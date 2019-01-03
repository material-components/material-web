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
} from '@material/mwc-base/form-element.js';
import MDCSelectFoundation from '@material/select/foundation.js';
import { MDCLineRipple } from '@material/line-ripple';
import { MDCFloatingLabel } from '@material/floating-label/index';

import { style } from './mwc-select-css.js';
import { style as menuStyle } from '@material/mwc-menu/mwc-menu-css.js';

export interface SelectFoundation extends Foundation {
  setValue(value: string): void;
  setDisabled(value: string): void;
  setSelectedIndex(value: number): void;
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

@customElement('mwc-select' as any)
export class Select extends FormElement {

  @query('.mdc-select')
  protected mdcRoot!: HTMLElement;

  @query('select')
  protected formElement!: HTMLSelectElement;

  @query('.mdc-line-ripple')
  protected lineRippleElement!: HTMLElement;

  @query('.mdc-floating-label')
  protected labelElement!: HTMLElement;

  @property({ type: String })
  @observer(function(this: Select, value: string) {
    this.mdcFoundation.setValue(value);
  })
  value = '';

  @property({ type: Number })
  @observer(function(this: Select, value: number) {
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
  @observer(function(this: Select, value: string) {
    this.mdcFoundation.setDisabled(value);
  })
  disabled = false;

  @property({ type: Boolean })
  fullWidth = false;

  @property({ type: Boolean })
  required = false;

  @property({ type: String })
  helperText = '';

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

  protected readonly mdcFoundationClass: typeof SelectFoundation = MDCSelectFoundation;

  protected mdcFoundation!: SelectFoundation;

  renderStyle() {
    return html`${style}${menuStyle}`;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      floatLabel: (value) => {
        if (this._label) {
          this._label.float(value);
        }
      },
      activateBottomLine: () => {
        if (this._lineRipple) {
          this._lineRipple.activate();
        }
      },
      deactivateBottomLine: () => {
        if (this._lineRipple) {
          this._lineRipple.deactivate();
        }
      },
      setDisabled: (disabled) => this.formElement.disabled = disabled,
      registerInteractionHandler: (type, handler) => this.formElement.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.formElement.removeEventListener(type, handler),
      getSelectedIndex: () => this.formElement.selectedIndex,
      setSelectedIndex: (index) => this.formElement.selectedIndex = index,
      getValue: () => this.formElement.value,
      setValue: (value) => this.formElement.value = value,
    }
  }

  render() {
    const { label, disabled, box, outlined, fullWidth, helperText, value, required } = this;
    
    const hostClassInfo = {
      // 'mdc-select--with-leading-icon': icon && !iconTrailing,
      // 'mdc-select--with-trailing-icon': icon && iconTrailing,
      'mdc-select--box': box,
      'mdc-select--outlined': outlined,
      'mdc-select--disabled': disabled,
      'mdc-select--fullwidth': fullWidth
    };

    const labelClassInfo = {
      'mdc-floating-label--float-above': !!value
    }

    return html`
      ${this.renderStyle()}
      <div class="mdc-select ${classMap(hostClassInfo)}">
        <select ?required="${required}" id="select" .value="${value}" class="mdc-select__native-control ${value ? 'mdc-select--upgraded' : ''}">
          <option value="" disabled selected></option>
          <option value="grains">
            Bread and Cereal
          </option>
          <option value="vegetables">
            Vegetables
          </option>
          <option value="fruit">
            Fruit
          </option>
        </select>
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
      ${helperText ? html`<p class="mdc-text-field-helper-text" aria-hidden="true">${helperText}</p>` : ''}
    `;
  }

  _renderInput({ value, required, type, placeHolder, label }) {
    return html`<input type="${type}" placeholder="${placeHolder}" ?required="${required}" class="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" id="text-field" .value="${value}" aria-label="${label}">`;
  }
}
