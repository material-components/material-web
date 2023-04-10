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
import {when} from 'lit/directives/when.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {pointerPress, shouldShowStrongFocus} from '../../focus/strong-focus.js';
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

  @state() private showFocusRing = false;
  @state() private showRipple = false;
  @queryAsync('md-ripple') private readonly ripple!: Promise<MdRipple|null>;

  override render() {
    const classes = {
      disabled: this.disabled,
      elevated: this.elevated,
      flat: !this.elevated,
    };

    const button = this.href ? literal`a` : literal`button`;
    return staticHtml`
      <${button} class="container ${classMap(classes)}"
          ?disabled=${this.disabled}
          href=${this.href || nothing}
          target=${this.href ? this.target : nothing}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @pointerdown=${this.handlePointerDown}
          ${ripple(this.getRipple)}>
        ${this.elevated ? html`<md-elevation></md-elevation>` : nothing}
        ${when(this.showRipple, this.renderRipple)}
        <md-focus-ring .visible=${this.showFocusRing}></md-focus-ring>
        <span class="icon leading">
          <slot name="leading-icon"></slot>
        </span>
        <span class="label">${this.label}</span>
        <span class="icon trailing">
          ${this.renderTrailingIcon?.() || nothing}
        </span>
      </${button}>
    `;
  }

  // Not all chip variants have a trailing icon. We still render a wrapper
  // <span class="icon trailing"> to compute the correct padding + gap of the
  // button.
  protected renderTrailingIcon?: () => TemplateResult;

  private readonly getRipple = () => {  // bind to this
    this.showRipple = true;
    return this.ripple;
  };

  private readonly renderRipple = () => {  // bind to this
    return html`<md-ripple ?disabled=${this.disabled}></md-ripple>`;
  };

  private handleBlur() {
    this.showFocusRing = false;
  }

  private handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  private handlePointerDown() {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }
}
