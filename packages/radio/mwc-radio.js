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
import { FormElement, query, customElement, property, html, observer } from '@material/mwc-base/form-element';
import { style } from './mwc-radio-css';
import { SelectionController } from './selection-controller';
// import {ripple} from '@material/mwc-ripple/ripple-directive';
import MDCRadioFoundation from '@material/radio/foundation';
let Radio = class Radio extends FormElement {
    constructor() {
        super(...arguments);
        this.checked = false;
        this.disabled = false;
        this.value = '';
        this.name = '';
        this.mdcFoundationClass = MDCRadioFoundation;
        this._selectionController = SelectionController.getController(this);
        this._changeHandler = () => {
            this.checked = this.formElement.checked;
            this._selectionController.update(this);
        };
        this._focusHandler = () => {
            this._selectionController.focus(this);
        };
        this._blurHandler = () => {
            // this._selectionController.blur();
        };
        this._clickHandler = () => {
            // Firefox has weird behavior with radios if they are not focused
            this.formElement.focus();
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this._selectionController.register(this);
    }
    disconnectedCallback() {
        this._selectionController.unregister(this);
    }
    renderStyle() {
        return style;
    }
    createAdapter() {
        return Object.assign({}, super.createAdapter(), { getNativeControl: () => {
                return this.formElement;
            } });
    }
    render() {
        const { checked, name, value, _changeHandler: change, _focusHandler: focus, _blurHandler: blur, _clickHandler: click } = this;
        return html `
      ${this.renderStyle()}
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio" name="${name}" .checked="${checked}" .value="${value}"
        @change="${change}"
        @focus="${focus}"
        @blur="${blur}"
        @click="${click}"
        >
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>`;
    }
    firstUpdated() {
        super.firstUpdated();
        this._selectionController.update(this);
    }
};
__decorate([
    query('.mdc-radio')
], Radio.prototype, "mdcRoot", void 0);
__decorate([
    query('input')
], Radio.prototype, "formElement", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (checked) {
        this.mdcFoundation.setChecked(checked);
    })
], Radio.prototype, "checked", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (disabled) {
        this.mdcFoundation.setDisabled(disabled);
    })
], Radio.prototype, "disabled", void 0);
__decorate([
    property({ type: String }),
    observer(function (value) {
        this.mdcFoundation.setValue(value);
    })
], Radio.prototype, "value", void 0);
__decorate([
    property({ type: String })
], Radio.prototype, "name", void 0);
Radio = __decorate([
    customElement('mwc-radio')
], Radio);
export { Radio };
//# sourceMappingURL=mwc-radio.js.map