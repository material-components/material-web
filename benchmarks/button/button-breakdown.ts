/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import { MdFilledButton } from "../../button/filled-button.js";
import { html, TemplateResult, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import {
  property,
  query,
  queryAssignedElements,
  state,
} from "lit/decorators.js";
// import { ClassInfo, classMap } from "lit/directives/class-map.js";
// import { ifDefined } from "lit/directives/if-defined.js";
//import { html as staticHtml, literal } from "lit/static-html.js";

// import {
//   ActionElement,
//   BeginPressConfig,
//   EndPressConfig,
// } from "../../actionelement/action-element.js";
import { ariaProperty } from "../../decorators/aria-property.js";
// import {
//   pointerPress,
//   shouldShowStrongFocus,
// } from "../../focus/strong-focus.js";
import { MdRipple } from "../../ripple/ripple.js";
import { ARIAHasPopup } from "../../types/aria.js";

@customElement("wo-ripple-button")
export class woRButton extends MdFilledButton {
  protected override renderRipple() {
    return html``;
  }
}

@customElement("wo-ripple-focus-button")
export class woRFRButton extends MdFilledButton {
  protected override renderRipple() {
    return html``;
  }

  protected override renderFocusRing() {
    return html``;
  }
}

@customElement("wo-ripple-focus-styles-button")
export class woRFRSTButton extends MdFilledButton {
  static override styles = [css``];

  protected override renderRipple() {
    return html``;
  }

  protected override renderFocusRing() {
    return html``;
  }
}

@customElement("wo-ripple-focus-styles-sloticon-button")
export class woRFRSTSLButton extends MdFilledButton {
  static override styles = [css``];

  protected override renderRipple() {
    return html``;
  }

  protected override renderFocusRing() {
    return html``;
  }

  protected override renderIcon() {
    return html`<span class="md3-button__icon-slot-container">
      <slot name="icon">${this.icon}</slot>
    </span>`;
  }

  override update() {
    (LitElement.prototype as any).update.call(this);
  }

  protected override handleSlotChange(): void {}
}

@customElement("wo-ripple-focus-styles-sloticon-render-button")
export class woRFRSTSLRButton extends MdFilledButton {
  static override styles = [css``];

  protected override renderRipple() {
    return html``;
  }

  protected override renderFocusRing() {
    return html``;
  }

  protected override renderIcon() {
    return html`<span class="md3-button__icon-slot-container">
      <slot name="icon">${this.icon}</slot>
    </span>`;
  }

  override update() {
    (LitElement.prototype as any).update.call(this);
  }

  protected override handleSlotChange(): void {}

  protected override render() {
    return html` <button class="md3-button">
      ${this.renderFocusRing()} ${this.renderOverlay()} ${this.renderRipple()}
      ${this.renderOutline()} ${this.renderTouchTarget()}
      ${this.renderLeadingIcon()} ${this.renderLabel()}
      ${this.renderTrailingIcon()}
    </button>`;
  }
}

@customElement("wo-ripple-focus-styles-sloticon-render-ae-button")
export abstract class NoAEButton extends LitElement {
  static override styles = [css``];

  static override shadowRootOptions: ShadowRootInit = {
    mode: "open",
    delegatesFocus: true,
  };

  //protected readonly iconTag = literal`md-icon`;

  // TODO(b/210730484): replace with @soyParam annotation
  @property({
    type: String,
    attribute: "data-aria-has-popup",
    noAccessor: true,
  })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaHasPopup!: ARIAHasPopup;

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Boolean, attribute: "trailingicon" }) trailingIcon = false;

  @property({ type: String }) icon = "";

  @property({ type: String }) label = "";

  // TODO(b/210730484): replace with @soyParam annotation
  @property({ type: String, attribute: "data-aria-label", noAccessor: true })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;

  @property({ type: Boolean }) hasIcon = false;

  @property({ type: Boolean }) preventClickDefault = false;

  @query(".md3-button") buttonElement!: HTMLElement;

  @query("md-ripple") ripple!: MdRipple;

  @state() protected showFocusRing = false;

  @queryAssignedElements({ slot: "icon", flatten: true })
  protected iconElement!: HTMLElement[] | null;

  protected override render() {
    return html` <button class="md3-button">
      ${this.renderFocusRing()} ${this.renderOverlay()} ${this.renderRipple()}
      ${this.renderOutline()} ${this.renderTouchTarget()}
      ${this.renderLeadingIcon()} ${this.renderLabel()}
      ${this.renderTrailingIcon()}
    </button>`;
  }

  protected renderRipple() {
    return html``;
  }

  protected renderFocusRing() {
    return html``;
  }

  protected renderIcon() {
    return html`<span class="md3-button__icon-slot-container">
      <slot name="icon">${this.icon}</slot>
    </span>`;
  }

  protected renderTouchTarget(): TemplateResult {
    return html` <span class="md3-button__touch"></span> `;
  }

  protected renderOverlay(): TemplateResult {
    return html``;
  }

  protected renderOutline(): TemplateResult {
    return html``;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="md3-button__label">${this.label}</span>`;
  }

  protected renderLeadingIcon(): TemplateResult | string {
    return this.trailingIcon ? "" : this.renderIcon();
  }

  protected renderTrailingIcon(): TemplateResult | string {
    return this.trailingIcon ? this.renderIcon() : "";
  }
}

@customElement("wo-ripple-focus-styles-sloticon-render-ae-reflecting-button")
export abstract class NoAERButton extends LitElement {
  static override styles = [css``];

  static override shadowRootOptions: ShadowRootInit = {
    mode: "open",
    delegatesFocus: true,
  };

  //protected readonly iconTag = literal`md-icon`;

  // TODO(b/210730484): replace with @soyParam annotation
  /*@property({
    type: String,
    attribute: "data-aria-has-popup",
    noAccessor: true,
  })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaHasPopup!: ARIAHasPopup;

  @property({ type: Boolean, reflect: true }) disabled = false;
*/
  @property({ type: Boolean, attribute: "trailingicon" }) trailingIcon = false;

  @property({ type: String }) icon = "";

  @property({ type: String }) label = "";

  // TODO(b/210730484): replace with @soyParam annotation
  /*
  @property({ type: String, attribute: "data-aria-label", noAccessor: true })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;
*/
  @property({ type: Boolean }) hasIcon = false;

  @property({ type: Boolean }) preventClickDefault = false;

  @query(".md3-button") buttonElement!: HTMLElement;

  @query("md-ripple") ripple!: MdRipple;

  @state() protected showFocusRing = false;

  @queryAssignedElements({ slot: "icon", flatten: true })
  protected iconElement!: HTMLElement[] | null;

  protected override render() {
    return html` <button class="md3-button">
      ${this.renderFocusRing()} ${this.renderOverlay()} ${this.renderRipple()}
      ${this.renderOutline()} ${this.renderTouchTarget()}
      ${this.renderLeadingIcon()} ${this.renderLabel()}
      ${this.renderTrailingIcon()}
    </button>`;
  }

  protected renderRipple() {
    return html``;
  }

  protected renderFocusRing() {
    return html``;
  }

  protected renderIcon() {
    return html`<span class="md3-button__icon-slot-container">
      <slot name="icon">${this.icon}</slot>
    </span>`;
  }

  protected renderTouchTarget(): TemplateResult {
    return html` <span class="md3-button__touch"></span> `;
  }

  protected renderOverlay(): TemplateResult {
    return html``;
  }

  protected renderOutline(): TemplateResult {
    return html``;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="md3-button__label">${this.label}</span>`;
  }

  protected renderLeadingIcon(): TemplateResult | string {
    return this.trailingIcon ? "" : this.renderIcon();
  }

  protected renderTrailingIcon(): TemplateResult | string {
    return this.trailingIcon ? this.renderIcon() : "";
  }
}

