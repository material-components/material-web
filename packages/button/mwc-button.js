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
import {LitElement, html, classString as c$} from '@polymer/lit-element/lit-element.js';
import {style} from './mwc-button-css.js';
import {MDCWCRipple} from '@material/mwc-ripple/mwc-ripple.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
import '@material/mwc-icon/mwc-icon-font.js';

export class Button extends LitElement {
  static get properties() {
    return {
      raised: Boolean,
      unelevated: Boolean,
      stroked: Boolean,
      dense: Boolean,
      compact: Boolean,
      disabled: Boolean,
      icon: String,
      label: String,
    };
  }

  constructor() {
    super();
    this.raised = false;
    this.unelevated = false;
    this.stroked = false;
    this.dense = false;
    this.compact = false;
    this.disabled = false;
    this.icon = '';
    this.label = '';
  }

  _createRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  async ready() {
    super.ready();
    await afterNextRender();
    this._ripple = new MDCWCRipple(this._root.querySelector('.mdc-button'));
  }

  _renderStyle() {
    return style;
  }

  _render({raised, unelevated, stroked, dense, compact, disabled, icon, label}) {
    const hostClasses = c$({
      'mdc-button--raised': raised,
      'mdc-button--unelevated': unelevated,
      'mdc-button--stroked': stroked,
      'mdc-button--dense': dense,
      'mdc-button--compact': compact,
    });
    return html`
      ${this._renderStyle()}
      <button class$="mdc-button ${hostClasses}" disabled?="${disabled}">
        ${icon ? html`<span class="material-icons mdc-button__icon">${icon}</span>` : ''}
        ${label || ''}
        <slot></slot>
      </button>`;
  }
}

customElements.define('mwc-button', Button);
