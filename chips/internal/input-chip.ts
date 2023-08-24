/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, nothing} from 'lit';
import {property, query} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';

import {renderGridAction, renderGridContainer} from './chip.js';
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
  @property({type: Boolean, reflect: true}) selected = false;

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

  protected override renderContainer(content: unknown) {
    return renderGridContainer(content, this.getContainerClasses());
  }

  protected override getContainerClasses() {
    return {
      ...super.getContainerClasses(),
      avatar: this.avatar,
      // Link chips cannot be disabled
      disabled: !this.href && this.disabled,
      link: !!this.href,
      selected: this.selected,
      'has-trailing': true,
    };
  }

  protected override renderPrimaryAction(content: unknown) {
    const {ariaLabel} = this as ARIAMixinStrict;
    if (this.href) {
      return renderGridAction(html`
        <a class="primary action"
          id="link"
          aria-label=${ariaLabel || nothing}
          href=${this.href}
          target=${this.target || nothing}
        >${content}</a>
      `);
    }

    if (this.removeOnly) {
      return renderGridAction(html`
        <span class="primary action" aria-label=${ariaLabel || nothing}>
          ${content}
        </span>
      `);
    }

    return renderGridAction(html`
      <button class="primary action"
        id="button"
        aria-label=${ariaLabel || nothing}
        ?disabled=${this.disabled}
        type="button"
      >${content}</button>
    `);
  }

  protected override renderTrailingAction() {
    return renderGridAction(renderRemoveButton({
      ariaLabel: this.ariaLabelRemove,
      disabled: !this.href && this.disabled,
      tabbable: this.removeOnly,
    }));
  }
}
