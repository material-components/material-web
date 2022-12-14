/**
 * @requirecss {button.lib.shared_styles}
 *
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// This is required for @ariaProperty
// tslint:disable:no-new-decorators

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

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class Button extends LitElement implements ButtonState {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  protected readonly iconTag = literal`md-icon`;

  @property({type: String, attribute: 'data-aria-has-popup', noAccessor: true})
  @ariaProperty
  override ariaHasPopup!: ARIAHasPopup;

  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  @ariaProperty
  override ariaLabel!: string;

  /**
   * Whether or not the button is disabled.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Whether to render the icon at the inline end of the label rather than the
   * inline start.
   *
   * _Note:_ Link buttons cannot have trailing icons.
   */
  @property({type: Boolean, attribute: 'trailingicon'}) trailingIcon = false;

  /**
   * The label of the icon to render.
   *
   * See md-icon's documentation for usage.
   */
  @property({type: String}) icon = '';

  /**
   * The button's visible label.
   */
  @property({type: String}) label = '';

  /**
   * Whether to display the icon or not.
   */
  @property({type: Boolean}) hasIcon = false;

  /**
   * Whether `preventDefault()` should be called on the underlying button.
   * Useful for preventing certain native functionalities like preventing form
   * submissions.
   */
  @property({type: Boolean}) preventClickDefault = false;

  @query('.md3-button') protected buttonElement!: HTMLElement;

  @queryAsync('md-ripple') protected ripple!: Promise<MdRipple|null>;

  @state() protected showFocusRing = false;

  @state() protected showRipple = false;

  @queryAssignedElements({slot: 'icon', flatten: true})
  protected iconElement!: HTMLElement[]|null;

  protected readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected override render(): TemplateResult {
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
          ${ripple(this.getRipple)}>
        ${this.renderFocusRing()}
        ${this.renderElevation()}
        ${when(this.showRipple, this.renderRipple)}
        ${this.renderOutline()}
        ${this.renderTouchTarget()}
        ${this.renderLeadingIcon()}
        ${this.renderLabel()}
        ${this.renderTrailingIcon()}
      </button>`;
  }

  protected getRenderClasses(): ClassInfo {
    return {
      'md3-button--icon-leading': !this.trailingIcon && this.hasIcon,
      'md3-button--icon-trailing': this.trailingIcon && this.hasIcon,
    };
  }

  protected getIconContainerClasses(): ClassInfo {
    return {
      'md3-button__icon--leading': !this.trailingIcon,
      'md3-button__icon--trailing': this.trailingIcon,
    };
  }

  protected renderTouchTarget(): TemplateResult {
    return html`
      <span class="md3-button__touch"></span>
    `;
  }

  protected renderElevation(): TemplateResult {
    return html``;
  }

  protected renderRipple = () => {
    return html`<md-ripple class="md3-button__ripple" ?disabled="${
        this.disabled}"></md-ripple>`;
  };

  protected renderOutline(): TemplateResult {
    return html``;
  }

  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  protected renderLabel(): TemplateResult {
    return html`<span class="md3-button__label">${this.label}</span>`;
  }

  protected renderLeadingIcon(): TemplateResult|string {
    return this.trailingIcon ? '' : this.renderIcon();
  }

  protected renderTrailingIcon(): TemplateResult|string {
    return this.trailingIcon ? this.renderIcon() : '';
  }

  protected renderIcon(): TemplateResult {
    return html`<span class="md3-button__icon-slot-container ${
        classMap(this.getIconContainerClasses())}">
                  <slot name="icon" @slotchange="${this.handleSlotChange}">
                    ${this.icon ? this.renderFontIcon() : ''}
                  </slot>
                </span>`;
  }

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

  protected handlePointerDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  override click() {
    this.buttonElement.click();
  }

  protected handleClick(e: MouseEvent) {
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
