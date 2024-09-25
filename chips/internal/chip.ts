/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {mixinDelegatesAria} from '../../internal/aria/delegate.js';

// Separate variable needed for closure.
const chipBaseClass = mixinDelegatesAria(LitElement);

/**
 * A chip component.
 *
 * @fires update-focus {Event} Dispatched when `disabled` is toggled. --bubbles
 */
export abstract class Chip extends chipBaseClass {
  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Whether or not the chip is disabled.
   *
   * Disabled chips are not focusable, unless `always-focusable` is set.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Whether or not the chip is "soft-disabled" (disabled but still
   * focusable).
   *
   * Use this when a chip needs increased visibility when disabled. See
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls
   * for more guidance on when this is needed.
   */
  @property({type: Boolean, attribute: 'soft-disabled', reflect: true})
  softDisabled = false;

  /**
   * When true, allow disabled chips to be focused with arrow keys.
   *
   * Add this when a chip needs increased visibility when disabled. See
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls
   * for more guidance on when this is needed.
   *
   * @deprecated Use `softDisabled` instead of `alwaysFocusable` + `disabled`.
   */
  @property({type: Boolean, attribute: 'always-focusable'})
  alwaysFocusable = false;

  // TODO(b/350810013): remove the label property.
  /**
   * The label of the chip.
   *
   * @deprecated Set text as content of the chip instead.
   */
  @property() label = '';

  /**
   * Only needed for SSR.
   *
   * Add this attribute when a chip has a `slot="icon"` to avoid a Flash Of
   * Unstyled Content.
   */
  @property({type: Boolean, reflect: true, attribute: 'has-icon'}) hasIcon =
    false;

  /**
   * The `id` of the action the primary focus ring and ripple are for.
   * TODO(b/310046938): use the same id for both elements
   */
  protected abstract readonly primaryId: string;

  /**
   * Whether or not the primary ripple is disabled (defaults to `disabled`).
   * Some chip actions such as links cannot be disabled.
   */
  protected get rippleDisabled() {
    return this.disabled || this.softDisabled;
  }

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', this.handleClick.bind(this));
    }
  }

  override focus(options?: FocusOptions) {
    if (this.disabled && !this.alwaysFocusable) {
      return;
    }

    super.focus(options);
  }

  protected override render() {
    return html`
      <div class="container ${classMap(this.getContainerClasses())}">
        ${this.renderContainerContent()}
      </div>
    `;
  }

  protected override updated(changed: PropertyValues<Chip>) {
    if (changed.has('disabled') && changed.get('disabled') !== undefined) {
      this.dispatchEvent(new Event('update-focus', {bubbles: true}));
    }
  }

  protected getContainerClasses(): ClassInfo {
    return {
      'disabled': this.disabled || this.softDisabled,
      'has-icon': this.hasIcon,
    };
  }

  protected renderContainerContent() {
    return html`
      ${this.renderOutline()}
      <md-focus-ring part="focus-ring" for=${this.primaryId}></md-focus-ring>
      <md-ripple
        for=${this.primaryId}
        ?disabled=${this.rippleDisabled}></md-ripple>
      ${this.renderPrimaryAction(this.renderPrimaryContent())}
    `;
  }

  protected renderOutline() {
    return html`<span class="outline"></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`<slot name="icon" @slotchange=${this.handleIconChange}></slot>`;
  }

  protected abstract renderPrimaryAction(content: unknown): unknown;

  private renderPrimaryContent() {
    return html`
      <span class="leading icon" aria-hidden="true">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">
        <span class="label-text" id="label">
          ${this.label ? this.label : html`<slot></slot>`}
        </span>
      </span>
      <span class="touch"></span>
    `;
  }

  private handleIconChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedElements({flatten: true}).length > 0;
  }

  private handleClick(event: Event) {
    // If the chip is soft-disabled or disabled + always-focusable, we need to
    // explicitly prevent the click from propagating to other event listeners
    // as well as prevent the default action.
    if (this.softDisabled || (this.disabled && this.alwaysFocusable)) {
      event.stopImmediatePropagation();
      event.preventDefault();
      return;
    }
  }
}