@customElement(
  "wo-ripple-focus-styles-sloticon-render-ae-reflecting-queries-button"
)
export abstract class NoAERQButton extends LitElement {
  static override styles = [css``];

  static override shadowRootOptions: ShadowRootInit = {
    mode: "open",
    delegatesFocus: true,
  };

  //protected readonly iconTag = literal`md-icon`;

  // TODO(b/210730484): replace with @soyParam annotation
  /*@property({
    type: String,
    attribute: "data-aria-has-popup",
    noAccessor: true,
  })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaHasPopup!: ARIAHasPopup;

  @property({ type: Boolean, reflect: true }) disabled = false;
*/
  @property({ type: Boolean, attribute: "trailingicon" }) trailingIcon = false;

  @property({ type: String }) icon = "";

  @property({ type: String }) label = "";

  // TODO(b/210730484): replace with @soyParam annotation
  /*
  @property({ type: String, attribute: "data-aria-label", noAccessor: true })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;
*/
  @property({ type: Boolean }) hasIcon = false;

  @property({ type: Boolean }) preventClickDefault = false;

  // @query(".md3-button") buttonElement!: HTMLElement;

  // @query("md-ripple") ripple!: MdRipple;

  @state() protected showFocusRing = false;

  // @queryAssignedElements({ slot: "icon", flatten: true })
  // protected iconElement!: HTMLElement[] | null;

