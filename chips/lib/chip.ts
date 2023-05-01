/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, queryAsync, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ripple} from '../../ripple/directive.js';
import {MdRipple} from '../../ripple/ripple.js';

/**
 * A chip component.
 */
export class Chip extends LitElement {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) elevated = false;
  @property() href = '';
  @property() label = '';
  @property() target = '';

  @state() private showRipple = false;
  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;

  protected override render() {
    const button = this.href ? literal`a` : literal`button`;
    return staticHtml`
      <${button} class="container ${classMap(this.getContainerClasses())}"
          ?disabled=${this.disabled}
          href=${this.href || nothing}
          target=${this.href ? this.target : nothing}
          ${ripple(this.getRipple)}>
        ${!this.elevated ? html`<span class="outline"></span>` : nothing}
        ${this.elevated ? html`<md-elevation></md-elevation>` : nothing}
        ${this.showRipple ? this.renderRipple() : nothing}
        <md-focus-ring></md-focus-ring>
        <span class="icon leading">
          ${this.renderLeadingIcon()}
        </span>
        <span class="label">${this.label}</span>
        <span class="icon trailing">
          ${this.renderTrailingIcon()}
        </span>
      </${button}>
    `;
  }

  protected getContainerClasses() {
    return {
      disabled: this.disabled,
      elevated: this.elevated,
    };
  }

  protected renderLeadingIcon(): TemplateResult {
    return html`<slot name="leading-icon"></slot>`;
  }

  protected renderTrailingIcon(): TemplateResult|typeof nothing {
    return nothing;
  }

  private renderRipple() {
    return html`<md-ripple ?disabled=${this.disabled}></md-ripple>`;
  }

  private readonly getRipple = () => {  // bind to this
    this.showRipple = true;
    return this.ripple;
  };
}
