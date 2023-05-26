/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, nothing, PropertyValues, svg} from 'lit';
import {property} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../aria/aria.js';

import {Chip} from './chip.js';
import {renderRemoveButton} from './trailing-actions.js';

/**
 * A filter chip component.
 */
export class FilterChip extends Chip {
  @property({type: Boolean}) elevated = false;
  @property({type: Boolean}) removable = false;
  @property({type: Boolean}) selected = false;

  protected get primaryId() {
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
      elevated: this.elevated,
      selected: this.selected,
    };
  }

  protected override renderPrimaryAction() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button class="primary action"
        id="option"
        aria-label=${ariaLabel || nothing}
        aria-selected=${this.selected}
        ?disabled=${this.disabled || nothing}
        role="option"
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

  protected override renderTrailingAction() {
    if (this.removable) {
      return renderRemoveButton({disabled: this.disabled});
    }

    return nothing;
  }

  protected override renderOutline() {
    if (this.elevated) {
      return html`<md-elevation></md-elevation>`;
    }

    return super.renderOutline();
  }
}
