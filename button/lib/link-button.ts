/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';

import {ripple} from '../../ripple/directive.js';

import {Button} from './button.js';

/**
 * Note that we cast `linkTarget` to this type, below. The Lit compiler
 * enforces the `target` attribute value to be of this type, but this is not
 * compatible with the generated Wit Soy/JS, which expects `linkTarget`
 * to be a string type.
 */
type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class LinkButton extends Button {
  /**
   * Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
   */
  @property({type: String}) href!: string;

  /**
   * Sets the underlying `HTMLAnchorElement`'s `target` attribute.
   */
  @property({type: String}) target!: string;

  /**
   * Link buttons cannot be disabled.
   */
  override disabled = false;

  // Note: link buttons cannot have trailing icons.
  protected override getRenderClasses(): ClassInfo {
    return {
      'md3-button--icon-leading': this.hasIcon,
    };
  }

  protected override render(): TemplateResult {
    return html`
      <span class="md3-link-button-wrapper">
        <a class="md3-button ${classMap(this.getRenderClasses())}"
          href="${ifDefined(this.href)}"
          target="${ifDefined(this.target as LinkTarget)}"
          aria-label="${ifDefined(this.ariaLabel)}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerdown="${this.handlePointerDown}"
          @click="${this.handleClick}"
          ${ripple(this.getRipple)}>
            ${this.renderFocusRing()}
            ${this.renderElevation()}
            ${when(this.showRipple, this.renderRipple)}
            ${this.renderOutline()}
            ${this.renderTouchTarget()}
            ${this.renderIcon()}
            ${this.renderLabel()}</a>
      </span>`;
  }
}
