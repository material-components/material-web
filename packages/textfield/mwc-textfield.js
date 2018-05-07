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
import {MDCWebComponentMixin} from '@material/mwc-base/mdc-web-component.js';
import {MDCTextField} from '@material/textfield';
import {style} from './mwc-textfield-css.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
import '@material/mwc-icon/mwc-icon-font.js';

class MDCWCTextField extends MDCWebComponentMixin(MDCTextField) {}

export class Textfield extends ComponentElement {

  static get ComponentClass() {
    return MDCWCTextField;
  }

  static get componentSelector() {
    return '.mdc-text-field';
  }

  static get properties() {
    return {
      value: String,
      label: String,
      icon: String,
      iconTrailing: Boolean,
      box: Boolean,
      outlined: Boolean,
      disabled: Boolean,
      fullWidth: Boolean,
      required: Boolean,
      helperText: '',
      placeHolder: '',
      type: '',
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.required = false;
    this.value = '';
    this.label = '';
    this.icon = '';
    this.iconTrailing = false;
    this.helperText = '';
    this.box = false;
    this.outlined = false;
    this.disabled = false;
    this.fullWidth = false;
    this.placeHolder = '';
    this.type = '';
  }

  _renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: styling for fullwidth
  _render({value, label, box, outlined, disabled, icon, iconTrailing, fullWidth, required, placeHolder, helperText, type}) {
    const hostClasses = c$({
      'mdc-text-field--with-leading-icon': icon && !iconTrailing,
      'mdc-text-field--with-trailing-icon': icon && iconTrailing,
      'mdc-text-field--box': !fullWidth && box,
      'mdc-text-field--outlined': !fullWidth && outlined,
      'mdc-text-field--disabled': disabled,
      'mdc-text-field--fullwidth': fullWidth,
    });
    return html`
      ${this._renderStyle()}
      <div class$="mdc-text-field mdc-text-field--upgraded ${hostClasses}">
        ${!fullWidth && icon ? html`<i class="material-icons mdc-text-field__icon" tabindex="0">${icon}</i>` : ''}
        ${this._renderInput({value, required, type, placeHolder, label})}
        ${!fullWidth && label ? html`<label class$="mdc-floating-label ${value ? 'mdc-floating-label--float-above' : ''}" for="text-field">${label}</label>` : ''}
        ${!fullWidth && outlined ? html`<div class="mdc-notched-outline">
            <svg><path class="mdc-notched-outline__path"/></svg>
          </div>
          <div class="mdc-notched-outline__idle"></div>` :
    html`<div class="mdc-line-ripple"></div>`}
      </div>
      ${helperText ? html`<p class="mdc-text-field-helper-text" aria-hidden="true">${helperText}</p>` : ''}`;
  }

  _renderInput({value, required, type, placeHolder, label}) {
    return html`<input type="text" type$="${type}" placeholder$="${placeHolder}" required?="${required}" class$="mdc-text-field__input ${value ? 'mdc-text-field--upgraded' : ''}" id="text-field" value="${value}" aria-label$="${label}">`;
  }

  ready() {
    super.ready();
    this._input = this._root.querySelector('input');
  }

  get valid() {
    return this._component && this._component.isValid();
  }

  set valid(value) {
    this.componentReady().then((component) => {
      component.setValid(value);
    });
  }

  click() {
    this._input.click();
  }

  focus() {
    this._input.focus();
  }
}

customElements.define('mwc-textfield', Textfield);
