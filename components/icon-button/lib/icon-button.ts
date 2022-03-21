/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../action-element/action-element';
import {ariaProperty} from '../../decorators/aria-property';
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

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return html`<md-ripple .disabled="${
        this.disabled}" unbounded> </md-ripple>`;
  }

  override focus() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.ripple.beginFocus();
      buttonElement.focus();
    }
  }

  override blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.ripple.endFocus();
      buttonElement.blur();
    }
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
        @contextmenu="${this.handleContextMenu}"
    >${this.renderRipple()}
    ${this.renderIcon(this.icon)}${
        this.renderTouchTarget()}<span><slot></slot></span>
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

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress(options: EndPressConfig) {
    this.ripple.endPress();
    super.endPress(options);
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);
    this.ripple.endHover();
  }

  protected handleFocus() {
    this.ripple.beginFocus();
  }

  protected handleBlur() {
    this.ripple.endFocus();
  }
}
