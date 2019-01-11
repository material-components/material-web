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
import { LitElement, html, customElement } from '@polymer/lit-element';
import { style } from './mwc-list-item-separator-css.js';
let ListItemSeparator = class ListItemSeparator extends LitElement {
    renderStyle() {
        return style;
    }
    render() {
        return html `
      ${this.renderStyle()}
      <div class="mdc-list-divider" role="separator"></div>`;
    }
};
ListItemSeparator = __decorate([
    customElement('mwc-list-item-separator')
], ListItemSeparator);
export { ListItemSeparator };
//# sourceMappingURL=mwc-list-item-separator.js.map