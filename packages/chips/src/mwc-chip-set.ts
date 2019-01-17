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
import {
  BaseElement,
  customElement,
  query,
  Foundation,
  html,
  Adapter,
  property
} from "@material/mwc-base/base-element";
import { classMap } from "lit-html/directives/class-map.js";
import { style } from "./mwc-chip-set-css.js";
import MDCChipFoundation from "@material/chips/chip/foundation.js";
import MDCChipSetFoundation from "@material/chips/chip-set/foundation.js";
import { Chip as MWCChip } from "./mwc-chip";
import { strings } from "./constants";
// import { strings, cssClasses } from "./constants";

function emit(
  target: HTMLElement,
  evtType: string,
  evtData = {},
  shouldBubble = false
) {
  let evt;

  if (typeof CustomEvent === "function") {
    evt = new CustomEvent(evtType, {
      detail: evtData,
      bubbles: shouldBubble
    });
  } else {
    evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(evtType, shouldBubble, false, evtData);
  }

  target.dispatchEvent(evt);
}

export interface ChipSetFoundation extends Foundation {
  init(): void;
  destroy(): void;
  deselectAll_(): void;
  addChip(text): void;
  select(chipFoundation): void;
  adapter_: any;
  selectedChips_: any;
}

export declare var ChipSetFoundation: {
  prototype: ChipSetFoundation;
  new (adapter: Adapter): ChipSetFoundation;
};

@customElement("mwc-chip-set" as any)
export class ChipSet extends BaseElement {
  @query(".mdc-chip-set")
  protected mdcRoot!: HTMLElement;

  @query("slot")
  protected slotEl!: HTMLSlotElement;

  @property({ type: String })
  type = "";

  protected get chips(): MWCChip[] {
    return [...this.slotEl.assignedNodes()].filter(
      el => el instanceof MWCChip
    ) as MWCChip[];
  }

  protected mdcFoundation!: ChipSetFoundation;

  protected readonly mdcFoundationClass: typeof ChipSetFoundation = MDCChipSetFoundation;

  renderStyle() {
    return style;
  }

  get foundation() {
    return this.mdcFoundation;
  }

  chipSetClasses(type: string) {
    return {
      "mdc-chip-set--choice": type === "choice",
      "mdc-chip-set--filter": type === "filter"
    };
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      hasClass: className => this.mdcRoot.classList.contains(className),
      registerInteractionHandler: (evtType, handler) =>
        this.mdcRoot.addEventListener(evtType, handler),
      deregisterInteractionHandler: (evtType, handler) =>
        this.mdcRoot.removeEventListener(evtType, handler),
      appendChip: (text, leadingIcon, trailingIcon) => {
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
      },
      removeChip: chip => {
        const index = this.chips.indexOf(chip);
        this.chips.splice(index, 1);
        chip.remove();
      }
    };
  }

  firstUpdated() {
    super.firstUpdated();

    this.chips.forEach(el => {
      el.addEventListener(
        strings.INTERACTION_EVENT,
        this.interactionHandler.bind(this)
      );
      el.addEventListener(
        strings.TRAILING_ICON_INTERACTION_EVENT,
        this.interactionHandler.bind(this)
      );
    });
  }

  render() {
    return html`
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
    } else {
      emit(this.mdcRoot, e.type, e.detail);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-chip-set": ChipSet;
  }
}
