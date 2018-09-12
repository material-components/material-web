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
import {classMap} from 'lit-html/directives/classMap.js';
import {style} from './mwc-button-css.js';
import {MDCWCRipple} from '@material/mwc-ripple/mwc-ripple.js';
import '@material/mwc-icon/mwc-icon-font.js';

export class Button extends LitElement {
  static get properties() {
    return {
      raised: {type: Boolean},
      unelevated: {type: Boolean},
      outlined: {type: Boolean},
      dense: {type: Boolean},
      disabled: {type: Boolean},
      icon: {type: String},
      label: {type: String},
    };
  }

  constructor() {
    super();
    this.raised = false;
    this.unelevated = false;
    this.outlined = false;
    this.dense = false;
    this.disabled = false;
    this.icon = '';
    this.label = '';
  }

  createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  firstUpdated() {
    this._ripple = new MDCWCRipple(this.shadowRoot.querySelector('.mdc-button'));
  }

  renderStyle() {
    return style;
  }

  render() {
    const {raised, unelevated, outlined, dense, disabled, icon, label} = this;
    const hostClassInfo = {
      'mdc-button--raised': raised,
      'mdc-button--unelevated': unelevated,
      'mdc-button--outlined': outlined,
      'mdc-button--dense': dense,
    };
    return html`
      ${this.renderStyle()}
      <button class="mdc-button ${classMap(hostClassInfo)}" ?disabled="${disabled}">
        ${icon ? html`<span class="material-icons mdc-button__icon">${icon}</span>` : ''}
        ${label || ''}
        <slot></slot>
      </button>`;
  }
}

customElements.define('mwc-button', Button);
