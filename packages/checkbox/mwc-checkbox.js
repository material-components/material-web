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
import {FormableComponentElement, MDCWebComponentMixin, html} from '@material/mwc-base/formable-component-element.js';
import {style} from './mwc-checkbox-css.js';
import {MDCCheckbox} from '@material/checkbox';

export class MDCWCCheckbox extends MDCWebComponentMixin(MDCCheckbox) {}

export class Checkbox extends FormableComponentElement {
  static get ComponentClass() {
    return MDCWCCheckbox;
  }

  static get componentSelector() {
    return '.mdc-checkbox';
  }

  static get properties() {
    return {
      checked: Boolean,
      indeterminate: Boolean,
      disabled: Boolean,
      value: String,
      name: String
    };
  }

  // TODO(sorvell): need to add delegatesFocus to ShadyDOM. Using it here,
  // allows tabIndex order to be changed (note, > 0 is dubious but -1 seems useful)
  _createRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.checked = false;
    this.indeterminate = false;
    this.disabled = false;
    this.value = '';
    this.name = '';
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
  }

  // TODO(sorvell) #css: add outline none to avoid focus decoration
  _renderStyle() {
    return style;
  }

  _render({checked, value}) {
    return html`
      ${this._renderStyle()}
      <div class="mdc-checkbox">
        <input type="checkbox"
          class="mdc-checkbox__native-control"
          name$="${name}" checked="${checked}" value="${value}"
          on-change="${this._boundInputChangeHandler}">
        <div class="mdc-checkbox__background">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
              fill="none"
              stroke="white"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
      </div>`;
  }

  get indeterminate() {
    return this._component && this._component.indeterminate;
  }

  set indeterminate(value) {
    this.componentReady().then((component) => component.indeterminate = value);
  }

  get disabled() {
    return this._component && this._component.disabled;
  }

  set disabled(value) {
    this.componentReady().then((component) => component.disabled = value);
  }

  _inputChangeHandler(e) {
    this.checked = e.target.checked;
  }
}

customElements.define('mwc-checkbox', Checkbox);
