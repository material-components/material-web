/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/mwc-icon/mwc-icon';
import 'google3/third_party/javascript/material_web_components/m3/ripple/mwc-ripple';

import {AriaHasPopup, ariaProperty} from '@material/mwc-base/aria-property';
import {Ripple} from 'google3/third_party/javascript/material_web_components/m3/ripple/mwc-ripple';
import {RippleHandlers} from 'google3/third_party/javascript/material_web_components/m3/ripple/ripple-handlers';
import {eventOptions, html, LitElement, property, query, queryAssignedNodes, queryAsync, state, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import {ifDefined} from 'lit-html/directives/if-defined.js';

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

  @query('#button') buttonElement!: HTMLElement;

  @queryAsync('md-ripple') ripple!: Promise<Ripple|null>;

  @queryAssignedNodes('icon', true, '*')
  protected iconElement!: HTMLElement[]|null;

  @state() protected hasIcon = false;

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
        html`<md-ripple class="mdc-button__ripple" .disabled="${
            this.disabled}"></md-ripple>` :
        '';
  }

  /** @soyTemplate */
  protected renderOutline(): TemplateResult {
    return html``;
  }

  /**
   * @soyTemplate
   * @soyAttributes buttonAttributes: #button
   * @soyClasses buttonClasses: #button
   */
  protected override render(): TemplateResult {
    return html`
      <button
          id="button"
          class="mdc-button ${classMap(this.getRenderClasses())}"
          ?disabled="${this.disabled}"
          aria-label="${this.ariaLabel || this.label}"
          aria-haspopup="${ifDefined(this.ariaHasPopup)}"
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleActivate}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleActivate}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}">
        ${this.renderOverlay()}
        ${this.renderRipple()}
        ${this.renderOutline()}
        <span class="mdc-button__touch"></span>
        ${!this.trailingIcon ? this.renderIcon() : ''}
        <span class="mdc-button__label">${this.label}</span>
        ${this.trailingIcon ? this.renderIcon() : ''}
      </button>`;
  }

  /** @soyTemplate classMap */
  protected getRenderClasses() {
    return {
      'mdc-button--icon-leading': !this.trailingIcon && this.hasIcon,
      'mdc-button--icon-trailing': this.trailingIcon && this.hasIcon,
    };
  }

  /** @soyTemplate */
  protected renderIcon(): TemplateResult {
    const containerClasses = classMap({
      'mdc-button__icon--leading': !this.trailingIcon,
      'mdc-button__icon--trailing': this.trailingIcon,
    });
    return html`
      <span class="mdc-button__icon-slot-container ${containerClasses}">
        <slot name="icon" @slotchange="${this.handleSlotChange}">
          ${this.icon ? this.renderFontIcon() : ''}
        </slot>
     </span>
    `;
  }

  // TODO: investigate removing this
  /** @soyTemplate */
  protected renderFontIcon(): TemplateResult {
    return html`
    <mwc-icon class="mdc-button__icon">
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
