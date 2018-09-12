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
import {MDCWebComponentMixin} from '@material/mwc-base/mdc-web-component.js';
import {MDCWCMenu} from '@material/mwc-menu/mwc-menu.js';
import {MDCSelect} from '@material/select';
import {style} from './mwc-select-css.js';
import {style as menuStyle} from '@material/mwc-menu/mwc-menu-css.js';
import {afterNextRender} from '@material/mwc-base/utils.js';

// this element depend on the `mwc-list-item` and `mwc-list-item-separator`
// elements to be registered ahead of time
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item-separator.js';

class MDCWSelect extends MDCWebComponentMixin(MDCSelect) {
  get items() {
    return this.host.items;
  }

  get listItems() {
    return this.items.map((e) => e.listItem);
  }


  get options() {
    return this.listItems;
  }

  initialize(menuFactory, labelFactory) {
    super.initialize((el) => new MDCWCMenu(el), labelFactory);
  }

  get selectedOptions() {
    return this.listItems.filter((e) => e.matches('[aria-selected]'));
  }
}

export class Select extends LitElement {
  static get properties() {
    return {
      label: {type: String},
      disabled: {type: Boolean},
      box: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.label = '';
    this.disabled = false;
    this.box = false;
  }

  // TODO(sorvell) #css: flex for sizing
  render() {
    const {label, disabled, box} = this;
    return html`
      <style>
        :host {
          display: inline-flex;
        }
        .mdc-select {
          flex: 1;
        }
      </style>
      ${menuStyle}${style}
      <div class="mdc-select ${classMap({'mdc-select--box': box})}" role="listbox" aria-disabled="${disabled}">
        <div class="mdc-select__surface" tabindex="0">
          <div class="mdc-select__label">${label}</div>
          <div class="mdc-select__selected-text"></div>
          <div class="mdc-select__bottom-line"></div>
        </div>
        <div class="mdc-menu mdc-select__menu">
          <div class="mdc-list mdc-menu__items">
            <slot></slot>
          </div>
        </div>
      </div>`;
  }

  firstUpdated() {
    this._makeComponent();
  }

  _makeComponent() {
    const root = this.shadowRoot.querySelector('.mdc-select');
    this._mdcComponent = new MDCWSelect(root);
  }

  get items() {
    return this.shadowRoot.querySelector('slot').assignedNodes({flatten: true})
      .filter((e) => e.localName == 'mwc-list-item');
  }

  get value() {
    return this._mdcComponent.value;
  }

  get selectedOptions() {
    this._makeComponent.selectedOptions;
  }

  get selectedIndex() {
    return this._mdcComponent.selectedIndex();
  }

  set selectedIndex(selectedIndex) {
    this._mdcComponent.setSelectedIndex(selectedIndex);
  }

  item(index) {
    return this._mdcComponent.item(index);
  }

  nameditem(key) {
    this._mdcComponent.named;
    // NOTE: IE11 precludes us from using Array.prototype.find
    for (let i = 0, options = this.options, option; (option = options[i]); i++) {
      if (option.id === key || option.getAttribute('name') === key) {
        return option;
      }
    }
    return null;
  }
}

customElements.define('mwc-select', Select);
