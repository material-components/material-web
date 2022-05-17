/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ActionElement, PressBeginEvent, PressEndEvent} from '@material/web/actionelement/action-element';
import {ariaProperty} from '@material/web/decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '@material/web/focus/strong-focus';
import {MdRipple} from '@material/web/ripple/ripple';
import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

/** @soyCompatible */
export abstract class IconButtonToggle extends ActionElement {
  /** @soyPrefixAttribute */
  @ariaProperty
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

  constructor() {
    super();
    this.addEventListener('pressbegin', this.handlePressBegin);
    this.addEventListener('pressend', this.handlePressEnd);
  }

  // protected handlePressBegin(event: PressBeginEvent) {
  protected handlePressBegin(event: CustomEvent) {
    this.ripple.beginPress(event.detail.positionEvent);
  }

  // protected handlePressEnd(event: PressEndEvent) {
  protected handlePressEnd(event: CustomEvent) {
    this.ripple.endPress();
    if (event.detail.cancelled) {
      return;
    }
    this.isOn = !this.isOn;
    const detail = {isOn: this.isOn};
    this.dispatchEvent(new CustomEvent(
        'icon-button-toggle-change', {detail, bubbles: true, composed: true}));
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return html`<md-ripple .disabled="${
        this.disabled}" unbounded> </md-ripple>`;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    const hasToggledAriaLabel =
        this.ariaLabelOn !== undefined && this.ariaLabelOff !== undefined;
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
          @clickmod="${this.handleClick}"
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
  protected abstract renderIcon(icon: string): TemplateResult|string;

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
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
