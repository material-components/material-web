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
import {classString as c$} from '@polymer/lit-element/lib/render-helpers.js';
import {style} from './mwc-fab-css.js';
import {MDCWCRipple} from '@material/mwc-ripple/mwc-ripple.js';
import {afterNextRender} from '@material/mwc-base/utils.js';
import '@material/mwc-icon/mwc-icon-font.js';

export class Fab extends LitElement {
  static get properties() {
    return {
      mini: {type: Boolean},
      exited: {type: Boolean},
      disabled: {type: Boolean},
      icon: {type: String},
      label: {type: String},
    };
  }

  constructor() {
    super();
    this.icon = '';
    this.mini = false;
    this.exited = false;
    this.label = '';
  }

  createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  firstUpdated() {
    this._ripple = new MDCWCRipple(this.shadowRoot.querySelector('.mdc-fab'));
  }

  renderStyle() {
    return style;
  }

  render() {
    const {icon, mini, exited, disabled, label} = this;
    const hostClasses = c$({
      'mdc-fab--mini': mini,
      'mdc-fab--exited': exited,
    });
    return html`
      ${this.renderStyle()}
      <button class="mdc-fab ${hostClasses}" ?disabled="${disabled}" aria-label="${label || icon}">
        ${icon ? html`<span class="material-icons mdc-fab__icon">${icon}</span>` : ''}
      </button>`;
  }
}

customElements.define('mwc-fab', Fab);
