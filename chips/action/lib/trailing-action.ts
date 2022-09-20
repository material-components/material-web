/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {Action} from './action.js';
import {Md3ChipActionEventType} from './events.js';

/** @soyCompatible */
export class TrailingAction extends Action {
  @property({type: Boolean, reflect: true}) isNavigable = false;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <button class="${classMap(this.getRootClasses())}"
          aria-label="${ifDefined(this.ariaLabel)}"
          aria-hidden="${!this.isNavigable}"
          tabindex="${this.isFocusable ? 0 : -1}"
          type="button"
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
        ${this.renderCloseIcon()}
      </button>`;
  }

  /** @soyTemplate */
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-chip__action--trailing': true,
    };
  }

  /** @soyTemplate */
  protected override getRippleClasses(): ClassInfo {
    return {
      ...super.getRippleClasses(),
      'md3-chip__ripple--trailing': true,
    };
  }

  /** @soyTemplate */
  private renderCloseIcon(): TemplateResult {
    return html`
      <span class="md3-chip__icon md3-chip__icon--trailing" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg"
             height="24" width="24" fill="#041E49">
          <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 
                   13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"/>
        </svg>
      </span>`;
  }

  override getInteractionEvent(): string {
    return Md3ChipActionEventType.DELETE;
  }
}
