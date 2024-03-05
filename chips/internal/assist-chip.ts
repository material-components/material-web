/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, nothing} from 'lit';
import {property} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';

import {Chip} from './chip.js';

/**
 * An assist chip component.
 */
export class AssistChip extends Chip {
  @property({type: Boolean}) elevated = false;
  @property() href = '';
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  protected get primaryId() {
    return this.href ? 'link' : 'button';
  }

  protected override get rippleDisabled() {
    // Link chips cannot be disabled
    return !this.href && this.disabled;
  }

  protected override getContainerClasses() {
    return {
      ...super.getContainerClasses(),
      // Link chips cannot be disabled
      disabled: !this.href && this.disabled,
      elevated: this.elevated,
      link: !!this.href,
    };
  }

  protected override renderPrimaryAction(content: unknown) {
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.href) {
      return html`
        <a
          class="primary action"
          id="link"
          aria-label=${ariaLabel || nothing}
          href=${this.href}
          target=${this.target || nothing}
          >${content}</a
        >
      `;
    }

    return html`
      <button
        class="primary action"
        id="button"
        aria-label=${ariaLabel || nothing}
        ?disabled=${this.disabled && !this.alwaysFocusable}
        type="button"
        >${content}</button
      >
    `;
  }

  protected override renderOutline() {
    if (this.elevated) {
      return html`<md-elevation part="elevation"></md-elevation>`;
    }

    return super.renderOutline();
  }
}
