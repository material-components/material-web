/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

/**
 * Sizes variants available to non-extended FABs.
 */
export type FabSize = 'medium'|'small'|'large';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class SharedFab extends LitElement {
  /** @nocollapse */
  static {
    requestUpdateOnAriaChange(this);
  }

  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open' as const,
    delegatesFocus: true,
  };

  /**
   * The size of the FAB.
   *
   * NOTE: Branded FABs cannot be sized to `small`, and Extended FABs do not
   * have different sizes.
   */
  @property() size: FabSize = 'medium';

  /**
   * The text to display on the FAB.
   */
  @property() label = '';


  /**
   * Lowers the FAB's elevation.
   */
  @property({type: Boolean}) lowered = false;

  /**
   * Lowers the FAB's elevation and places it into the `lowered` state.
   */
  @property({type: Boolean}) reducedTouchTarget = false;

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        class="fab ${classMap(this.getRenderClasses())}"
        aria-label=${ariaLabel || nothing}
      >
        <md-elevation></md-elevation>
        <md-focus-ring></md-focus-ring>
        <md-ripple class="ripple"></md-ripple>
        ${this.renderTouchTarget()}
        ${this.renderIcon()}
        ${this.renderLabel()}
      </button>
    `;
  }

  protected getRenderClasses() {
    const isExtended = !!this.label;
    return {
      'lowered': this.lowered,
      'small': this.size === 'small' && !isExtended,
      'large': this.size === 'large' && !isExtended,
      'extended': isExtended,
    };
  }

  private renderTouchTarget() {
    return this.reducedTouchTarget ? html`` :
                                     html`<div class="touch-target"></div>`;
  }

  private renderLabel() {
    return this.label ? html`<span class="label">${this.label}</span>` : '';
  }

  private renderIcon() {
    return html`<span class="icon">
        <slot name="icon"></slot>
      </span>`;
  }
}
