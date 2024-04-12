/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, nothing} from 'lit';
import {property, query} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {redispatchEvent} from '../../internal/events/redispatch-event.js';

import {MultiActionChip} from './multi-action-chip.js';
import {renderRemoveButton} from './trailing-icons.js';

/**
 * A filter chip component.
 *
 * @fires remove {Event} Dispatched when the remove button is clicked.
 */
export class FilterChip extends MultiActionChip {
  @property({type: Boolean}) elevated = false;
  @property({type: Boolean}) removable = false;
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * Only needed for SSR.
   *
   * Add this attribute when a filter chip has a `slot="selected-icon"` to avoid
   * a Flash Of Unstyled Content.
   */
  @property({type: Boolean, reflect: true, attribute: 'has-selected-icon'})
  hasSelectedIcon = false;

  protected get primaryId() {
    return 'button';
  }

  @query('.primary.action')
  protected readonly primaryAction!: HTMLElement | null;
  @query('.trailing.action')
  protected readonly trailingAction!: HTMLElement | null;

  protected override getContainerClasses() {
    return {
      ...super.getContainerClasses(),
      elevated: this.elevated,
      selected: this.selected,
      'has-trailing': this.removable,
      'has-icon': this.hasIcon || this.selected,
    };
  }

  protected override renderPrimaryAction(content: unknown) {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        class="primary action"
        id="button"
        aria-label=${ariaLabel || nothing}
        aria-pressed=${this.selected}
        ?disabled=${this.disabled && !this.alwaysFocusable}
        @click=${this.handleClick}
        >${content}</button
      >
    `;
  }

  protected override renderLeadingIcon() {
    if (!this.selected) {
      return super.renderLeadingIcon();
    }

    return html`
      <slot name="selected-icon">
        <svg class="checkmark" viewBox="0 0 18 18" aria-hidden="true">
          <path
            d="M6.75012 12.1274L3.62262 8.99988L2.55762 10.0574L6.75012 14.2499L15.7501 5.24988L14.6926 4.19238L6.75012 12.1274Z" />
        </svg>
      </slot>
    `;
  }

  protected override renderTrailingAction(focusListener: EventListener) {
    if (this.removable) {
      return renderRemoveButton({
        focusListener,
        ariaLabel: this.ariaLabelRemove,
        disabled: this.disabled,
      });
    }

    return nothing;
  }

  protected override renderOutline() {
    if (this.elevated) {
      return html`<md-elevation part="elevation"></md-elevation>`;
    }

    return super.renderOutline();
  }

  private handleClick(event: MouseEvent) {
    if (this.disabled) {
      return;
    }

    // Store prevValue to revert in case `chip.selected` is changed during an
    // event listener.
    const prevValue = this.selected;
    this.selected = !this.selected;

    const preventDefault = !redispatchEvent(this, event);
    if (preventDefault) {
      // We should not do `this.selected = !this.selected`, since a client
      // click listener could change its value. Instead, always revert to the
      // original value.
      this.selected = prevValue;
      return;
    }
  }
}
