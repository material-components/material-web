/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {Button} from './button.js';

// Note that we cast `linkTarget` to this type, below. The Lit compiler
// enforces the `target` attribute value to be of this type, but this is not
// compatible with the generated Wit Soy/JS, which expects `linkTarget`
// to be a string type.
type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

/** @soyCompatible */
export abstract class LinkButton extends Button {
  @property({type: String}) href!: string;

  @property({type: String}) target!: string;

  // Note: link buttons cannot have trailing icons.
  protected override getRenderClasses(): ClassInfo {
    return {
      'md3-button--icon-leading': this.hasIcon,
    };
  }

  protected override getIconContainerClasses(): ClassInfo {
    return {
      'md3-button__icon--leading': true,
    };
  }

  /**
   * @soyTemplate
   * @soyAttributes buttonAttributes: .md3-button
   */
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
          @pointerup="${this.handlePointerUp}"
          @pointercancel="${this.handlePointerCancel}"
          @pointerleave="${this.handlePointerLeave}"
          @pointerenter="${this.handlePointerEnter}"
          @click="${this.handleClick}"
          @contextmenu="${this.handleContextMenu}">
            ${this.renderFocusRing()}
            ${this.renderOverlay()}
            ${this.renderRipple()}
            ${this.renderOutline()}
            ${this.renderTouchTarget()}
            ${this.renderIcon()}
            ${this.renderLabel()}</a>
      </span>`;
  }
}
