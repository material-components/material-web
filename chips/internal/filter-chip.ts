/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, nothing, PropertyValues, svg, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';

import {MultiActionChip} from './multi-action-chip.js';
import {renderRemoveButton} from './trailing-icons.js';

/**
 * A filter chip component.
 */
export class FilterChip extends MultiActionChip {
  @property({type: Boolean}) elevated = false;
  @property({type: Boolean}) removable = false;
  @property({type: Boolean, reflect: true}) selected = false;

  protected get primaryId() {
    return 'option';
  }

  @query('.primary.action') protected readonly primaryAction!: HTMLElement|null;
  @query('.trailing.action')
  protected readonly trailingAction!: HTMLElement|null;

  constructor() {
    super();
    // Remove the `row` role from the container, since filter chips do not use a
    // `grid` navigation model.
    this.containerRole = undefined;
    this.addEventListener('click', () => {
      if (this.disabled) {
        return;
      }

      this.selected = !this.selected;
    });
  }

  protected override updated(changed: PropertyValues<this>) {
    if (changed.has('selected') && changed.get('selected') !== undefined) {
      // Dispatch when `selected` changes, except for the first update.
      this.dispatchEvent(new Event('selected', {bubbles: true}));
    }
  }

  protected override getContainerClasses() {
    return {
      ...super.getContainerClasses(),
      elevated: this.elevated,
      selected: this.selected,
      'has-trailing': this.removable,
    };
  }

  protected override renderActionCell(content: TemplateResult|typeof nothing) {
    // Filter chips use a `listbox`/`option` model, and do not need `gridcell`
    // wrappers around their actions.
    return content;
  }

  protected override renderAction() {
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
      return renderRemoveButton(
          {ariaLabel: this.ariaLabelRemove, disabled: this.disabled});
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
