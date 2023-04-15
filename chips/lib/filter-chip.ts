/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {PropertyValues, svg} from 'lit';
import {property} from 'lit/decorators.js';

import {Chip} from './chip.js';

/**
 * A filter chip component.
 */
export class FilterChip extends Chip {
  @property({type: Boolean}) selected = false;

  constructor() {
    super();
    this.addEventListener('click', () => {
      this.selected = !this.selected;
    });
  }

  protected override updated(changedProperties: PropertyValues<FilterChip>) {
    if (changedProperties.has('selected')) {
      this.dispatchEvent(new Event('change', {bubbles: true}));
    }
  }

  protected override getContainerClasses() {
    const classes = super.getContainerClasses();
    return {
      ...classes,
      selected: this.selected,
    };
  }

  protected override renderLeadingIcon() {
    if (!this.selected) {
      return super.renderLeadingIcon();
    }

    return svg`
      <svg class="checkmark" viewBox="0 0 18 18">
        <path d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
      </svg>
    `;
  }
}
