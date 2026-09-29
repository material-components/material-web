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
import navBarStyles from './nav-bar.css' with {type: 'css'}; // github-only
// import {styles as navBarStyles} from './nav-bar.cssresult.js'; // google3-only

import {navBarItem, type NavBarItemLayout} from './nav-bar.js';

/**
 * A Material Design gBreeze navigation bar item component.
 *
 * @slot - Used to display the item's label text.
 * @slot icon - Used to display the item's icon (`md-gb-icon`).
 * @slot badge - Used to display a custom badge on the item's icon.
 * @csspart nav-bar-item - The navigation bar item's presentational container.
 * @csspart indicator - The active indicator / icon container element.
 * @csspart label - The label text container element.
 * @cssstate selected - Whether the navigation bar item is selected.
 */
export class NavBarItemElement extends AriaTabElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    navBarStyles,
    css`
      :host {
        display: flex;
        flex: 1 1 0;
        min-width: 48px;
        outline: none;
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

  /** Whether the navigation bar item is active. Alias for `selected`. */
  @property({type: Boolean, reflect: true, noAccessor: true})
  get active(): boolean {
    return this.selected;
  }
  set active(value: boolean) {
    this.selected = value;
  }

  /** Whether the navigation bar item is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** The layout orientation of the item ('vertical' or 'horizontal'). */
  @property({attribute: 'item-layout', reflect: true})
  itemLayout: NavBarItemLayout = 'vertical';

  /** Optional label text if not provided via default slot. */
  @property() label = '';

  /** Optional badge text (or 'dot' / 'true' for a small dot badge). */
  @property() badge = '';

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, [focusRingStyles, rippleStyles, navBarStyles]);
    this.syncSlottedIcons();
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has('disabled')) {
      this[internals].ariaDisabled = String(this.disabled);
      this[isFocusable] = !this.disabled;
    }
  }

  protected override render() {
    const isActive = this.selected;
    const isDotBadge = this.badge === 'dot' || this.badge === 'true';
    const hasBadge = Boolean(this.badge);

    return html`
      <div
        part="nav-bar-item"
        class="${navBarItem({
          active: isActive,
          disabled: this.disabled,
          itemLayout: this.itemLayout,
        })} ripple-host focus-ring-host"
        ?disabled=${this.disabled}>
        <span class="nav-bar-item-content">
          <span part="indicator" class="nav-bar-item-icon-container">
            <span class="nav-bar-item-icon">
              <slot name="icon" @slotchange=${this.syncSlottedIcons}></slot>
            </span>
            ${hasBadge
              ? html`<span
                  class="nav-bar-item-badge ${isDotBadge
                    ? 'nav-bar-item-badge-dot'
                    : ''}">
                  ${isDotBadge ? nothing : this.badge}
                </span>`
              : html`<slot name="badge"></slot>`}
          </span>
          <span part="label" class="nav-bar-item-label">
            <slot @slotchange=${this.syncSlottedIcons}>${this.label}</slot>
          </span>
        </span>
      </div>
    `;
  }

  private syncSlottedIcons() {
    const icons = this.querySelectorAll('md-gb-icon:not([slot])');
    for (const icon of Array.from(icons)) {
      icon.setAttribute('slot', 'icon');
    }
  }
}
