/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {when} from 'lit/directives/when.js';

import {ripple} from '../../ripple/directive.js';

import {IconButton} from './icon-button.js';

/**
 * Note that we cast `linkTarget` to this type, below. The Lit compiler
 * enforces the `target` attribute value to be of this type, but this is not
 * compatible with the generated Wit Soy/JS, which expects `linkTarget`
 * to be a string type.
 */
type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class LinkIconButton extends IconButton {
  /**
   * Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
   */
  @property({type: String}) linkHref = '';

  /**
   * Sets the underlying `HTMLAnchorElement`'s `target` attribute.
   */
  @property({type: String}) linkTarget!: string;

  /**
   * Link buttons cannot be disabled.
   */
  override disabled = false;

  override willUpdate() {
    this.disabled = false;
  }

  protected override render(): TemplateResult {
    return html`<div
        class="md3-icon-button ${classMap(this.getRenderClasses())}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @pointerdown="${this.handlePointerDown}"
        ${ripple(this.getRipple)}>
        ${this.renderFocusRing()}
        ${when(this.showRipple, this.renderRipple)}
        ${this.renderIcon()}
        ${this.renderTouchTarget()}
      <a class="md3-icon-button__link" href="${this.linkHref}"
          target="${ifDefined(this.linkTarget as LinkTarget)}"
          aria-label="${ifDefined(this.ariaLabel)}"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}">
      </a>
    </div>`;
  }
}
