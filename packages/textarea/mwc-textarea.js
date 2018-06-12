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

import {ComponentElement, html} from '@material/mwc-base/component-element.js';
import {classString as c$} from '@polymer/lit-element/lit-element.js';
import {Textfield} from '@material/mwc-textfield';

export class Textarea extends Textfield {

  static get properties() {
    return {
      name: String,
      value: String,
      label: String,
      disabled: Boolean,
      dense: Boolean,
      fullWidth: Boolean,
      required: Boolean,
      helperText: '',
      placeHolder: '',
      rows: String,
      cols: String
    };
  }

  constructor() {
    super();
    this.required = false;
    this.name = '';
    this.value = '';
    this.label = '';
    this.helperText = '';
    this.disabled = false;
    this.fullWidth = false;
    this.placeHolder = '';
    this.rows = '';
    this.cols = '';
  }

  // TODO(sorvell) #css: styling for fullwidth
  _render({name, value, label, disabled, dense, fullWidth, required, placeHolder, helperText, rows, cols}) {
    const hostClasses = c$({
      'mdc-text-field--disabled': disabled,
      'mdc-text-field--fullwidth': fullWidth,
      'mdc-text-field--dense': dense
    });
    return html`
      ${this._renderStyle()}
      <div class$="mdc-text-field text-field mdc-text-field--textarea ${hostClasses}">
        <textarea name=${name} id="text-field--textarea" placeholder$="${placeHolder}" required?="${required}" class$="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" value="${value}" rows$="${rows}" cols$="${cols}" aria-label$="${label}"></textarea>
        <label for="text-field--textarea" class="mdc-floating-label">${label}</label>
        ${!fullWidth ? html`<div class="mdc-line-ripple"></div>` : ''}
      </div>
      ${helperText ? html`<p class="mdc-text-field-helper-text" aria-hidden="true">${helperText}</p>` : ''}`;
  }

  ready() {
    super.ready();
    this._input = this._root.querySelector('textarea');
  }

}

customElements.define('mwc-textarea', Textarea);
