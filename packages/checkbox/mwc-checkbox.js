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
import { html, FormElement, customElement, property, query, observer } from '@material/mwc-base/form-element';
import { style } from './mwc-checkbox-css';
import MDCCheckboxFoundation from '@material/checkbox/foundation';
let Checkbox = class Checkbox extends FormElement {
    constructor() {
        super(...arguments);
        this.checked = false;
        this.indeterminate = false;
        this.disabled = false;
        this.value = '';
        this.mdcFoundationClass = MDCCheckboxFoundation;
        this._changeHandler = () => {
            this.mdcFoundation.handleChange();
            this.checked = this.formElement.checked;
            this.indeterminate = this.formElement.indeterminate;
        };
        this._animationEndHandler = () => {
            this.mdcFoundation.handleAnimationEnd();
        };
    }
    renderStyle() {
        return style;
    }
    createAdapter() {
        return Object.assign({}, super.createAdapter(), { getNativeControl: () => {
                return this.formElement;
            }, forceLayout: () => {
                this.mdcRoot.offsetWidth;
            }, isAttachedToDOM: () => this.isConnected, isIndeterminate: () => this.indeterminate, isChecked: () => this.checked, hasNativeControl: () => Boolean(this.formElement), setNativeControlDisabled: (disabled) => {
                this.formElement.disabled = disabled;
            } });
    }
    render() {
        return html `
      ${this.renderStyle()}
      <div class="mdc-checkbox" @animationend="${this._animationEndHandler}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              id="checkbox-1" @change="${this._changeHandler}" .indeterminate="${this.indeterminate}">
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
      </div>`;
    }
};
__decorate([
    query('.mdc-checkbox')
], Checkbox.prototype, "mdcRoot", void 0);
__decorate([
    query('input')
], Checkbox.prototype, "formElement", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (value) {
        this.mdcFoundation.setChecked(value);
    })
], Checkbox.prototype, "checked", void 0);
__decorate([
    property({ type: Boolean })
], Checkbox.prototype, "indeterminate", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (value) {
        this.mdcFoundation.setDisabled(value);
    })
], Checkbox.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], Checkbox.prototype, "value", void 0);
Checkbox = __decorate([
    customElement('mwc-checkbox')
], Checkbox);
export { Checkbox };
//# sourceMappingURL=mwc-checkbox.js.map