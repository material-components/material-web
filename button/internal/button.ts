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
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';
import {
  FormSubmitter,
  setupFormSubmitter,
  type FormSubmitterType,
} from '../../internal/controller/form-submitter.js';
import {
  dispatchActivationClick,
  isActivationClick,
} from '../../internal/events/form-label-activation.js';
import {
  internals,
  mixinElementInternals,
} from '../../labs/behaviors/element-internals.js';

// Separate variable needed for closure.
const buttonBaseClass = mixinDelegatesAria(mixinElementInternals(LitElement));

/**
 * A button component.
 */
export abstract class Button extends buttonBaseClass implements FormSubmitter {
  static {
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
   * Whether or not the button is "soft-disabled" (disabled but still
   * focusable).
   *
   * Use this when a button needs increased visibility when disabled. See
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls
   * for more guidance on when this is needed.
   */
  @property({type: Boolean, attribute: 'soft-disabled', reflect: true})
  softDisabled = false;

  /**
   * The URL that the link button points to.
   */
  @property() href = '';

  /**
   * The filename to use when downloading the linked resource.
   * If not specified, the browser will determine a filename.
   * This is only applicable when the button is used as a link (`href` is set).
   */
  @property() download = '';

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

  /**
   * The default behavior of the button. May be "button", "reset", or "submit"
   * (default).
   */
  @property() type: FormSubmitterType = 'submit';

  /**
   * The value added to a form with the button's name when the button submits a
   * form.
   */
  @property({reflect: true}) value = '';

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
      this.addEventListener('click', this.handleClick.bind(this));
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
    const isRippleDisabled = !this.href && (this.disabled || this.softDisabled);
    const buttonOrLink = this.href ? this.renderLink() : this.renderButton();
    // TODO(b/310046938): due to a limitation in focus ring/ripple, we can't use
    // the same ID for different elements, so we change the ID instead.
    const buttonId = this.href ? 'link' : 'button';
    return html`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${buttonId}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${buttonId}
        ?disabled="${isRippleDisabled}"></md-ripple>
      ${buttonOrLink}
    `;
  }

  // Buttons can override this to add elevation or an outline. Use this and
  // return `<md-elevation>` (for elevated, filled, and tonal buttons)
  // or `<div class="outline">` (for outlined buttons).
  // Text buttons that have neither do not need to implement this.
  protected renderElevationOrOutline?(): unknown;

  private renderButton() {
    // Needed for closure conformance
    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    return html`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || nothing}
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
      id="link"
      class="button"
      aria-label="${ariaLabel || nothing}"
      aria-haspopup="${ariaHasPopup || nothing}"
      aria-expanded="${ariaExpanded || nothing}"
      href=${this.href}
      download=${this.download || nothing}
      target=${this.target || nothing}
      >${this.renderContent()}
    </a>`;
  }

  private renderContent() {
    const icon = html`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;

    return html`
      <span class="touch"></span>
      ${this.trailingIcon ? nothing : icon}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? icon : nothing}
    `;
  }

  private handleClick(event: MouseEvent) {
    // If the button is soft-disabled, we need to explicitly prevent the click
    // from propagating to other event listeners as well as prevent the default
    // action.
    if (!this.href && this.softDisabled) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return;
    }

    if (!isActivationClick(event) || !this.buttonElement) {
      return;
    }
    this.focus();
    dispatchActivationClick(this.buttonElement);
  }

  private handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