  protected override render() {
    return html` <button class="md3-button">
      ${this.renderFocusRing()} ${this.renderOverlay()} ${this.renderRipple()}
      ${this.renderOutline()} ${this.renderTouchTarget()}
      ${this.renderLeadingIcon()} ${this.renderLabel()}
      ${this.renderTrailingIcon()}
    </button>`;
  }

  protected renderRipple() {
    return html``;
  }

  protected renderFocusRing() {
    return html``;
  }

  protected renderIcon() {
    return html`<span class="md3-button__icon-slot-container">
      <slot name="icon">${this.icon}</slot>
    </span>`;
  }

  protected renderTouchTarget(): TemplateResult {
    return html` <span class="md3-button__touch"></span> `;
  }

  protected renderOverlay(): TemplateResult {
    return html``;
  }

  protected renderOutline(): TemplateResult {
    return html``;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="md3-button__label">${this.label}</span>`;
  }

  protected renderLeadingIcon(): TemplateResult | string {
    return this.trailingIcon ? "" : this.renderIcon();
  }

  protected renderTrailingIcon(): TemplateResult | string {
    return this.trailingIcon ? this.renderIcon() : "";
  }
}

@customElement(
  "wo-ripple-focus-styles-sloticon-render-ae-reflecting-queries-props-button"
)
export abstract class NoAERQPButton extends LitElement {
  static override styles = [css``];

  static override shadowRootOptions: ShadowRootInit = {
    mode: "open",
    delegatesFocus: true,
  };

  //protected readonly iconTag = literal`md-icon`;

  // TODO(b/210730484): replace with @soyParam annotation
  /*@property({
    type: String,
    attribute: "data-aria-has-popup",
    noAccessor: true,
  })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaHasPopup!: ARIAHasPopup;

  @property({ type: Boolean, reflect: true }) disabled = false;
*/
  /*@property({ type: Boolean, attribute: "trailingicon" }) */ trailingIcon =
    false;

  /*@property({ type: String })*/ icon = "";

  /*@property({ type: String })*/ label = "";

  // TODO(b/210730484): replace with @soyParam annotation
  /*
  @property({ type: String, attribute: "data-aria-label", noAccessor: true })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;
*/
  /*@property({ type: Boolean })*/ hasIcon = false;

  /*@property({ type: Boolean })*/ preventClickDefault = false;

  // @query(".md3-button") buttonElement!: HTMLElement;

  // @query("md-ripple") ripple!: MdRipple;

  /*@state()*/ protected showFocusRing = false;

  // @queryAssignedElements({ slot: "icon", flatten: true })
  // protected iconElement!: HTMLElement[] | null;

  protected override render() {
    return html` <button class="md3-button">
      ${this.renderFocusRing()} ${this.renderOverlay()} ${this.renderRipple()}
      ${this.renderOutline()} ${this.renderTouchTarget()}
      ${this.renderLeadingIcon()} ${this.renderLabel()}
      ${this.renderTrailingIcon()}
    </button>`;
  }

  protected renderRipple() {
    return html``;
  }

  protected renderFocusRing() {
    return html``;
  }

  protected renderIcon() {
    return html`<span class="md3-button__icon-slot-container">
      <slot name="icon">${this.icon}</slot>
    </span>`;
  }

  protected renderTouchTarget(): TemplateResult {
    return html` <span class="md3-button__touch"></span> `;
  }

  protected renderOverlay(): TemplateResult {
    return html``;
  }

  protected renderOutline(): TemplateResult {
    return html``;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="md3-button__label">${this.label}</span>`;
  }

