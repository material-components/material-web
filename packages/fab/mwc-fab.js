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
import { LitElement, html, property, customElement } from '@polymer/lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/classMap.js';
import { style } from './mwc-fab-css';
import { ripple } from '@material/mwc-ripple/ripple-directive.js';
import '@material/mwc-icon/mwc-icon-font.js';
let Fab = class Fab extends LitElement {
    constructor() {
        super(...arguments);
        this.mini = false;
        this.exited = false;
        this.disabled = false;
        this.extended = false;
        this.showIconAtEnd = false;
        this.icon = '';
        this.label = '';
    }
    createRenderRoot() {
        return this.attachShadow({ mode: 'open', delegatesFocus: true });
    }
    renderStyle() {
        return style;
    }
    render() {
        const classes = {
            'mdc-fab--mini': this.mini,
            'mdc-fab--exited': this.exited,
            'mdc-fab--extended': this.extended,
        };
        const showLabel = this.label !== '' && this.extended;
        return html `
      ${this.renderStyle()}
      <button
          .ripple="${ripple()}"
          class="mdc-fab ${classMap(classes)}"
          ?disabled="${this.disabled}"
          aria-label="${this.label || this.icon}">
        ${showLabel && this.showIconAtEnd ? this.label : ''}
        ${this.icon ? html `<span class="material-icons mdc-fab__icon">${this.icon}</span>` : ''}
        ${showLabel && !this.showIconAtEnd ? this.label : ''}
      </button>`;
    }
};
__decorate([
    property({ type: Boolean })
], Fab.prototype, "mini", void 0);
__decorate([
    property({ type: Boolean })
], Fab.prototype, "exited", void 0);
__decorate([
    property({ type: Boolean })
], Fab.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], Fab.prototype, "extended", void 0);
__decorate([
    property({ type: Boolean })
], Fab.prototype, "showIconAtEnd", void 0);
__decorate([
    property()
], Fab.prototype, "icon", void 0);
__decorate([
    property()
], Fab.prototype, "label", void 0);
Fab = __decorate([
    customElement('mwc-fab')
], Fab);
export { Fab };
//# sourceMappingURL=mwc-fab.js.map