/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, nothing, type PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {AriaTabElement} from '../../../aria/tabs/tab.js';
import {internals} from '../../../behaviors/element-internals.js';
import {isFocusable} from '../../../behaviors/focusable.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import navRailStyles from './nav-rail.css' with {type: 'css'}; // github-only
// import {styles as navRailStyles} from './nav-rail.cssresult.js'; // google3-only

import {navRailItem, type NavRailItemLayout} from './nav-rail.js';

/**
 * A Material Design navigation rail item component.
 *
 * @slot - Used to display the item's label text.
 * @slot icon - Used to display the item's icon (`md-gb-icon`).
 * @slot badge - Used to display a custom badge on the item's icon.
 * @csspart nav-rail-item - The navigation rail item's presentational container.
 * @csspart indicator - The active indicator / icon container element.
 * @csspart label - The label text container element.
 * @cssstate selected - Whether the navigation rail item is selected.
 */
export class NavRailItemElement extends AriaTabElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    navRailStyles,
    css`
      :host {
        display: flex;
        inline-size: 100%;
        outline: none;
      }

      :host(:hover) .nav-rail-item {
        --md-icon-color: var(--item-inactive-hovered-icon-color);
        color: var(--item-inactive-hovered-label-text-color);
      }

      :host(:focus-visible) .nav-rail-item,
      :host(:focus-within) .nav-rail-item {
        --md-icon-color: var(--item-inactive-focused-icon-color);
        color: var(--item-inactive-focused-label-text-color);
      }

      :host(:active) .nav-rail-item {
        --md-icon-color: var(--item-inactive-pressed-icon-color);
        color: var(--item-inactive-pressed-label-text-color);
      }

      :host(:hover)
        .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']) {
        --md-icon-color: var(--item-active-hovered-icon-color);
        color: var(--item-active-hovered-label-text-color);
      }

      :host(:focus-visible)
        .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']),
      :host(:focus-within)
        .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']) {
        --md-icon-color: var(--item-active-focused-icon-color);
        color: var(--item-active-focused-label-text-color);
      }

      :host(:active)
        .nav-rail-item:is(.nav-rail-item-active, [aria-selected='true']) {
        --md-icon-color: var(--item-active-pressed-icon-color);
        color: var(--item-active-pressed-label-text-color);
      }
    `,
  ];

  constructor() {
    super();
    this.addEventListener('click', (event: Event) => {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    });
  }

  override get selected(): boolean {
    return super.selected;
  }
  override set selected(value: boolean) {
    const oldValue = this.selected;
    super.selected = value;
    this.requestUpdate('active', oldValue);
  }

  /**
   * Whether the navigation rail item is active. Alias for `selected`.
   *
   * TODO: replace reflected `[active]` with `:state(selected)`
   */
  @property({type: Boolean, reflect: true, noAccessor: true})
  get active(): boolean {
    return this.selected;
  }
  set active(value: boolean) {
    this.selected = value;
  }

  /** Whether the navigation rail item is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** The layout orientation of the item ('vertical' or 'horizontal'). */
  @property({attribute: 'item-layout', reflect: true})
  itemLayout: NavRailItemLayout = 'vertical';

  /** Optional label text if not provided via default slot. */
  @property() label = '';

  /** Optional badge text (or 'dot' / 'true' for a small dot badge). */
  @property() badge = '';

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, [focusRingStyles, rippleStyles, navRailStyles]);
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has('disabled')) {
      this[internals].ariaDisabled = String(this.disabled);
      this[isFocusable] = !this.disabled;
    }
  }

  protected override render() {
    const isSelected = this.selected;
    const isDotBadge = this.badge === 'dot' || this.badge === 'true';
    const hasBadge = Boolean(this.badge);

    return html`
      <div
        part="nav-rail-item"
        class="${navRailItem({
          disabled: this.disabled,
          itemLayout: this.itemLayout,
          selected: isSelected,
        })} ripple-host focus-ring-host"
        ?disabled=${this.disabled}>
        <span class="nav-rail-item-content">
          <span part="indicator" class="nav-rail-item-indicator">
            <span class="nav-rail-item-icon">
              <slot name="icon"></slot>
            </span>
          </span>
          <span part="label" class="nav-rail-item-label">
            <slot>${this.label}</slot>
          </span>
          ${hasBadge
            ? html`<span
                class="nav-rail-item-badge ${isDotBadge
                  ? 'nav-rail-item-badge-dot'
                  : ''}">
                ${isDotBadge ? nothing : this.badge}
              </span>`
            : html`<slot name="badge"></slot>`}
        </span>
      </div>
    `;
  }
}
