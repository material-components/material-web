/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {dispatchActivationClick, isActivationClick, redispatchEvent} from '../../internal/controller/events.js';

/**
 * A button component.
 */
export abstract class Button extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
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
  @property() href?: string;

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property() target?: string;

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

  /**
   * Specifies the type of button, used for controlling forms. When type
   * is `submit`, the containing form is submitted; when it is `reset` the
   * form is reset.
   */
  @property() type: ''|'submit'|'reset' = '';

  @query('.md3-button') private readonly buttonElement!: HTMLElement|null;

  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly assignedIcons!: HTMLElement[];

  private readonly internals =
      (this as HTMLElement /* needed for closure */).attachInternals();

  // flag to avoid processing redispatched event.
  private isRedispatchingEvent = false;

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
        class="md3-button ${classMap(this.getRenderClasses())}"
        ?disabled=${isDisabled}
        aria-label="${ariaLabel || nothing}"
        aria-haspopup="${ariaHasPopup || nothing}"
        aria-expanded="${ariaExpanded || nothing}"
        href=${this.href || nothing}
        target=${this.target || nothing}
        @click="${this.handleClick}"
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
      'md3-button--icon-leading': !this.trailingIcon && this.hasIcon,
      'md3-button--icon-trailing': this.trailingIcon && this.hasIcon,
    };
  }

  protected renderElevation(): TemplateResult|typeof nothing {
    return nothing;
  }

  protected renderOutline(): TemplateResult|typeof nothing {
    return nothing;
  }

  private renderTouchTarget() {
    return html`
      <span class="md3-button__touch"></span>
    `;
  }

  private readonly handleActivationClick = (event: MouseEvent) => {
    if (!isActivationClick((event)) || !this.buttonElement) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.buttonElement);
  };

  private renderRipple() {
    return html`<md-ripple class="md3-button__ripple" ?disabled="${
        this.disabled}"></md-ripple>`;
  }

  private renderFocusRing() {
    return html`<md-focus-ring></md-focus-ring>`;
  }

  private renderLabel() {
    return html`<span class="md3-button__label"><slot></slot></span>`;
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

  private handleClick(e: MouseEvent) {
    if (this.isRedispatchingEvent) {
      return;
    }
    // based on type, trigger form action.
    const {type, internals: {form}} = this;
    if (!form) {
      return;
    }
    const isSubmit = type === 'submit', isReset = type === 'reset';
    if (!(isSubmit || isReset)) {
      return;
    }
    e.stopPropagation();
    this.isRedispatchingEvent = true;
    const prevented = !redispatchEvent(this, e);
    this.isRedispatchingEvent = false;
    if (prevented) {
      return;
    }
    if (isSubmit) {
      form.requestSubmit();
    } else if (isReset) {
      form.reset();
    }
  }

  private handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
