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
import { LitElement, property, html, customElement } from "@polymer/lit-element";
import { classMap } from 'lit-html/directives/class-map.js';
import { style } from './mwc-chip-set-css.js';
let ChipSet = class ChipSet extends LitElement {
    constructor() {
        super(...arguments);
        this.type = '';
    }
    renderStyle() {
        return style;
    }
    render() {
        const hostClassInfo = {
            'mdc-chip-set--choice': this.type === 'choice',
            'mdc-chip-set--filter': this.type === 'filter',
        };
        return html `
      ${this.renderStyle()}
      <div class="mdc-chip-set ${classMap(hostClassInfo)}">
        <slot></slot>
      </div>`;
    }
};
__decorate([
    property({ type: String })
], ChipSet.prototype, "type", void 0);
ChipSet = __decorate([
    customElement('mwc-chip-set')
], ChipSet);
export { ChipSet };
//# sourceMappingURL=mwc-chip-set.js.map