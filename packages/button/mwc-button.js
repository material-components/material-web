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
import { style } from './mwc-button-css';
import { ripple } from '@material/mwc-ripple/ripple-directive.js';
import '@material/mwc-icon/mwc-icon-font.js';
let Button = class Button extends LitElement {
    constructor() {
        super(...arguments);
        this.raised = false;
        this.unelevated = false;
        this.outlined = false;
        this.dense = false;
        this.disabled = false;
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
            'mdc-button--raised': this.raised,
            'mdc-button--unelevated': this.unelevated,
            'mdc-button--outlined': this.outlined,
            'mdc-button--dense': this.dense,
        };
        return html `
      ${this.renderStyle()}
      <button
          .ripple="${ripple({ unbounded: false })}"
          class="mdc-button ${classMap(classes)}"
          ?disabled="${this.disabled}"
          aria-label="${this.label || this.icon}">
        ${this.icon ? html `<span class="material-icons mdc-button__icon">${this.icon}</span>` : ''}
        ${this.label}
        <slot></slot>
      </button>`;
    }
};
__decorate([
    property({ type: Boolean })
], Button.prototype, "raised", void 0);
__decorate([
    property({ type: Boolean })
], Button.prototype, "unelevated", void 0);
__decorate([
    property({ type: Boolean })
], Button.prototype, "outlined", void 0);
__decorate([
    property({ type: Boolean })
], Button.prototype, "dense", void 0);
__decorate([
    property({ type: Boolean })
], Button.prototype, "disabled", void 0);
__decorate([
    property()
], Button.prototype, "icon", void 0);
__decorate([
    property()
], Button.prototype, "label", void 0);
Button = __decorate([
    customElement('mwc-button')
], Button);
export { Button };
//# sourceMappingURL=mwc-button.js.map