/**
 * @requirecss {button.lib.shared_styles}
 *
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../icon/icon.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';
import {ARIAHasPopup} from '../../types/aria.js';

import {ButtonState} from './state.js';

/** @soyCompatible */
export abstract class Button extends LitElement implements ButtonState {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  protected readonly iconTag = literal`md-icon`;

  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-has-popup', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  override ariaHasPopup!: ARIAHasPopup;

  @property({type: Boolean, reflect: true}) disabled = false;

  @property({type: Boolean, attribute: 'trailingicon'}) trailingIcon = false;

  @property({type: String}) icon = '';

  @property({type: String}) label = '';

  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;

  @property({type: Boolean}) hasIcon = false;

  @property({type: Boolean}) preventClickDefault = false;

  @query('.md3-button') buttonElement!: HTMLElement;

  @queryAsync('md-ripple') ripple!: Promise<MdRipple|null>;

  @state() protected showFocusRing = false;

  @state() protected showRipple = false;

  @queryAssignedElements({slot: 'icon', flatten: true})
  protected iconElement!: HTMLElement[]|null;

  /**
   * @soyTemplate
   * @soyAttributes buttonAttributes: .md3-button
   */
  protected override render(): TemplateResult {
    const getRipple = () => {
      this.showRipple = true;
      return this.ripple;
    };
    // TODO(b/237283903): Replace ifDefined(... || undefined) with ifTruthy(...)
    return html`
      <button
          class="md3-button ${classMap(this.getRenderClasses())}"
          ?disabled="${this.disabled}"
          aria-label="${ifDefined(this.ariaLabel || undefined)}"
          aria-haspopup="${ifDefined(this.ariaHasPopup || undefined)}"
          @pointerdown="${this.handlePointerDown}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @click="${this.handleClick}"
          ${ripple(getRipple)}>
        ${this.renderFocusRing()}
        ${this.renderOverlay()}
        ${when(this.showRipple, () => this.renderRipple())}
        ${this.renderOutline()}
        ${this.renderTouchTarget()}
        ${this.renderLeadingIcon()}
        ${this.renderLabel()}
        ${this.renderTrailingIcon()}
      </button>`;
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
  protected renderRipple(): TemplateResult {
    return html`<md-ripple class="md3-button__ripple" ?disabled="${
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
    return html`<span class="md3-button__icon-slot-container ${
        classMap(this.getIconContainerClasses())}">
                  <slot name="icon" @slotchange="${this.handleSlotChange}">
                    ${this.icon ? this.renderFontIcon() : ''}
                  </slot>
                </span>`;
  }

  /** @soyTemplate */
  protected renderFontIcon(): TemplateResult {
    return staticHtml`
    <${this.iconTag} class="md3-button__icon">
      ${this.icon}
    </${this.iconTag}>`;
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

  handlePointerDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  /** Delegate clicks on host element to inner button element. */
  override click() {
    this.buttonElement.click();
  }

  handleClick(e: MouseEvent) {
    if (this.preventClickDefault) {
      e.preventDefault();
    }
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }

  protected handleSlotChange() {
    this.requestUpdate();
  }
}
