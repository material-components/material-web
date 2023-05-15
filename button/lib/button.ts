/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {when} from 'lit/directives/when.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../aria/aria.js';
import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {dispatchActivationClick, isActivationClick} from '../../controller/events.js';
import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * A button component.
 */
export abstract class Button extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

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
  @property({type: Boolean, attribute: 'trailingicon'}) trailingIcon = false;

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

  @query('.md3-button') private readonly buttonElement!: HTMLElement|null;

  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;

  @state() private showRipple = false;

  @queryAssignedElements({slot: 'icon', flatten: true})
  private readonly assignedIcons!: HTMLElement[];

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

  private readonly getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  private readonly renderRipple = () => {
    return html`<md-ripple class="md3-button__ripple" ?disabled="${
        this.disabled}"></md-ripple>`;
  };

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
    if (this.preventClickDefault) {
      e.preventDefault();
    }
  }

  private handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
