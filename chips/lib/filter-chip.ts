/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, nothing, PropertyValues, svg} from 'lit';
import {property} from 'lit/decorators.js';

import {ripple} from '../../ripple/directive.js';
import {ARIAMixinStrict} from '../../types/aria.js';

import {Chip} from './chip.js';

/**
 * A filter chip component.
 */
export class FilterChip extends Chip {
  @property({type: Boolean}) selected = false;

  protected get primaryFocusFor() {
    return 'option';
  }

  constructor() {
    super();
    this.addEventListener('click', () => {
      if (this.disabled) {
        return;
      }

      this.selected = !this.selected;
    });
  }

  protected override updated(changedProperties: PropertyValues<FilterChip>) {
    if (changedProperties.has('selected') &&
        changedProperties.get('selected') !== undefined) {
      // Dispatch when `selected` changes, except for the first update.
      this.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }

  protected override getContainerClasses() {
    return {
      ...super.getContainerClasses(),
      selected: this.selected,
    };
  }

  protected override renderPrimaryAction() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button class="action"
        id="option"
        aria-label=${ariaLabel || nothing}
        aria-selected=${this.selected}
        ?disabled=${this.disabled || nothing}
        role="option"
        ${ripple(this.getPrimaryRipple)}
      >${this.renderContent()}</button>
    `;
  }

  protected override renderLeadingIcon() {
    if (!this.selected) {
      return super.renderLeadingIcon();
    }

    return svg`
      <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
        <path d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
      </svg>
    `;
  }
}
