/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, nothing} from 'lit';
import {property} from 'lit/decorators.js';

import {ripple} from '../../ripple/directive.js';
import {ARIAMixinStrict} from '../../types/aria.js';

import {Chip} from './chip.js';
import {renderRemoveButton} from './trailing-actions.js';

/**
 * An input chip component.
 */
export class InputChip extends Chip {
  @property({type: Boolean}) avatar = false;
  @property() href = '';
  @property() target: '_blank'|'_parent'|'_self'|'_top'|'' = '';
  @property({type: Boolean, attribute: 'remove-only'}) removeOnly = false;
  @property({type: Boolean}) selected = false;

  protected get focusFor() {
    if (this.href) {
      return 'link';
    }

    if (this.removeOnly) {
      return 'text';
    }

    return 'button';
  }

  protected override get rippleDisabled() {
    // Link chips cannot be disabled
    return !this.href && this.disabled;
  }

  protected override getContainerClasses() {
    return {
      ...super.getContainerClasses(),
      avatar: this.avatar,
      // Link chips cannot be disabled
      disabled: !this.href && this.disabled,
      selected: this.selected,
    };
  }

  protected override renderPrimaryAction() {
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.href) {
      return html`
        <a class="primary action"
          id="link"
          aria-label=${ariaLabel || nothing}
          href=${this.href}
          target=${this.target || nothing}
          ${ripple(this.getRipple)}
        >${this.renderContent()}</a>
      `;
    }

    if (this.removeOnly) {
      return html`
        <span class="primary action"
          id="text"
          aria-label=${ariaLabel || nothing}
        >${this.renderContent()}</span>
      `;
    }

    return html`
      <button class="primary action"
        id="button"
        aria-label=${ariaLabel || nothing}
        ?disabled=${this.disabled}
        type="button"
        ${ripple(this.getRipple)}
      >${this.renderContent()}</button>
    `;
  }

  protected override renderTrailingAction() {
    return renderRemoveButton({disabled: this.disabled});
  }
}
