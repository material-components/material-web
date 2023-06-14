/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

/**
 * A chip component.
 */
export abstract class Chip extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

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

  /**
   * The aria role of the container. Defaults to `row` for grid chip sets.
   * Listbox chip sets should remove this since they do not contain cells.
   */
  @state() protected containerRole?: 'row' = 'row';

  protected override render() {
    return html`
      <div class="container ${classMap(this.getContainerClasses())}"
          role=${this.containerRole || nothing}>
        ${this.renderOutline()}
        <md-focus-ring for=${this.primaryId}></md-focus-ring>
        <md-ripple for=${this.primaryId}
          ?disabled=${this.rippleDisabled}></md-ripple>
        ${this.renderActions()}
      </div>
    `;
  }

  protected getContainerClasses() {
    return {
      disabled: this.disabled,
    };
  }

  protected renderActions() {
    return this.renderActionCell(this.renderAction());
  }

  protected renderActionCell(content: TemplateResult|
                             typeof nothing): TemplateResult|typeof nothing {
    if (content === nothing) {
      return content;
    }

    return html`<div class="cell" role="cell">${content}</div>`;
  }

  protected abstract renderAction(): TemplateResult;

  protected renderContent() {
    return html`
      <span class="leading icon" aria-hidden="true">
        ${this.renderLeadingIcon()}
      </span>
      <span class="label">${this.label}</span>
      <span class="touch"></span>
    `;
  }

  protected renderOutline() {
    return html`<span class="outline"></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`<slot name="icon"></slot>`;
  }
}
