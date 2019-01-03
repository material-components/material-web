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
import { FormElement, customElement, query, html, classMap, property, observer } from '@material/mwc-base/form-element.js';
import MDCSelectFoundation from '@material/select/foundation.js';
import { MDCLineRipple } from '@material/line-ripple';
import { MDCFloatingLabel } from '@material/floating-label/index';
import { style } from './mwc-select-css.js';
import { style as menuStyle } from '@material/mwc-menu/mwc-menu-css.js';
let Select = class Select extends FormElement {
    constructor() {
        super(...arguments);
        this.value = '';
        this.selectedIndex = -1;
        this.label = '';
        this.box = false;
        this.outlined = false;
        this.disabled = false;
        this.fullWidth = false;
        this.required = false;
        this.helperText = '';
        this.mdcFoundationClass = MDCSelectFoundation;
    }
    get _lineRipple() {
        if (!this.outlined && this.lineRippleElement) {
            this._lineRippleInstance = this._lineRippleInstance || new MDCLineRipple(this.lineRippleElement);
        }
        return this._lineRippleInstance;
    }
    get _label() {
        if (this.label && this.labelElement) {
            this._labelInstance = this._labelInstance || new MDCFloatingLabel(this.labelElement);
        }
        return this._labelInstance;
    }
    renderStyle() {
        return html `${style}${menuStyle}`;
    }
    createAdapter() {
        return Object.assign({}, super.createAdapter(), { floatLabel: (value) => {
                if (this._label) {
                    this._label.float(value);
                }
            }, activateBottomLine: () => {
                if (this._lineRipple) {
                    this._lineRipple.activate();
                }
            }, deactivateBottomLine: () => {
                if (this._lineRipple) {
                    this._lineRipple.deactivate();
                }
            }, setDisabled: (disabled) => this.formElement.disabled = disabled, registerInteractionHandler: (type, handler) => this.formElement.addEventListener(type, handler), deregisterInteractionHandler: (type, handler) => this.formElement.removeEventListener(type, handler), getSelectedIndex: () => this.formElement.selectedIndex, setSelectedIndex: (index) => this.formElement.selectedIndex = index, getValue: () => this.formElement.value, setValue: (value) => this.formElement.value = value });
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
        };
        return html `
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
        ${label ? html `<label class="mdc-floating-label ${classMap(labelClassInfo)}" for="select">${label}</label>` : ''}
        ${outlined
            ? html `
            <div class="mdc-notched-outline">
              <svg><path class="mdc-notched-outline__path"/></svg>
            </div>
            <div class="mdc-notched-outline__idle"></div>`
            : html `<div class="mdc-line-ripple"></div>`}
      </div>
      ${helperText ? html `<p class="mdc-text-field-helper-text" aria-hidden="true">${helperText}</p>` : ''}
    `;
    }
    _renderInput({ value, required, type, placeHolder, label }) {
        return html `<input type="${type}" placeholder="${placeHolder}" ?required="${required}" class="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" id="text-field" .value="${value}" aria-label="${label}">`;
    }
};
__decorate([
    query('.mdc-select')
], Select.prototype, "mdcRoot", void 0);
__decorate([
    query('select')
], Select.prototype, "formElement", void 0);
__decorate([
    query('.mdc-line-ripple')
], Select.prototype, "lineRippleElement", void 0);
__decorate([
    query('.mdc-floating-label')
], Select.prototype, "labelElement", void 0);
__decorate([
    property({ type: String }),
    observer(function (value) {
        this.mdcFoundation.setValue(value);
    })
], Select.prototype, "value", void 0);
__decorate([
    property({ type: Number }),
    observer(function (value) {
        this.mdcFoundation.setSelectedIndex(value);
    })
], Select.prototype, "selectedIndex", void 0);
__decorate([
    property({ type: String })
], Select.prototype, "label", void 0);
__decorate([
    property({ type: Boolean })
], Select.prototype, "box", void 0);
__decorate([
    property({ type: Boolean })
], Select.prototype, "outlined", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (value) {
        this.mdcFoundation.setDisabled(value);
    })
], Select.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], Select.prototype, "fullWidth", void 0);
__decorate([
    property({ type: Boolean })
], Select.prototype, "required", void 0);
__decorate([
    property({ type: String })
], Select.prototype, "helperText", void 0);
Select = __decorate([
    customElement('mwc-select')
], Select);
export { Select };
//# sourceMappingURL=mwc-select.js.map