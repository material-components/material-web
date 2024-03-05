/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';
import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

/**
 * Sizes variants available to non-extended FABs.
 */
export type FabSize = 'medium' | 'small' | 'large';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export abstract class SharedFab extends LitElement {
  static {
    requestUpdateOnAriaChange(SharedFab);
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
  @property({reflect: true}) size: FabSize = 'medium';

  /**
   * The text to display on the FAB.
   */
  @property() label = '';

  /**
   * Lowers the FAB's elevation.
   */
  @property({type: Boolean}) lowered = false;

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        class="fab ${classMap(this.getRenderClasses())}"
        aria-label=${ariaLabel || nothing}>
        <md-elevation part="elevation"></md-elevation>
        <md-focus-ring part="focus-ring"></md-focus-ring>
        <md-ripple class="ripple"></md-ripple>
        ${this.renderTouchTarget()} ${this.renderIcon()} ${this.renderLabel()}
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
    return html`<div class="touch-target"></div>`;
  }

  private renderLabel() {
    return this.label ? html`<span class="label">${this.label}</span>` : '';
  }

  private renderIcon() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<span class="icon">
      <slot
        name="icon"
        aria-hidden=${ariaLabel || this.label
          ? 'true'
          : (nothing as unknown as 'false')}>
        <span></span>
      </slot>
    </span>`;
  }
}
