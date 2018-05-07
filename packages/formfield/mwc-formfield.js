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
import {ComponentElement, html, MDCWebComponentMixin} from '@material/mwc-base/component-element.js';
import {callWhenReady, findAssignedNode, afterNextRender} from '@material/mwc-base/utils.js';
import {classString as c$} from '@polymer/lit-element/lit-element.js';
import {style} from './mwc-formfield-css.js';
import {MDCFormField} from '@material/form-field';

export class MDCWCFormField extends MDCWebComponentMixin(MDCFormField) {};


export class Formfield extends ComponentElement {
  static get ComponentClass() {
    return MDCWCFormField;
  }

  static get componentSelector() {
    return '.mdc-form-field';
  }

  static get properties() {
    return {
      label: String,
      alignEnd: Boolean,
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.label = '';
    this.alignEnd = false;
    this._setProperty('_labelClickHandler', (e) => {
      this._labelClickHandler(e);
    });
  }

  _renderStyle() {
    return style;
  }

  _render({label, alignEnd, _labelClickHandler}) {
    return html`${this._renderStyle()}
      <div class$="mdc-form-field ${alignEnd ? 'mdc-form-field--align-end' : ''}">
        <slot></slot>
        <label class="mdc-label" on-click="${_labelClickHandler}">${label}</label>
      </div>`;
  }

  _didRender(props, changed) {
    if ('label' in changed && this._input) {
      if (this._input.localName == 'input') {
        this._input.setAttribute('aria-label', props.label);
      } else {
        callWhenReady(this._input, 'setAriaLabel', [props.label]);
      }
    }
  }

  _labelClickHandler(e) {
    if (this._input) {
      this._input.focus();
      this._input.click();
    }
  }

  get _input() {
    return this.__input = this.__input ||
      findAssignedNode(this._root.querySelector('slot'), '*');
  }
}

customElements.define('mwc-formfield', Formfield);
