var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { customElement, query, html, property, observer } from '@material/mwc-base/base-element.js';
import { LitElement } from '@polymer/lit-element';
import { ripple } from '@material/mwc-ripple/ripple-directive';
import { style } from './mwc-list-item-css.js';
let ListItem = class ListItem extends LitElement {
    constructor() {
        super(...arguments);
        this.value = '';
        this.label = '';
        this.icon = '';
        this.tabindex = 0;
        this.disabled = false;
    }
    get classList() {
        return this.mdcRoot.classList;
    }
    get setAttribute() {
        return this.mdcRoot.setAttribute;
    }
    renderStyle() {
        return style;
    }
    render() {
        const { label, icon, disabled, tabindex } = this;
        return html `
      ${this.renderStyle()}
      <div class="mdc-list-item" role="menuitem" tabindex="${tabindex}" aria-disabled="${disabled}" .ripple="${ripple({ unbounded: false })}">
        ${icon ? html `<span class="material-icons">${icon}</span>` : ''}
        ${label || ''}
        <span class="mdc-list-item__text">
          <slot></slot>
        </span>
      </div>`;
    }
    focus() {
        this.mdcRoot.focus();
    }
};
__decorate([
    query('.mdc-list-item')
], ListItem.prototype, "mdcRoot", void 0);
__decorate([
    property({ type: String })
], ListItem.prototype, "value", void 0);
__decorate([
    property({ type: String })
], ListItem.prototype, "label", void 0);
__decorate([
    property({ type: String })
], ListItem.prototype, "icon", void 0);
__decorate([
    property({ type: Number })
], ListItem.prototype, "tabindex", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (value) {
        this.setAttribute('aria-disabled', String(value));
    })
], ListItem.prototype, "disabled", void 0);
ListItem = __decorate([
    customElement('mwc-list-item')
], ListItem);
export { ListItem };
//# sourceMappingURL=mwc-list-item.js.map