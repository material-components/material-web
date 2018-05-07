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
import {MDCWebComponentMixin} from '@material/mwc-base/mdc-web-component.js';
import {MDCTab} from '@material/tabs';
import {style} from './mwc-tab-css.js';
import '@material/mwc-icon/mwc-icon-font.js';

class MDCWCTab extends MDCWebComponentMixin(MDCTab) {}

export class Tab extends LitElement {
  static get properties() {
    return {
      href: String,
      icon: String,
      label: String,
    };
  }

  constructor() {
    super();
    this.href = '';
    this.icon = '';
    this.label = '';
  }

  _renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: sizing with display:table!
  _render({icon, label, href}) {
    return html`
      ${this._renderStyle()}
      <style>

      </style>
      <a class="mdc-tab mdc-tab--with-icon-and-text" href="${href || '#'}">
        ${icon ? html`<i class="material-icons mdc-tab__icon" aria-hidden="true">${icon}</i>` : ''}
        <span class="mdc-tab__icon-text">${label}</span>
      </a>`;
  }

  ready() {
    super.ready();
    this._makeComponent();
  }

  _makeComponent() {
    this._mdcComponent = new MDCWCTab(this._root.querySelector('a'));
  }

  get isActive() {
    return this._mdcComponent && this._mdcComponent.isActive;
  }

  // TODO(sorvell): setting this seems to just set the class and doesn't sync with the tabbar,
  // so don't expose the setter?
  set isActive(value) {
    if (this._mdcComponent) {
      this._mdcComponent.isActive = value;
    }
  }
}

customElements.define('mwc-tab', Tab);
