/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/focus-ring';

import {ActionElement, PressBeginEvent, PressEndEvent} from '@material/web/actionelement/action-element';
import {ariaProperty} from '@material/web/decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '@material/web/focus/strong-focus';
import {MdRipple} from '@material/web/ripple/ripple';
import {ARIAHasPopup} from '@material/web/types/aria';
import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

/** @soyCompatible */
export abstract class IconButton extends ActionElement {
  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) icon = '';

  @property({type: Boolean}) flipIconInRtl = false;

  @property({type: Boolean}) flipIcon = false;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-haspopup'})
  override ariaHasPopup!: ARIAHasPopup;

  @query('button') buttonElement!: HTMLElement;

  @query('md-ripple') ripple!: MdRipple;

  @state() protected showFocusRing = false;

  constructor() {
    super();
    this.addEventListener('pressbegin', this.handlePressBegin);
    this.addEventListener('pressend', this.handlePressEnd);
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return html`<md-ripple .disabled="${
        this.disabled}" unbounded> </md-ripple>`;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<button
        class="md3-icon-button ${classMap(this.getRenderClasses())}"
        aria-label="${ifDefined(this.ariaLabel)}"
        aria-haspopup="${ifDefined(this.ariaHasPopup)}"
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
        <span class="md3-icon-button__icon">${this.renderIcon(this.icon)}</span>
        ${this.renderTouchTarget()}
        <span class="md3-icon-button__icon"><slot></slot></span>
  </button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-icon-button--flip-icon': this.flipIcon,
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

  override connectedCallback() {
    this.maybeFlipIconInRtl();

    super.connectedCallback();
  }

  private maybeFlipIconInRtl() {
    if (!this.flipIconInRtl) return;

    const isRtl =
        getComputedStyle(this).getPropertyValue('direction') === 'rtl';
    this.flipIcon = isRtl;
  }

  // protected handlePressBegin(event: PressBeginEvent) {
  protected handlePressBegin(event: CustomEvent) {
    this.ripple.beginPress(event.detail.positionEvent);
  }

  // protected handlePressEnd(event: PressEndEvent) {
  protected handlePressEnd(event: CustomEvent) {
    this.ripple.endPress();
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
