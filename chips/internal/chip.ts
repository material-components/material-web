/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

/**
 * A chip component.
 */
export abstract class Chip extends LitElement {
  static {
    requestUpdateOnAriaChange(Chip);
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

  protected override render() {
    return this.renderContainer(this.renderContainerContent());
  }

  protected abstract renderContainer(content: unknown): unknown;

  protected getContainerClasses() {
    return {
      disabled: this.disabled,
    };
  }

  protected renderContainerContent() {
    // Note: add aria-hidden="true" to focus ring and ripple. For some reason
    // they cause VoiceOver to get stuck inside filter chip sets without it.
    // TODO(b/297428579): investigate and file VoiceOver bug
    return html`
      ${this.renderOutline()}
      <md-focus-ring part="focus-ring" for=${this.primaryId}
        aria-hidden="true"></md-focus-ring>
      <md-ripple for=${this.primaryId} ?disabled=${this.rippleDisabled}
        aria-hidden="true"></md-ripple>
      ${this.renderPrimaryAction(this.renderPrimaryContent())}
    `;
  }

  protected renderOutline() {
    return html`<span class="outline"></span>`;
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`<slot name="icon"></slot>`;
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
}

/**
 * Renders a chip container that follows the grid/row/cell a11y pattern.
 *
 * This renders the container with `role="row"`.
 */
export function renderGridContainer(content: unknown, classes: ClassInfo) {
  return html`
    <div class="container ${classMap(classes)}" role="row">${content}</div>
  `;
}

/**
 * Renders a chip action that follows the grid/row/cell a11y pattern.
 *
 * This wraps actions in a `role="cell"` div.
 */
export function renderGridAction(content: unknown) {
  if (content === nothing) {
    return content;
  }

  return html`<div class="cell" role="cell">${content}</div>`;
}
