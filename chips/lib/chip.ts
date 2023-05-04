/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * A chip component.
 */
export abstract class Chip extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  @property({type: Boolean}) disabled = false;
  @property() label = '';

  /**
   * The `id` of the action the primary focus ring is for.
   */
  protected abstract readonly primaryFocusFor: string;

  /**
   * Whether or not the primary ripple is disabled (defaults to `disabled`).
   * Some chip actions such as links cannot be disabled.
   */
  protected get primaryRippleDisabled() {
    return this.disabled;
  }

  @state() private showPrimaryRipple = false;
  @queryAsync('md-ripple')
  private readonly primaryRipple!: Promise<MdRipple|null>;

  protected override render() {
    const primaryRipple = this.showPrimaryRipple ?
        html`<md-ripple ?disabled=${this.primaryRippleDisabled}></md-ripple>` :
        nothing;

    const primaryFocus =
        html`<md-focus-ring for=${this.primaryFocusFor}></md-focus-ring>`;

    return html`
      <div class="container ${classMap(this.getContainerClasses())}">
        ${this.renderOutline()}
        ${primaryFocus}
        ${primaryRipple}
        ${this.renderPrimaryAction()}
        ${this.renderTrailingAction()}
      </div>
    `;
  }

  protected getContainerClasses() {
    return {
      disabled: this.disabled,
    };
  }

  protected renderContent() {
    return html`
      <span class="icon">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">${this.label}</span>
    `;
  }

  protected abstract renderPrimaryAction(): TemplateResult;

  protected renderTrailingAction(): TemplateResult|typeof nothing {
    return nothing;
  }

  protected renderOutline() {
    return html`<span class="outline"></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`<slot name="icon"></slot>`;
  }

  protected getPrimaryRipple = () => {
    this.showPrimaryRipple = true;
    return this.primaryRipple;
  };
}
