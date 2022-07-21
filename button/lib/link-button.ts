/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

import {Button} from './button';

type LinkTarget = '_blank'|'_parent'|'_self'|'_top';

/** @soyCompatible */
export abstract class LinkButton extends Button {
  @property({type: String}) href!: string;

  @property({type: String}) target!: string;

  /**
   * @soyTemplate
   * @soyAttributes buttonAttributes: .md3-button
   */
  protected override render(): TemplateResult {
    return html`
      <span class="md3-link-button-wrapper"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerdown="${this.handlePointerDown}"
          @pointerup="${this.handlePointerUp}"
          @pointercancel="${this.handlePointerCancel}"
          @pointerleave="${this.handlePointerLeave}"
          @pointerenter="${this.handlePointerEnter}"
          @click="${this.handleClick}"
          @contextmenu="${this.handleContextMenu}">
        <a class="md3-button ${classMap(this.getRenderClasses())}"
          href="${ifDefined(this.href)}"
          target="${ifDefined(this.target as LinkTarget)}"
          aria-label="${ifDefined(this.ariaLabel)}">
            ${this.renderFocusRing()}
            ${this.renderOverlay()}
            ${this.renderRipple()}
            ${this.renderOutline()}
            ${this.renderTouchTarget()}
            ${this.renderIcon()}
            ${this.renderLabel()}</a>
      </span>`;
    // Note: link buttons cannot have trailing icons.
  }
}
