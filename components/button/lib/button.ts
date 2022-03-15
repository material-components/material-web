/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/mwc-icon/mwc-icon';
import '../../focus/focus-ring';
import '../../ripple/ripple';

import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property, query, queryAssignedElements, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {ariaProperty} from '../../decorators/aria-property';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus';
import {MdRipple} from '../../ripple/ripple';
import {ARIAHasPopup} from '../../types/aria';

import {ButtonState} from './state';

/** @soyCompatible */
export abstract class Button extends LitElement implements ButtonState {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-has-popup', noAccessor: true})
  @ariaProperty
  override ariaHasPopup!: ARIAHasPopup;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean, attribute: 'trailingicon'}) trailingIcon = false;

  @property({type: String}) icon = '';

  @property({type: String}) label = '';

  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  @ariaProperty
  override ariaLabel!: string;

  @property({type: Boolean}) hasIcon = false;

  @query('.md3-button') buttonElement!: HTMLElement;

  @query('md-ripple') ripple!: MdRipple;

  @state() protected showFocusRing = false;

  @queryAssignedElements({slot: 'icon', flatten: true})
  protected iconElement!: HTMLElement[]|null;

  /**
   * @soyTemplate
   * @soyAttributes buttonAttributes: .md3-button
   */
  protected override render(): TemplateResult {
    // TODO(b/182405623): restore whitespace
    return html`
      <button
          class="md3-button ${classMap(this.getRenderClasses())}"
          ?disabled="${this.disabled}"
          aria-label="${ifDefined(this.ariaLabel)}"
          aria-haspopup="${ifDefined(this.ariaHasPopup)}"
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleActivate}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleActivate}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}"><!--
        -->${this.renderFocusRing()}<!--
        -->${this.renderOverlay()}<!--
        -->${this.renderRipple()}<!--
        -->${this.renderOutline()}<!--
        -->${this.renderTouchTarget()}<!--
        -->${this.renderLeadingIcon()}<!--
        -->${this.renderLabel()}<!--
        -->${this.renderTrailingIcon()}<!--
      --></button>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-button--icon-leading': !this.trailingIcon && this.hasIcon,
      'md3-button--icon-trailing': this.trailingIcon && this.hasIcon,
    };
  }

  /** @soyTemplate */
  protected getIconContainerClasses(): ClassInfo {
    return {
      'md3-button__icon--leading': !this.trailingIcon,
      'md3-button__icon--trailing': this.trailingIcon,
    };
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return html`
      <span class="md3-button__touch"></span>
    `;
  }

  /** @soyTemplate */
  protected renderOverlay(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return html`<md-ripple class="md3-button__ripple" .disabled="${
        this.disabled}"></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderOutline(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  /** @soyTemplate */
  protected renderLabel(): TemplateResult {
    return html`<span class="md3-button__label">${this.label}</span>`;
  }

  /** @soyTemplate */
  protected renderLeadingIcon(): TemplateResult|string {
    return this.trailingIcon ? '' : this.renderIcon();
  }

  /** @soyTemplate */
  protected renderTrailingIcon(): TemplateResult|string {
    return this.trailingIcon ? this.renderIcon() : '';
  }

  /** @soyTemplate */
  protected renderIcon(): TemplateResult {
    // TODO(b/182405623): restore whitespace
    return html`<span class="md3-button__icon-slot-container ${
        classMap(this.getIconContainerClasses())}"><!--
               --><slot name="icon" @slotchange="${this.handleSlotChange}"><!--
                 -->${this.icon ? this.renderFontIcon() : ''}<!--
               --></slot><!--
             --></span>`;
  }

  // TODO: investigate removing this
  /** @soyTemplate */
  protected renderFontIcon(): TemplateResult {
    return html`
    <mwc-icon class="md3-button__icon">
      ${this.icon}
    </mwc-icon>`;
  }

  override update(changedProperties: Map<string, string>) {
    super.update(changedProperties);
    this.hasIcon = !!this.iconElement && this.iconElement.length > 0;
  }

  // TODO(b/210731759): remove once internal tooling delegates focus
  override focus() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      buttonElement.focus();
    }
  }

  // TODO(b/210731759): remove once internal tooling delegates focus
  override blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      buttonElement.blur();
    }
  }

  @eventOptions({passive: true})
  protected handleRippleActivate(evt?: Event) {
    const onUp = () => {
      window.removeEventListener('mouseup', onUp);

      this.handleRippleDeactivate();
    };

    window.addEventListener('mouseup', onUp);
    this.ripple.beginPress(evt);
    pointerPress();
  }

  protected handleRippleDeactivate() {
    this.ripple.endPress();
  }

  protected handleRippleMouseEnter() {
    this.ripple.beginHover();
  }

  protected handleRippleMouseLeave() {
    this.ripple.endHover();
  }

  protected handleRippleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleRippleBlur() {
    this.showFocusRing = false;
  }

  protected handleSlotChange() {
    this.requestUpdate();
  }
}
