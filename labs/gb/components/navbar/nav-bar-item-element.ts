/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  type PropertyValues,
} from 'lit';
import {property} from 'lit/decorators.js';
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
 * @csspart nav-bar-item - The navigation bar item's interactive button.
 * @csspart indicator - The active indicator / icon container element.
 * @csspart label - The label text container element.
 */
export class NavBarItemElement extends LitElement {
  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

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
      }
    `,
  ];

  protected readonly internals = this.attachInternals();

  constructor() {
    super();
    this.internals.role = 'presentation';
  }

  /** Whether the navigation bar item is active. */
  @property({type: Boolean, reflect: true}) active = false;

  /** Alias for `active` to match `md-gb-button` and `md-gb-toolbar` APIs. */
  @property({type: Boolean, reflect: true}) selected = false;

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

  protected override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('active') && this.selected !== this.active) {
      this.selected = this.active;
    } else if (
      changedProperties.has('selected') &&
      this.active !== this.selected
    ) {
      this.active = this.selected;
    }
  }

  protected override render() {
    const isActive = this.active || this.selected;
    const isDotBadge = this.badge === 'dot' || this.badge === 'true';
    const hasBadge = Boolean(this.badge);

    return html`
      <button
        part="nav-bar-item"
        type="button"
        class="${navBarItem({
          active: isActive,
          itemLayout: this.itemLayout,
        })}"
        ?disabled=${this.disabled}
        aria-selected=${isActive ? 'true' : 'false'}
        aria-current=${isActive ? 'page' : nothing}>
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
      </button>
    `;
  }

  private syncSlottedIcons() {
    const icons = this.querySelectorAll('md-gb-icon:not([slot])');
    for (const icon of Array.from(icons)) {
      icon.setAttribute('slot', 'icon');
    }
  }
}

/** Alias class for `<md-gb-navigation-bar-item>`. */
export class NavigationBarItemElement extends NavBarItemElement {}
