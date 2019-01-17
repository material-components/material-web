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
// import { classMap } from 'lit-html/directives/class-map.js';
// import { style } from './mwc-chip-css.js';
// import { ripple } from '@material/mwc-ripple/ripple-directive.js';
import '@material/mwc-icon/mwc-icon-font.js';
let Chip = class Chip extends LitElement {
    createRenderRoot() {
        return this.attachShadow({ mode: 'open', delegatesFocus: true });
    }
    renderStyle() {
        // return style;
    }
    render() {
        const classes = {
          'mdc-button--raised': this.raised,
          'mdc-button--unelevated': this.unelevated,
          'mdc-button--outlined': this.outlined,
          'mdc-button--dense': this.dense,
        };
        ${this.renderStyle()}
        <button
            .ripple="${ripple({ unbounded: false })}"
            class="mdc-button ${classMap(classes)}"
            ?disabled="${this.disabled}"
            aria-label="${this.label || this.icon}">
          ${this.icon ? html`<span class="material-icons mdc-button__icon">${this.icon}</span>` : ''}
          ${this.label}
          <slot></slot>
        </button>
        return html `
        <div>hello</div>
      `;
    }
};
Chip = __decorate([
    customElement('mwc-button')
], Chip);
export { Chip };
//# sourceMappingURL=mwc-chip.js.map