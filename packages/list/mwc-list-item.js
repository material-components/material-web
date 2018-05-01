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
import {LitElement, html, classString as c$, renderAttributes} from '@polymer/lit-element/lit-element.js';
import {style} from './mwc-list-item-css.js';
import '@material/mwc-icon/mwc-icon-font.js';

export class ListItem extends LitElement {
  static get properties() {
    return {
      label: String,
      icon: String,
      disabled: Boolean,
    };
  }

  constructor() {
    super();
    this.label = '';
    this.icon = '';
    this.disabled = false;
  }

  _renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: add styling for disabled.
  _render({label, icon, disabled}) {
    renderAttributes(this, {'aria-disabled': disabled ? 'true' : null});
    return html`
      ${this._renderStyle()}
      <div class="mdc-list-item" role="menuitem" tabindex="0" aria-disabled$="${disabled}">
        ${icon ? html`<span class="material-icons">${icon}</span>` : ''}
        ${label || ''}
        <slot></slot>
      </div>`;
  }

  ready() {
    super.ready();
    this._listItem = this._root.querySelector('.mdc-list-item');
  }

  get listItem() {
    return this._listItem;
  }

  focus() {
    this.listItem.focus();
  }
}

customElements.define('mwc-list-item', ListItem);
