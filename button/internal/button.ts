/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {internals} from '../../internal/controller/element-internals.js';
import {dispatchActivationClick, isActivationClick} from '../../internal/controller/events.js';
import {FormSubmitter, FormSubmitterType, setupFormSubmitter} from '../../internal/controller/form-submitter.js';

/**
 * A button component.
 */
export abstract class Button extends LitElement implements FormSubmitter {
  static {
    requestUpdateOnAriaChange(Button);
    setupFormSubmitter(Button);
  }

  /** @nocollapse */
  static get formAssociated() {
    return true;
  }

  /** @nocollapse */
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /**
   * Whether or not the button is disabled.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * The URL that the link button points to.
   */
  @property() href = '';

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property() target: '_blank'|'_parent'|'_self'|'_top'|'' = '';

  /**
   * Whether to render the icon at the inline end of the label rather than the
   * inline start.
   *
   * _Note:_ Link buttons cannot have trailing icons.
   */
  @property({type: Boolean, attribute: 'trailing-icon'}) trailingIcon = false;

  /**
   * Whether to display the icon or not.
   */
  @property({type: Boolean, attribute: 'has-icon'}) hasIcon = false;

  @property() type: FormSubmitterType = 'submit';

  @query('.button') private readonly buttonElement!: HTMLElement|null;

  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly assignedIcons!: HTMLElement[];

  /** @private */
  [internals] =
      (this as HTMLElement /* needed for closure */).attachInternals();

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', this.handleActivationClick);
    }
  }

  override focus() {
    this.buttonElement?.focus();
  }

  override blur() {
    this.buttonElement?.blur();
  }

  protected override render() {
    // Link buttons may not be disabled
    const isDisabled = this.disabled && !this.href;

    const button = this.href ? literal`a` : literal`button`;
    // Needed for closure conformance
    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    return staticHtml`
      <${button}
        class="button ${classMap(this.getRenderClasses())}"
        ?disabled=${isDisabled}
        aria-label="${ariaLabel || nothing}"
        aria-haspopup="${ariaHasPopup || nothing}"
        aria-expanded="${ariaExpanded || nothing}"
        href=${this.href || nothing}
        target=${this.target || nothing}
      >
        ${this.renderFocusRing()}
        ${this.renderElevation()}
        ${this.renderRipple()}
        ${this.renderOutline()}
        ${this.renderTouchTarget()}
        ${this.renderLeadingIcon()}
        ${this.renderLabel()}
        ${this.renderTrailingIcon()}
      </${button}>`;
  }

  protected getRenderClasses() {
    return {
      'button--icon-leading': !this.trailingIcon && this.hasIcon,
      'button--icon-trailing': this.trailingIcon && this.hasIcon,
    };
  }

  protected renderElevation(): TemplateResult|typeof nothing {
    return nothing;
  }

  protected renderOutline(): TemplateResult|typeof nothing {
    return nothing;
  }

  private renderTouchTarget() {
    return html`<span class="touch"></span>`;
  }

  private readonly handleActivationClick = (event: MouseEvent) => {
    if (!isActivationClick((event)) || !this.buttonElement) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.buttonElement);
  };

  private renderRipple() {
    return html`<md-ripple class="button__ripple" ?disabled="${
        this.disabled}"></md-ripple>`;
  }

  private renderFocusRing() {
    return html`<md-focus-ring part="focus-ring"></md-focus-ring>`;
  }

  private renderLabel() {
    return html`<span class="button__label"><slot></slot></span>`;
  }

  private renderLeadingIcon() {
    return this.trailingIcon ? nothing : this.renderIcon();
  }

  private renderTrailingIcon() {
    return this.trailingIcon ? this.renderIcon() : nothing;
  }

  private renderIcon() {
    return html`<slot name="icon" @slotchange="${
        this.handleSlotChange}"></slot>`;
  }

  private handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
