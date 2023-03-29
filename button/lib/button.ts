/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// This is required for @ariaProperty
// tslint:disable:no-new-decorators

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {dispatchActivationClick, isActivationClick} from '../../controller/events.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';
import {ARIAExpanded, ARIAHasPopup} from '../../types/aria.js';

import {ButtonState} from './state.js';

/**
 * A button component.
 */
export abstract class Button extends LitElement implements ButtonState {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: String, attribute: 'data-aria-expanded', noAccessor: true})
  @ariaProperty
  override ariaExpanded!: ARIAExpanded;

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
   * The URL that the link button points to.
   */
  @property({type: String}) href?: string;

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property({type: String}) target?: string;

  /**
   * Whether to render the icon at the inline end of the label rather than the
   * inline start.
   *
   * _Note:_ Link buttons cannot have trailing icons.
   */
  @property({type: Boolean, attribute: 'trailingicon'}) trailingIcon = false;

  // TODO(b/272598771): remove label property
  /**
   * The button's visible label.
   *
   * @deprecated Set text as content of the button instead.
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
  protected assignedIcons!: HTMLElement[];

  constructor() {
    super();
    this.addEventListener('click', this.handleActivationClick);
  }

  private readonly handleActivationClick = (event: MouseEvent) => {
    if (!isActivationClick((event))) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.buttonElement);
  };

  override focus() {
    this.buttonElement.focus();
  }

  override blur() {
    this.buttonElement.blur();
  }

  protected readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  protected override render(): TemplateResult {
    // Link buttons may not be disabled
    const isDisabled = this.disabled && !this.href;

    const button = this.href ? literal`a` : literal`button`;
    return staticHtml`
      <${button}
        class="md3-button ${classMap(this.getRenderClasses())}"
        ?disabled=${isDisabled}
        aria-label="${this.ariaLabel || nothing}"
        aria-haspopup="${this.ariaHasPopup || nothing}"
        aria-expanded="${this.ariaExpanded || nothing}"
        href=${this.href || nothing}
        target=${this.target || nothing}
        @pointerdown="${this.handlePointerDown}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @click="${this.handleClick}"
        ${ripple(this.getRipple)}
      >
        ${this.renderFocusRing()}
        ${this.renderElevation()}
        ${when(this.showRipple, this.renderRipple)}
        ${this.renderOutline()}
        ${this.renderTouchTarget()}
        ${this.renderLeadingIcon()}
        ${this.renderLabel()}
        ${this.renderTrailingIcon()}
      </${button}}>`;
  }

  protected getRenderClasses(): ClassInfo {
    return {
      'md3-button--icon-leading': !this.trailingIcon && this.hasIcon,
      'md3-button--icon-trailing': this.trailingIcon && this.hasIcon,
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
    // TODO(b/272598771): remove the ternary when label property is removed
    return html`<span class="md3-button__label">${
        this.label ? this.label : html`<slot></slot>`}</span>`;
  }

  protected renderLeadingIcon(): TemplateResult|string {
    return this.trailingIcon ? '' : this.renderIcon();
  }

  protected renderTrailingIcon(): TemplateResult|string {
    return this.trailingIcon ? this.renderIcon() : '';
  }

  protected renderIcon(): TemplateResult {
    return html`<slot name="icon" @slotchange="${
        this.handleSlotChange}"></slot>`;
  }

  protected handlePointerDown(e: PointerEvent) {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
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
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
