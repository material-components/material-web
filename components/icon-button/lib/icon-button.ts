/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring';

import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../action-element/action-element';
import {ariaProperty} from '../../decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus';
import {MdRipple} from '../../ripple/ripple';
import {ARIAHasPopup} from '../../types/aria';

/** @soyCompatible */
export class IconButton extends ActionElement {
  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: String}) icon = '';

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

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return html`<md-ripple .disabled="${
        this.disabled}" unbounded> </md-ripple>`;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`<button
        class="md3-icon-button"
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
        ${this.renderIcon(this.icon)}
        ${this.renderTouchTarget()}<span><slot></slot></span>
  </button>`;
  }

  /** @soyTemplate */
  protected renderIcon(icon: string): TemplateResult|string {
    // TODO(b/221096356): This method should be abstract.
    // This should be overridden by subclass to provide the appropriate
    // font icon (M3 or GM).
    return '';
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`<span class="md3-icon-button__touch"></span>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress(options: EndPressConfig) {
    this.ripple.endPress();
    super.endPress(options);
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
