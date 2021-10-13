/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/mwc-icon/mwc-icon';
import '../../ripple/mwc-ripple';

import {AriaHasPopup, ariaProperty} from '@material/mwc-base/aria-property';
import {html, LitElement, TemplateResult} from 'lit';
import {eventOptions, property, query, queryAssignedNodes, queryAsync, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {Ripple} from '../../ripple/mwc-ripple';
import {RippleHandlers} from '../../ripple/ripple-handlers';

/** @soyCompatible */
export abstract class Button extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /** @soyPrefixAttribute */
  @ariaProperty
  @property({type: String, attribute: 'aria-haspopup'})
  ariaHasPopup!: AriaHasPopup;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean, attribute: 'trailingicon'}) trailingIcon = false;

  @property({type: String}) icon = '';

  @property({type: String}) label = '';

  @property({type: String}) ariaLabel = '';

  @property({type: Boolean}) hasIcon = false;

  @query('.md3-button') buttonElement!: HTMLElement;

  @queryAsync('md-ripple') ripple!: Promise<Ripple|null>;

  @queryAssignedNodes('icon', true, '*')
  protected iconElement!: HTMLElement[]|null;

  @state() protected shouldRenderRipple = false;

  protected rippleHandlers = new RippleHandlers(() => {
    this.shouldRenderRipple = true;
    return this.ripple;
  });

  /** @soyTemplate */
  protected renderOverlay(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult|string {
    return this.shouldRenderRipple ?
        html`<md-ripple class="md3-button__ripple" .disabled="${
            this.disabled}"></md-ripple>` :
        '';
  }

  /** @soyTemplate */
  protected renderOutline(): TemplateResult {
    return html``;
  }

  /**
   * @soyTemplate
   * @soyAttributes buttonAttributes: .md3-button
   * @soyClasses buttonClasses: .md3-button
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
        -->${this.renderOverlay()}<!--
        -->${this.renderRipple()}<!--
        -->${this.renderOutline()}<!--
        -->${this.renderTouchTarget()}<!--
        -->${
    // TODO(b/191914389): move to separate template
    !this.trailingIcon ? html`<span class="md3-button__icon-slot-container ${
                             classMap(this.getIconContainerClasses())}">
                               <slot name="icon" @slotchange="${
                             this.handleSlotChange}">
                                  ${this.icon ? this.renderFontIcon() : ''}
                               </slot>
                              </span>` :
                         ''}<!--
        -->${this.renderLabel()}<!--
        -->${
        this.trailingIcon ?
        html`<span class="md3-button__icon-slot-container ${
            classMap(this.getIconContainerClasses())}">
               <slot name="icon" @slotchange="${this.handleSlotChange}">
                 ${
            this.icon ?
            this.renderFontIcon() :
            ''}
               </slot>
             </span>` :
        ''}<!--
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
  protected renderLabel(): TemplateResult {
    return html`
      <span class="md3-button__label">${this.label}</span>
    `;
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

  override focus() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.startFocus();
      buttonElement.focus();
    }
  }

  override blur() {
    const buttonElement = this.buttonElement;
    if (buttonElement) {
      this.rippleHandlers.endFocus();
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
    this.rippleHandlers.startPress(evt);
  }

  protected handleRippleDeactivate() {
    this.rippleHandlers.endPress();
  }

  protected handleRippleMouseEnter() {
    this.rippleHandlers.startHover();
  }

  protected handleRippleMouseLeave() {
    this.rippleHandlers.endHover();
  }

  protected handleRippleFocus() {
    this.rippleHandlers.startFocus();
  }

  protected handleRippleBlur() {
    this.rippleHandlers.endFocus();
  }

  protected handleSlotChange() {
    this.requestUpdate();
  }
}
