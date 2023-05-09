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
  protected abstract readonly focusFor: string;

  /**
   * Whether or not the primary ripple is disabled (defaults to `disabled`).
   * Some chip actions such as links cannot be disabled.
   */
  protected get rippleDisabled() {
    return this.disabled;
  }

  @state() private showRipple = false;
  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;

  protected override render() {
    const ripple = this.showRipple ?
        html`<md-ripple ?disabled=${this.rippleDisabled}></md-ripple>` :
        nothing;

    return html`
      <div class="container ${classMap(this.getContainerClasses())}">
        ${this.renderOutline()}
        <md-focus-ring for=${this.focusFor}></md-focus-ring>
        ${ripple}
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

  protected getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };
}
