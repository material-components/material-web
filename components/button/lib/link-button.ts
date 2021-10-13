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
  @property({type: String}) href = '';

  @property({type: String}) target = '';

  /**
   * @soyTemplate
   * @soyAttributes buttonAttributes: .md3-button
   * @soyClasses buttonClasses: .md3-button
   */
  protected override render(): TemplateResult {
    // TODO(b/182405623): restore whitespace
    return html`
      <span class="md3-button__host"
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleActivate}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleActivate}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}"><!--
      --><a class="md3-button ${classMap(this.getRenderClasses())}"
          href="${this.href}"
          target="${ifDefined(this.target as LinkTarget)}"
          aria-label="${ifDefined(this.ariaLabel)}"><!--
        -->${this.renderOverlay()}<!--
        -->${this.renderRipple()}<!--
        -->${this.renderOutline()}<!--
        -->${this.renderTouchTarget()}<!--
        -->${
        // TODO(b/191914389): move to separate template
        html`<span class="md3-button__icon-slot-container ${
            classMap(this.getIconContainerClasses())}">
                               <slot name="icon" @slotchange="${
            this.handleSlotChange}">
                                  ${this.icon ? this.renderFontIcon() : ''}
                               </slot>
                              </span>`}<!--
        -->${this.renderLabel()}</a><!--
        Note: link buttons cannot have trailing icons.
        --></span>`;
  }
}
