/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

/**
 * A chip component.
 *
 * @fires update-focus {Event} Dispatched when `disabled` is toggled. --bubbles
 */
export abstract class Chip extends LitElement {
  static {
    requestUpdateOnAriaChange(Chip);
  }

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
   * When true, allow disabled chips to be focused with arrow keys.
   *
   * Add this when a chip needs increased visibility when disabled. See
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls
   * for more guidance on when this is needed.
   */
  @property({type: Boolean, attribute: 'always-focusable'})
  alwaysFocusable = false;

  /**
   * The label of the chip.
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
    return this.disabled;
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
      'disabled': this.disabled,
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
      <span class="label">${this.label}</span>
      <span class="touch"></span>
    `;
  }

  private handleIconChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedElements({flatten: true}).length > 0;
  }
}
