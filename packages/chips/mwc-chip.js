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
import { BaseElement, customElement, query, html, property } from "@material/mwc-base/base-element";
// import { emit } from '@material/mwc-base/utils';
import { classMap } from "lit-html/directives/class-map";
import { style } from "./mwc-chip-css.js";
import { ripple } from "@material/mwc-ripple/ripple-directive";
import MDCChipFoundation from "@material/chips/chip/foundation";
import { strings } from "./constants";
import "@material/mwc-icon/mwc-icon-font";
function emit(target, evtType, evtData = {}, shouldBubble = false) {
    let evt;
    if (typeof CustomEvent === "function") {
        evt = new CustomEvent(evtType, {
            detail: evtData,
            bubbles: shouldBubble
        });
    }
    else {
        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(evtType, shouldBubble, false, evtData);
    }
    target.dispatchEvent(evt);
}
let Chip = class Chip extends BaseElement {
    constructor() {
        super(...arguments);
        this.mdcFoundationClass = MDCChipFoundation;
        this.label = "";
        this.active = false;
        this.checkmark = false;
    }
    get foundation() {
        return this.mdcFoundation;
    }
    createRenderRoot() {
        return this.attachShadow({ mode: "open", delegatesFocus: true });
    }
    renderStyle() {
        return style;
    }
    remove() {
        this.mdcRoot.parentNode
            ? this.mdcRoot.parentNode.removeChild(this.mdcRoot)
            : false;
    }
    createAdapter() {
        return Object.assign({}, super.createAdapter(), { addClass: className => this.mdcRoot.classList.add(className), removeClass: className => this.mdcRoot.classList.remove(className), hasClass: className => this.mdcRoot.classList.contains(className), addClassToLeadingIcon: className => {
                const leadingIconEl = this.mdcRoot.querySelector(strings.LEADING_ICON_SELECTOR);
                if (leadingIconEl) {
                    leadingIconEl.classList.add(className);
                }
            }, removeClassFromLeadingIcon: className => {
                const leadingIconEl = this.mdcRoot.querySelector(strings.LEADING_ICON_SELECTOR);
                if (leadingIconEl) {
                    leadingIconEl.classList.remove(className);
                }
            }, eventTargetHasClass: (target, className) => target.classList.contains(className), registerEventHandler: (evtType, handler) => this.mdcRoot.addEventListener(evtType, handler), deregisterEventHandler: (evtType, handler) => this.mdcRoot.removeEventListener(evtType, handler), registerTrailingIconInteractionHandler: (evtType, handler) => {
                const trailingIconEl = this.mdcRoot.querySelector(strings.TRAILING_ICON_SELECTOR);
                if (trailingIconEl) {
                    trailingIconEl.addEventListener(evtType, handler);
                }
            }, deregisterTrailingIconInteractionHandler: (evtType, handler) => {
                const trailingIconEl = this.mdcRoot.querySelector(strings.TRAILING_ICON_SELECTOR);
                if (trailingIconEl) {
                    trailingIconEl.removeEventListener(evtType, handler);
                }
            }, notifyInteraction: () => {
                emit(this, strings.INTERACTION_EVENT, { chip: this });
            }, notifyTrailingIconInteraction: () => {
                emit(this, strings.TRAILING_ICON_INTERACTION_EVENT, { chip: this });
            }, notifyRemoval: () => {
                emit(this, strings.REMOVAL_EVENT, { chip: this });
            }, getComputedStyleValue: propertyName => window.getComputedStyle(this.mdcRoot).getPropertyValue(propertyName), setStyleProperty: (propertyName, value) => this.mdcRoot.style.setProperty(propertyName, value) });
    }
    getLeadingIcon(leadingIcon, active) {
        return leadingIcon
            ? html `
          <span
            class="material-icons mdc-chip__icon mdc-chip__icon--leading
          ${active ? "mdc-chip__icon--leading-hidden" : ""}
            "
            >${leadingIcon}</span
          >
        `
            : "";
    }
    getCheckmark(checkmark) {
        if (checkmark) {
            return html `
        <div class="mdc-chip__checkmark">
          <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
            <path
              class="mdc-chip__checkmark-path"
              fill="none"
              stroke="black"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"
            ></path>
          </svg>
        </div>
      `;
        }
        return "";
    }
    getTrailingIcon(trailingIcon) {
        return trailingIcon
            ? html `
          <span
            class="material-icons mdc-chip__icon mdc-chip__icon--trailing"
            tabindex="0"
            role="button"
            >${trailingIcon}</span
          >
        `
            : "";
    }
    chipClasses(active) {
        return {
            "mdc-chip--selected": active
        };
    }
    render() {
        return html `
      ${this.renderStyle()}
      <div
        class="mdc-chip ${classMap(this.chipClasses(this.active))}"
        .ripple="${ripple({ unbounded: false })}"
      >
        ${this.getLeadingIcon(this.leadingIcon, this.active)}
        ${this.getCheckmark(this.checkmark)}
        <span class="mdc-chip__text">${this.label}</span> <slot></slot> ${this.getTrailingIcon(this.trailingIcon)}
      </div>
    `;
    }
};
__decorate([
    query(".mdc-chip")
], Chip.prototype, "mdcRoot", void 0);
__decorate([
    property()
], Chip.prototype, "leadingIcon", void 0);
__decorate([
    property()
], Chip.prototype, "trailingIcon", void 0);
__decorate([
    property({ type: String })
], Chip.prototype, "label", void 0);
__decorate([
    property({ type: Function })
], Chip.prototype, "onClick", void 0);
__decorate([
    property({ type: Boolean })
], Chip.prototype, "active", void 0);
__decorate([
    property({ type: Boolean })
], Chip.prototype, "checkmark", void 0);
Chip = __decorate([
    customElement("mwc-chip")
], Chip);
export { Chip };
//# sourceMappingURL=mwc-chip.js.map