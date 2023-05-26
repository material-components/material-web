/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {requestUpdateOnAriaChange} from '../../aria/delegate.js';

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
   * The `id` of the action the primary focus ring and ripple are for.
   */
  protected abstract readonly primaryId: string;

  /**
   * Whether or not the primary ripple is disabled (defaults to `disabled`).
   * Some chip actions such as links cannot be disabled.
   */
  protected get rippleDisabled() {
    return this.disabled;
  }

  protected override render() {
    return html`
      <div class="container ${classMap(this.getContainerClasses())}">
        ${this.renderOutline()}
        <md-focus-ring for=${this.primaryId}></md-focus-ring>
        <md-ripple for=${this.primaryId}
          ?disabled=${this.rippleDisabled}></md-ripple>
        ${this.renderPrimaryAction()}
        ${this.renderTrailingAction?.() || nothing}
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
      <span class="leading icon">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">${this.label}</span>
      <span class="touch"></span>
    `;
  }

  protected abstract renderPrimaryAction(): TemplateResult;

  protected renderTrailingAction?(): TemplateResult|typeof nothing;

  protected renderOutline() {
    return html`<span class="outline"></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`<slot name="icon"></slot>`;
  }
}
