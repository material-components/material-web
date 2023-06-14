/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, nothing, PropertyValues} from 'lit';
import {property, query} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';

import {MultiActionChip} from './multi-action-chip.js';
import {renderRemoveButton} from './trailing-icons.js';

/**
 * An input chip component.
 */
export class InputChip extends MultiActionChip {
  @property({type: Boolean}) avatar = false;
  @property() href = '';
  @property() target: '_blank'|'_parent'|'_self'|'_top'|'' = '';
  @property({type: Boolean, attribute: 'remove-only'}) removeOnly = false;
  @property({type: Boolean}) selected = false;

  protected get primaryId() {
    if (this.href) {
      return 'link';
    }

    if (this.removeOnly) {
      return '';
    }

    return 'button';
  }

  protected override get rippleDisabled() {
    // Link chips cannot be disabled
    return !this.href && this.disabled;
  }

  protected get primaryAction() {
    // Don't use @query() since a remove-only input chip still has a span that
    // has "primary action" classes.
    if (this.removeOnly) {
      return null;
    }

    return this.renderRoot.querySelector<HTMLElement>('.primary.action');
  }

  @query('.trailing.action')
  protected readonly trailingAction!: HTMLElement|null;

  protected override update(changed: PropertyValues<this>) {
    if (changed.has('selected') && changed.get('selected') !== undefined) {
      // Dispatch when `selected` changes, except for the first update.
      this.dispatchEvent(new Event('selected', {bubbles: true}));
    }

    super.update(changed);
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

  protected override renderAction() {
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.href) {
      return html`
        <a class="primary action"
          id="link"
          aria-label=${ariaLabel || nothing}
          href=${this.href}
          target=${this.target || nothing}
        >${this.renderContent()}</a>
      `;
    }

    if (this.removeOnly) {
      return html`
        <span class="primary action" aria-label=${ariaLabel || nothing}>
          ${this.renderContent()}
        </span>
      `;
    }

    return html`
      <button class="primary action"
        id="button"
        aria-label=${ariaLabel || nothing}
        ?disabled=${this.disabled}
        type="button"
      >${this.renderContent()}</button>
    `;
  }

  protected override renderTrailingAction() {
    return renderRemoveButton({
      ariaLabel: this.ariaLabelRemove,
      disabled: this.disabled,
    });
  }
}
