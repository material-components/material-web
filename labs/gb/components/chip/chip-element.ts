/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {redispatchEvent} from '../../../../internal/events/redispatch-event.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import {chip, type ChipColor, type ChipType} from './chip.js';
import {styles as chipStyles} from './chip.cssresult.js';

/**
 * A Material Design Expressive Chip component (`md-gb-chip`).
 *
 * @slot - Used to display the chip label text.
 * @slot icon - Used to display an optional leading icon, checkmark, or avatar.
 * @slot remove-icon - Used to display the trailing remove button icon when `removable="true"`.
 * @fires {Event} remove - Fired when the remove action is triggered on a removable chip. --bubbles --composed
 * @fires {Event} change - Fired when a filter/toggle chip's selection state changes. --bubbles
 * @fires {InputEvent} input - Fired when a filter/toggle chip's selection state changes. --bubbles --composed
 * @csspart chip - The root container element.
 * @cssprop --avatar-opacity
 * @cssprop --avatar-shape
 * @cssprop --avatar-size
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-opacity
 * @cssprop --gap-horizontal
 * @cssprop --height
 * @cssprop --label-text
 * @cssprop --label-text-color
 * @cssprop --label-text-opacity
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-opacity
 * @cssprop --leading-icon-size
 * @cssprop --outline-color
 * @cssprop --outline-opacity
 * @cssprop --outline-width
 * @cssprop --padding-bottom
 * @cssprop --padding-leading
 * @cssprop --padding-top
 * @cssprop --padding-trailing
 * @cssprop --shape
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-opacity
 * @cssprop --trailing-icon-size
 */
export class ChipElement extends LitElement {
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    chipStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
      .chip {
        flex: 1;
      }
      .chip-icon {
        display: inline-flex;
        align-items: center;
      }
    `,
  ];

  /** The color emphasis of the chip. Defaults to `outlined`. */
  @property() color: ChipColor = 'outlined';

  /** The functional behavior type of the chip (`action`, `filter`, `toggle`, `link`). */
  @property() type: ChipType = 'action';

  /** Whether the filter or toggle chip is selected. */
  @property({type: Boolean, reflect: true}) selected = false;

  /** Whether the chip is removable. */
  @property({type: Boolean, reflect: true}) removable = false;

  /** Whether the chip is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** Whether the chip is soft-disabled (`aria-disabled="true"` while preserving focusability). */
  @property({type: Boolean, attribute: 'soft-disabled', reflect: true})
  softDisabled = false;

  /** The URL destination if `type="link"` or if `href` is set. */
  @property() href = '';

  /** Where to display the linked `href` URL for a link chip. */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  @state() private hasLeadingIcon = false;
  @state() private hasAvatar = false;
  @state() private hasRemoveIcon = false;

  protected override render() {
    const isFilterSelected =
      (this.type === 'filter' || this.type === 'toggle') && this.selected;
    const withLeadingIcon = this.hasLeadingIcon || isFilterSelected;
    const withAvatar = this.hasAvatar;

    const chipClasses = chip({
      color: this.color,
      type: this.href ? 'link' : this.type,
      selected: this.selected,
      removable: this.removable,
      disabled: this.softDisabled || this.disabled,
      withLeadingIcon: withLeadingIcon && !withAvatar,
      withAvatar,
      withTrailingIcon: this.removable || this.hasRemoveIcon,
    });

    if (this.href || this.type === 'link') {
      return html`<a
        part="chip"
        class="${chipClasses}"
        href=${this.href}
        target=${(this.target as '_blank' | '_parent' | '_self' | '_top') ||
        nothing}
        aria-disabled=${this.disabled || this.softDisabled ? 'true' : nothing}
        tabindex=${this.disabled && !this.softDisabled ? -1 : nothing}>
        ${this.renderContent(withLeadingIcon, isFilterSelected)}
      </a>`;
    }

    if (this.removable) {
      return html`<div
        part="chip"
        class="${chipClasses}"
        role="row"
        aria-pressed=${this.type === 'filter' || this.type === 'toggle'
          ? (this.selected ? 'true' : 'false')
          : nothing}
        @change=${this.handleChange}>
        <button
          class="chip-action focus-ring-target"
          type="button"
          ?disabled=${this.disabled}
          aria-disabled=${this.softDisabled ? 'true' : nothing}>
          ${this.renderContent(withLeadingIcon, isFilterSelected)}
        </button>
        ${this.renderRemoveButton()}
      </div>`;
    }

    return html`<button
      part="chip"
      class="${chipClasses}"
      type="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled ? 'true' : nothing}
      aria-pressed=${this.type === 'filter' || this.type === 'toggle'
        ? (this.selected ? 'true' : 'false')
        : nothing}
      @change=${this.handleChange}>
      ${this.renderContent(withLeadingIcon, isFilterSelected)}
    </button>`;
  }

  private renderContent(withLeadingIcon: boolean, isFilterSelected: boolean) {
    return html`
      ${this.renderLeadingIcon(withLeadingIcon, isFilterSelected)}
      <slot></slot>
    `;
  }

  private renderLeadingIcon(
    withLeadingIcon: boolean,
    isFilterSelected: boolean,
  ) {
    return html`<span
      class="chip-icon"
      style="${withLeadingIcon ? '' : 'display: none;'}">
      <slot name="icon" @slotchange=${this.handleIconSlotChange}>
        ${isFilterSelected ? html`✓` : nothing}
      </slot>
    </span>`;
  }

  private renderRemoveButton() {
    return html`<button
      class="chip-remove focus-ring-outer"
      type="button"
      aria-label="Remove"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled ? 'true' : nothing}
      @click=${this.handleRemove}>
      <slot
        name="remove-icon"
        @slotchange=${this.handleRemoveIconSlotChange}
        >✕</slot
      >
    </button>`;
  }

  private handleIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const elements = slot.assignedElements({flatten: true});
    this.hasLeadingIcon = elements.length > 0;
    this.hasAvatar = elements.some((el) => el.classList.contains('chip-avatar'));
  }

  private handleRemoveIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasRemoveIcon = slot.assignedNodes({flatten: true}).length > 0;
  }

  private handleChange(event: Event) {
    this.selected = (event.target as HTMLElement).ariaPressed === 'true';
    redispatchEvent(this, event);
  }

  private handleRemove(event: Event) {
    event.stopPropagation();
    if (this.disabled || this.softDisabled) return;
    this.dispatchEvent(new Event('remove', {bubbles: true, composed: true}));
  }
}
