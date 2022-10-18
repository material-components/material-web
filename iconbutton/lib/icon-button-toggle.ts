/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../actionelement/action-element.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {MdRipple} from '../../ripple/ripple.js';

/** @soyCompatible */
export abstract class IconButtonToggle extends ActionElement {
  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) onIcon = '';

  @property({type: String}) offIcon = '';

  // `aria-label` of the button when `on` is true.
  @property({type: String}) ariaLabelOn!: string;

  // `aria-label` of the button when `on` is false.
  @property({type: String}) ariaLabelOff!: string;

  @property({type: Boolean, reflect: true}) isOn = false;

  @query('md-ripple') ripple!: MdRipple;

  @state() protected showFocusRing = false;

  protected readonly rippleElementTag = literal`md-ripple`;

  protected readonly focusElementTag = literal`md-focus-ring`;

  protected readonly iconElementTag = literal`md-icon`;

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress({cancelled}: EndPressConfig) {
    this.ripple.endPress();
    if (cancelled) {
      return;
    }
    this.isOn = !this.isOn;
    const detail = {isOn: this.isOn};
    this.dispatchEvent(new CustomEvent(
        'icon-button-toggle-change', {detail, bubbles: true, composed: true}));
    super.endPress({cancelled, actionData: detail});
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return staticHtml`<${this.rippleElementTag} ?disabled="${
        this.disabled}" unbounded> </${this.rippleElementTag}>`;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    const hasToggledAriaLabel = this.ariaLabelOn && this.ariaLabelOff;
    const ariaPressedValue = hasToggledAriaLabel ? undefined : this.isOn;
    const ariaLabelValue = hasToggledAriaLabel ?
        (this.isOn ? this.ariaLabelOn : this.ariaLabelOff) :
        this.ariaLabel;
    return html`<button
          class="md3-icon-button ${classMap(this.getRenderClasses())}"
          aria-pressed="${ifDefined(ariaPressedValue)}"
          aria-label="${ifDefined(ariaLabelValue)}"
          ?disabled="${this.disabled}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerdown="${this.handlePointerDown}"
          @pointerup="${this.handlePointerUp}"
          @pointercancel="${this.handlePointerCancel}"
          @pointerleave="${this.handlePointerLeave}"
          @pointerenter="${this.handlePointerEnter}"
          @click="${this.handleClick}"
          @contextmenu="${this.handleContextMenu}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.renderTouchTarget()}
        <span class="md3-icon-button__icon">
          <slot name="offIcon">${this.renderIcon(this.offIcon)}</slot>
        </span>
        <span class="md3-icon-button__icon md3-icon-button__icon--on">
          <slot name="onIcon">${this.renderIcon(this.onIcon)}</slot>
        </span>
      </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-icon-button--on': this.isOn,
    };
  }

  /** @soyTemplate */
  protected renderIcon(icon: string): TemplateResult|string {
    return icon ?
        staticHtml`<${this.iconElementTag}>${icon}</${this.iconElementTag}>` :
        '';
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return staticHtml`<${this.focusElementTag} .visible="${
        this.showFocusRing}"></${this.focusElementTag}>`;
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }
}
