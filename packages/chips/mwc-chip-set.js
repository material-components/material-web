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
import { classMap } from "lit-html/directives/class-map.js";
import { style } from "./mwc-chip-set-css.js";
import MDCChipFoundation from "@material/chips/chip/foundation.js";
import MDCChipSetFoundation from "@material/chips/chip-set/foundation.js";
import { Chip as MWCChip } from "./mwc-chip";
import { strings } from "./constants";
// import { strings, cssClasses } from "./constants";
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
let ChipSet = class ChipSet extends BaseElement {
    constructor() {
        super(...arguments);
        this.type = "";
        this.mdcFoundationClass = MDCChipSetFoundation;
    }
    get chips() {
        return [...this.slotEl.assignedNodes()].filter(el => el instanceof MWCChip);
    }
    renderStyle() {
        return style;
    }
    get foundation() {
        return this.mdcFoundation;
    }
    chipSetClasses(type) {
        return {
            "mdc-chip-set--choice": type === "choice",
            "mdc-chip-set--filter": type === "filter"
        };
    }
    createAdapter() {
        return Object.assign({}, super.createAdapter(), { hasClass: className => this.mdcRoot.classList.contains(className), registerInteractionHandler: (evtType, handler) => this.mdcRoot.addEventListener(evtType, handler), deregisterInteractionHandler: (evtType, handler) => this.mdcRoot.removeEventListener(evtType, handler), appendChip: (text, leadingIcon, trailingIcon) => {
                const chipTextEl = document.createElement("div");
                chipTextEl.classList.add(MDCChipFoundation.cssClasses.TEXT);
                chipTextEl.appendChild(document.createTextNode(text));
                const chipEl = document.createElement("div");
                chipEl.classList.add(MDCChipFoundation.cssClasses.CHIP);
                if (leadingIcon) {
                    chipEl.appendChild(leadingIcon);
                }
                chipEl.appendChild(chipTextEl);
                if (trailingIcon) {
                    chipEl.appendChild(trailingIcon);
                }
                this.mdcRoot.appendChild(chipEl);
                return chipEl;
            }, removeChip: chip => {
                const index = this.chips.indexOf(chip);
                this.chips.splice(index, 1);
                chip.remove();
            } });
    }
    firstUpdated() {
        super.firstUpdated();
        this.chips.forEach(el => {
            el.addEventListener(strings.INTERACTION_EVENT, this.interactionHandler.bind(this));
            el.addEventListener(strings.TRAILING_ICON_INTERACTION_EVENT, this.interactionHandler.bind(this));
        });
    }
    render() {
        return html `
      ${this.renderStyle()}
      <div class="mdc-chip-set ${classMap(this.chipSetClasses(this.type))}">
        <slot></slot>
      </div>
    `;
    }
    interactionHandler(e) {
        if (e.type === strings.TRAILING_ICON_INTERACTION_EVENT) {
            emit(this.mdcRoot, e.type, e.detail);
            setTimeout(() => {
                emit(this.mdcRoot, strings.REMOVAL_EVENT, e.detail);
            }, 0);
        }
        else {
            emit(this.mdcRoot, e.type, e.detail);
        }
    }
};
__decorate([
    query(".mdc-chip-set")
], ChipSet.prototype, "mdcRoot", void 0);
__decorate([
    query("slot")
], ChipSet.prototype, "slotEl", void 0);
__decorate([
    property({ type: String })
], ChipSet.prototype, "type", void 0);
ChipSet = __decorate([
    customElement("mwc-chip-set")
], ChipSet);
export { ChipSet };
//# sourceMappingURL=mwc-chip-set.js.map