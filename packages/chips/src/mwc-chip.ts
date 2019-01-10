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
} from "@material/mwc-base/base-element.js";

// import { classMap } from 'lit-html/directives/class-map.js';
import { style } from "./mwc-chip-css.js";
import { ripple } from "@material/mwc-ripple/ripple-directive.js";
import "@material/mwc-icon/mwc-icon-font.js";
import MDCChipFoundation from "@material/chips/chip/foundation.js";
import { strings } from "./constants";

export interface ChipFoundation extends Foundation {
  init(): void;
  destroy(): void;
}

export declare var ChipFoundation: {
  prototype: ChipFoundation;
  new (adapter: Adapter): ChipFoundation;
};

@customElement("mwc-chip" as any)
export class Chip extends BaseElement {
  protected mdcFoundation!: ChipFoundation;

  protected readonly mdcFoundationClass: typeof ChipFoundation = MDCChipFoundation;

  @query(".mdc-chip")
  protected mdcRoot!: HTMLElement;

  @property({ type: String })
  leadingIcon;

  @property({ type: String })
  trailingIcon;

  @property({ type: Boolean })
  checkmark = false;

  @property({ type: String })
  label = "";

  createRenderRoot() {
    return this.attachShadow({ mode: "open", delegatesFocus: true });
  }

  renderStyle() {
    return style;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      addClass: className => this.mdcRoot.classList.add(className),
      removeClass: className => this.mdcRoot.classList.remove(className),
      hasClass: className => this.mdcRoot.classList.contains(className),
      addClassToLeadingIcon: className => {
        if (this.leadingIcon) {
          this.leadingIcon.classList.add(className);
        }
      },
      removeClassFromLeadingIcon: className => {
        if (this.leadingIcon) {
          this.leadingIcon.classList.remove(className);
        }
      },
      eventTargetHasClass: (target, className) =>
        target.classList.contains(className),
      registerEventHandler: (evtType, handler) =>
        this.mdcRoot.addEventListener(evtType, handler),
      deregisterEventHandler: (evtType, handler) =>
        this.mdcRoot.removeEventListener(evtType, handler),
      registerTrailingIconInteractionHandler: (evtType, handler) => {
        const trailingIconEl = this.mdcRoot.querySelector(
          strings.TRAILING_ICON_SELECTOR
        );
        if (trailingIconEl) {
          trailingIconEl.addEventListener(evtType, handler);
        }
      },
      deregisterTrailingIconInteractionHandler: (evtType, handler) => {
        const trailingIconEl = this.mdcRoot.querySelector(
          strings.TRAILING_ICON_SELECTOR
        );
        if (trailingIconEl) {
          trailingIconEl.removeEventListener(evtType, handler);
        }
      },
      // notifyInteraction: () => this.emit(strings.INTERACTION_EVENT, {chip: this}, true /* shouldBubble */),
      // notifyTrailingIconInteraction: () => this.emit(
      //   strings.TRAILING_ICON_INTERACTION_EVENT, {chip: this}, true /* shouldBubble */),
      // notifyRemoval: () => this.emit(strings.REMOVAL_EVENT, {chip: this}, true /* shouldBubble */),
      getComputedStyleValue: propertyName =>
        window.getComputedStyle(this.mdcRoot).getPropertyValue(propertyName),
      setStyleProperty: (propertyName, value) =>
        this.mdcRoot.style.setProperty(propertyName, value)
    };
  }

  getLeadingIcon(leadingIcon: string, checkmark: boolean) {
    if (checkmark)
      return html`
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

    if (!checkmark && leadingIcon)
      return html`
        <span class="material-icons mdc-chip__icon mdc-chip__icon--leading"
          >${leadingIcon}</span
        >
      `;
    return "";
  }

  getTrailingIcon(trailingIcon: string) {
    return trailingIcon
      ? html`
          <span class="material-icons mdc-chip__icon mdc-chip__icon--trailing"
            >${trailingIcon}</span
          >
        `
      : "";
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-chip ${this.checkmark ? 'mdc-chip--selected' : ''}" .ripple="${ripple({ unbounded: false })}">
        ${this.getLeadingIcon(this.leadingIcon, this.checkmark)}
        <span class="mdc-chip__text">${this.label}</span> <slot></slot> ${
          this.getTrailingIcon(this.trailingIcon)
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "mwc-chip": Chip;
  }
}
