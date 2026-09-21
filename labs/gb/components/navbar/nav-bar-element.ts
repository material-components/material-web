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
  type PropertyValues,
} from 'lit';
import {property} from 'lit/decorators.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import navBarStyles from './nav-bar.css' with {type: 'css'}; // github-only
// import {styles as navBarStyles} from './nav-bar.cssresult.js'; // google3-only

import {navBar, type NavBarItemLayout} from './nav-bar.js';
import {NavBarItemElement} from './nav-bar-item-element.js';

/**
 * A Material Design gBreeze navigation bar component.
 *
 * @slot - Used to display navigation bar items (`md-gb-nav-bar-item`).
 * @csspart nav-bar - The navigation bar's root container.
 * @fires {CustomEvent<{selectedIndex: number, selectedItem: HTMLElement}>} change
 *   Fired when the active navigation bar item changes. --bubbles --composed
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shadow-color
 * @cssprop --container-shape
 * @cssprop --item-active-focused-state-layer-color
 * @cssprop --item-active-focused-state-layer-opacity
 * @cssprop --item-active-hovered-state-layer-color
 * @cssprop --item-active-hovered-state-layer-opacity
 * @cssprop --item-active-icon-color
 * @cssprop --item-active-indicator-color
 * @cssprop --item-active-indicator-height
 * @cssprop --item-active-indicator-icon-label-space
 * @cssprop --item-active-indicator-leading-space
 * @cssprop --item-active-indicator-shape
 * @cssprop --item-active-indicator-trailing-space
 * @cssprop --item-active-indicator-width
 * @cssprop --item-active-label-text-color
 * @cssprop --item-active-pressed-state-layer-color
 * @cssprop --item-active-pressed-state-layer-opacity
 * @cssprop --item-between-space
 * @cssprop --item-container-between-space
 * @cssprop --item-icon-size
 * @cssprop --item-inactive-focused-state-layer-color
 * @cssprop --item-inactive-focused-state-layer-opacity
 * @cssprop --item-inactive-hovered-state-layer-color
 * @cssprop --item-inactive-hovered-state-layer-opacity
 * @cssprop --item-inactive-icon-color
 * @cssprop --item-inactive-label-text-color
 * @cssprop --item-inactive-pressed-state-layer-color
 * @cssprop --item-inactive-pressed-state-layer-opacity
 * @cssprop --item-label-text
 * @cssprop --item-label-text-axes
 * @cssprop --item-label-text-tracking
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 */
export class NavBarElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    navBarStyles,
    css`
      :host {
        display: flex;
        width: 100%;
      }
    `,
  ];

  protected readonly internals = this.attachInternals();

  constructor() {
    super();
    this.internals.role = 'navigation';
    this.addEventListener('click', this.handleClick);
  }

  /** The layout orientation of items ('vertical' or 'horizontal'). */
  @property({attribute: 'item-layout', reflect: true})
  itemLayout: NavBarItemLayout = 'vertical';

  /** The 0-based index of the currently active navigation bar item. */
  @property({type: Number, attribute: 'selected-index'})
  selectedIndex = 0;

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, navBarStyles);
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (!this.hasAttribute('focusgroup')) {
      this.setAttribute('focusgroup', 'toolbar wrap inline');
    }
    if (changedProperties.has('itemLayout')) {
      this.syncItemsLayout();
    }
    if (changedProperties.has('selectedIndex')) {
      this.syncSelectedIndex();
    }
  }

  protected override render() {
    return html`
      <div
        part="nav-bar"
        class="${navBar({
          itemLayout: this.itemLayout,
        })}">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }

  private getAllNavBarItems(): HTMLElement[] {
    const selector =
      'md-gb-nav-bar-item, md-gb-navigation-bar-item, .nav-bar-item, button, a[href]';
    const slots = this.shadowRoot?.querySelectorAll('slot');
    if (!slots || slots.length === 0) {
      return Array.from(this.querySelectorAll<HTMLElement>(selector));
    }
    const items: HTMLElement[] = [];
    for (const slot of Array.from(slots)) {
      for (const assigned of slot.assignedElements({flatten: true})) {
        if (!(assigned instanceof HTMLElement)) continue;
        if (assigned.matches(selector)) {
          items.push(assigned);
        } else {
          items.push(
            ...Array.from(assigned.querySelectorAll<HTMLElement>(selector)),
          );
        }
      }
    }
    return items;
  }

  private handleSlotChange() {
    this.syncItemsLayout();
    const items = this.getAllNavBarItems();
    const activeIdx = items.findIndex(
      (item) =>
        item.hasAttribute('active') ||
        item.hasAttribute('selected') ||
        item.classList.contains('nav-bar-item-active'),
    );
    if (activeIdx !== -1) {
      this.selectedIndex = activeIdx;
    } else if (items.length > 0 && this.selectedIndex >= 0) {
      this.syncSelectedIndex();
    }
  }

  private syncItemsLayout() {
    const items = this.getAllNavBarItems();
    for (const item of items) {
      if (item instanceof NavBarItemElement) {
        item.itemLayout = this.itemLayout;
      } else {
        item.setAttribute('item-layout', this.itemLayout);
      }
    }
  }

  private syncSelectedIndex() {
    const items = this.getAllNavBarItems();
    items.forEach((item, idx) => {
      const isActive = idx === this.selectedIndex;
      if (item instanceof NavBarItemElement) {
        item.active = isActive;
        item.selected = isActive;
      } else {
        item.classList.toggle('nav-bar-item-active', isActive);
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      }
    });
  }

  private handleClick(event: MouseEvent) {
    if (event.defaultPrevented) return;
    const items = this.getAllNavBarItems();
    const path = event.composedPath();
    const clickedIndex = items.findIndex((item) => path.includes(item));
    if (clickedIndex === -1) return;

    const clickedItem = items[clickedIndex];
    if (
      clickedItem.hasAttribute('disabled') ||
      (clickedItem as HTMLButtonElement).disabled
    ) {
      return;
    }

    if (this.selectedIndex !== clickedIndex) {
      this.selectedIndex = clickedIndex;
      this.syncSelectedIndex();
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          composed: true,
          detail: {
            selectedIndex: clickedIndex,
            selectedItem: clickedItem,
          },
        }),
      );
    }
  }
}

/** Alias class for `<md-gb-navigation-bar>`. */
export class NavigationBarElement extends NavBarElement {}
