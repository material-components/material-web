/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {
  dispatchActivationClick,
  isActivationClick,
} from '../../internal/controller/events.js';
import {
  FormSubmitter,
  FormSubmitterType,
  setupFormSubmitter,
} from '../../internal/controller/form-submitter.js';
import {
  internals,
  mixinElementInternals,
} from '../../labs/behaviors/element-internals.js';

// Separate variable needed for closure.
const buttonBaseClass = mixinElementInternals(LitElement);

/**
 * A button component.
 */
export abstract class Button extends buttonBaseClass implements FormSubmitter {
  static {
    requestUpdateOnAriaChange(Button);
    setupFormSubmitter(Button);
  }

  /** @nocollapse */
  static readonly formAssociated = true;

  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

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
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  /**
   * Whether to render the icon at the inline end of the label rather than the
   * inline start.
   *
   * _Note:_ Link buttons cannot have trailing icons.
   */
  @property({type: Boolean, attribute: 'trailing-icon', reflect: true})
  trailingIcon = false;

  /**
   * Whether to display the icon or not.
   */
  @property({type: Boolean, attribute: 'has-icon', reflect: true}) hasIcon =
    false;

  @property() type: FormSubmitterType = 'submit';

  @property() value = '';

  get name() {
    return this.getAttribute('name') ?? '';
  }
  set name(name: string) {
    this.setAttribute('name', name);
  }

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this[internals].form;
  }

  @query('.button') private readonly buttonElement!: HTMLElement | null;

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
    return this.href ? this.renderLink() : this.renderButton();
  }

  protected renderElevation?(): unknown;

  protected renderOutline?(): unknown;

  private renderButton() {
    // Needed for closure conformance
    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    return html`<button
      class="button"
      ?disabled=${this.disabled}
      aria-label="${ariaLabel || nothing}"
      aria-haspopup="${ariaHasPopup || nothing}"
      aria-expanded="${ariaExpanded || nothing}">
      ${this.renderContent()}
    </button>`;
  }

  private renderLink() {
    // Needed for closure conformance
    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    return html`<a
      class="button"
      aria-label="${ariaLabel || nothing}"
      aria-haspopup="${ariaHasPopup || nothing}"
      aria-expanded="${ariaExpanded || nothing}"
      href=${this.href}
      target=${this.target || nothing}
      >${this.renderContent()}
    </a>`;
  }

  private renderContent() {
    // Link buttons may not be disabled
    const isDisabled = this.disabled && !this.href;
    const icon = html`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;

    return html`
      ${this.renderElevation?.()}${this.renderOutline?.()}
      <md-focus-ring part="focus-ring"></md-focus-ring>
      <md-ripple ?disabled="${isDisabled}"></md-ripple>
      <span class="touch"></span>
      ${this.trailingIcon ? nothing : icon}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? icon : nothing}
    `;
  }

  private readonly handleActivationClick = (event: MouseEvent) => {
    if (!isActivationClick(event) || !this.buttonElement) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.buttonElement);
  };

  private handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