  protected renderLeadingIcon(): TemplateResult | string {
    return this.trailingIcon ? "" : this.renderIcon();
  }

  protected renderTrailingIcon(): TemplateResult | string {
    return this.trailingIcon ? this.renderIcon() : "";
  }
}

@customElement(
  "wo-ripple-focus-styles-sloticon-render-ae-reflecting-queries-props-delegates-button"
)
export abstract class NoAERQPDButton extends LitElement {
  static override styles = [css``];

  static override shadowRootOptions: ShadowRootInit = {
    mode: "open",
    //delegatesFocus: true,
  };

  //protected readonly iconTag = literal`md-icon`;

  // TODO(b/210730484): replace with @soyParam annotation
  /*@property({
    type: String,
    attribute: "data-aria-has-popup",
    noAccessor: true,
  })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaHasPopup!: ARIAHasPopup;

  @property({ type: Boolean, reflect: true }) disabled = false;
*/
  /*@property({ type: Boolean, attribute: "trailingicon" }) */ trailingIcon =
    false;

  /*@property({ type: String })*/ icon = "";

  /*@property({ type: String })*/ label = "";

  // TODO(b/210730484): replace with @soyParam annotation
  /*
  @property({ type: String, attribute: "data-aria-label", noAccessor: true })
  @ariaProperty // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;
*/
  /*@property({ type: Boolean })*/ hasIcon = false;

  /*@property({ type: Boolean })*/ preventClickDefault = false;

  // @query(".md3-button") buttonElement!: HTMLElement;

  // @query("md-ripple") ripple!: MdRipple;

  /*@state()*/ protected showFocusRing = false;

  // @queryAssignedElements({ slot: "icon", flatten: true })
  // protected iconElement!: HTMLElement[] | null;

  protected override render() {
    return html` <button class="md3-button">
      ${this.renderFocusRing()} ${this.renderOverlay()} ${this.renderRipple()}
      ${this.renderOutline()} ${this.renderTouchTarget()}
      ${this.renderLeadingIcon()} ${this.renderLabel()}
      ${this.renderTrailingIcon()}
    </button>`;
  }

  protected renderRipple() {
    return html``;
  }

  protected renderFocusRing() {
    return html``;
  }

  protected renderIcon() {
    return html`<span class="md3-button__icon-slot-container">
      <slot name="icon">${this.icon}</slot>
    </span>`;
  }

  protected renderTouchTarget(): TemplateResult {
    return html` <span class="md3-button__touch"></span> `;
  }

  protected renderOverlay(): TemplateResult {
    return html``;
  }

  protected renderOutline(): TemplateResult {
    return html``;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="md3-button__label">${this.label}</span>`;
  }

  protected renderLeadingIcon(): TemplateResult | string {
    return this.trailingIcon ? "" : this.renderIcon();
  }

  protected renderTrailingIcon(): TemplateResult | string {
    return this.trailingIcon ? this.renderIcon() : "";
  }
}

@customElement(
  "wo-ripple-focus-styles-sloticon-render-ae-reflecting-queries-props-delegates-templates-button"
)
export abstract class NoAERQPDDTButton extends LitElement {
  static override styles = [css``];

  /*@property({ type: String })*/ icon = "";

  /*@property({ type: String })*/ label = "";

  protected override render() {
    return html` <button class="md3-button">
      <span class="md3-button__touch"></span>
      <span class="md3-button__icon-slot-container">
        <slot name="icon">${this.icon} </slot>
      </span>
      <span class="md3-button__label">${this.label}</span>
    </button>`;
  }
}
