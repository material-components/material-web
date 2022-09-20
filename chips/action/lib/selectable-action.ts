/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';

import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {PrimaryAction} from './primary-action.js';

/** @soyCompatible */
export class SelectableAction extends PrimaryAction {
  @property({type: Boolean, reflect: true}) selected = false;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <span class="${classMap(this.getRootClasses())}"
          aria-label="${ifDefined(this.ariaLabel)}"
          aria-selected="${this.selected}"
          aria-disabled="${this.disabled}"
          tabindex="${this.isFocusable ? 0 : -1}"
          role="option"
          @focus="${this.handleFocus}"
          @blur="${this.handleBlur}"
          @pointerenter="${this.handlePointerEnter}"
          @pointerleave="${this.handlePointerLeave}"
          @pointerdown="${this.handlePointerDown}"
          @pointerup="${this.handlePointerUp}"
          @pointercancel="${this.handlePointerCancel}"
          @click="${this.handleClick}"
          @contextmenu="${this.handleContextMenu}"
          @keydown="${this.handleKeyDown}">
        ${this.renderTouchTarget()}
        ${this.renderRipple()}
        ${this.renderFocusRing()}
        ${this.renderGraphic()}
        ${this.renderLabel()}
      </span>`;
  }

  /** @soyTemplate */
  protected override renderGraphic(): TemplateResult {
    return html`
      <span class="md3-chip__graphic">
        ${this.icon ? this.renderIcon() : ''}
        ${this.renderCheckMark()}
      </span>`;
  }

  /** @soyTemplate */
  private renderCheckMark(): TemplateResult {
    return html`
      <span class="md3-chip__checkmark">
        <svg class="md3-chip__checkmark-svg" viewBox="-2 -3 30 30">
          <path class="md3-chip__checkmark-path" fill="none" stroke="black"
                d="M1.73,12.91 8.1,19.28 22.79,4.59" />
        </svg>
      </span>`;
  }
}
