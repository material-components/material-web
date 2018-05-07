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
import {style} from './mwc-radio-css.js';
import {SelectionController} from '@material/mwc-base/selection-controller.js';
import {MDCRadio} from '@material/radio';

export class MDCWCRadio extends MDCWebComponentMixin(MDCRadio) {}

export class Radio extends FormableComponentElement {
  static get ComponentClass() {
    return MDCWCRadio;
  }

  static get componentSelector() {
    return '.mdc-radio';
  }

  static get properties() {
    return {
      checked: Boolean,
      disabled: Boolean,
      value: String,
      name: String,
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.checked = false;
    this.disabled = false;
    this.name = '';
    this.value = '';
    this._boundInputChangeHandler = this._inputChangeHandler.bind(this);
    this._boundInputFocusHandler = this._inputFocusHandler.bind(this);
    this._boundInputBlurHandler = this._inputBlurHandler.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._selectionController = SelectionController.getController(this);
    this._selectionController.register(this);
    this._selectionController.update(this);
  }

  disconnectedCallback() {
    this._selectionController.unregister(this);
  }

  _renderStyle() {
    return style;
  }

  _render({checked, value, name}) {
    return html`
      ${this._renderStyle()}
      <div class="mdc-radio">
        <input class="mdc-radio__native-control" type="radio"
          checked="${checked}" name="${name}" value="${value}"
          on-change="${this._boundInputChangeHandler}"
          on-focus="${this._boundInputFocusHandler}"
          on-blur="${this._boundInputBlurHandler}">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>`;
  }

  get disabled() {
    return this._component && this._component.disabled;
  }

  set disabled(value) {
    this.componentReady().then((component) => component.disabled = value);
  }

  get checked() {
    return this._getProperty('checked');
  }

  set checked(value) {
    this._setProperty('checked', value);
    if (this._selectionController) {
      this._selectionController.update(this);
    }
  }

  _inputChangeHandler(e) {
    this.checked = e.target.checked;
  }

  _inputFocusHandler(e) {
    this._selectionController.focus(e, this);
  }

  _inputBlurHandler(e) {
    this._selectionController.blur(this);
  }

  get name() {
    return this._getProperty('name');
  }

  set name(value) {
    if (this._selectionController) {
      this._selectionController.unregister(this);
    }
    this._setProperty('name', value);
    if (this._selectionController) {
      this._selectionController.register(this);
      this._selectionController.update(this);
    }
  }
}

customElements.define('mwc-radio', Radio);
