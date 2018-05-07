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
import {LitElement, html} from '@polymer/lit-element/lit-element.js';
import {style} from './mwc-switch-css.js';
import {afterNextRender} from '@material/mwc-base/utils.js';

export class Switch extends LitElement {
  static get properties() {
    return {
      checked: Boolean,
    };
  }

  constructor() {
    super();
    this.checked = false;
  }

  _renderStyle() {
    return style;
  }

  _render({checked}) {
    return html`
      ${this._renderStyle()}
      <div class="mdc-switch">
      <input type="checkbox" id="basic-switch" checked="${checked}" class="mdc-switch__native-control" />
      <div class="mdc-switch__background">
        <div class="mdc-switch__knob"></div>
      </div>
    </div>`;
  }

  async ready() {
    super.ready();
    await afterNextRender;
    this._input = this._root.querySelector('input');
  }

  click() {
    this._input.click();
  }

  focus() {
    this._input.focus();
  }

  setAriaLabel(value) {
    this._input.setAttribute('aria-label', value);
  }
}

customElements.define('mwc-switch', Switch);
