/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, type PropertyValues} from 'lit';
import {property} from 'lit/decorators.js';
import {AriaTablistElement} from '../../../aria/tabs/tablist.js';
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
 * @fires {Event} change - Fired when the selected navigation bar item changes. --bubbles
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shadow-color
 * @cssprop --container-shape
 * @cssprop --item-active-icon-color
 * @cssprop --item-active-indicator-color
 * @cssprop --item-active-indicator-height
 * @cssprop --item-active-indicator-icon-label-space
 * @cssprop --item-active-indicator-leading-space
 * @cssprop --item-active-indicator-shape
 * @cssprop --item-active-indicator-trailing-space
 * @cssprop --item-active-indicator-width
 * @cssprop --item-active-label-text-color
 * @cssprop --item-active-state-layer-color
 * @cssprop --item-between-space
 * @cssprop --item-container-between-space
 * @cssprop --item-icon-size
 * @cssprop --item-inactive-icon-color
 * @cssprop --item-inactive-label-text-color
 * @cssprop --item-inactive-state-layer-color
 * @cssprop --item-label-text
 * @cssprop --item-label-text-axes
 * @cssprop --item-label-text-tracking
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 */
export class NavBarElement extends AriaTablistElement {
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

  /** The layout orientation of items ('vertical' or 'horizontal'). */
  @property({attribute: 'item-layout', reflect: true})
  itemLayout: NavBarItemLayout = 'vertical';

  /**
   * The 0-based index of the currently active navigation bar item.
   * Alias for `selectedTabIndex`.
   */
  @property({type: Number, attribute: 'selected-index', noAccessor: true})
  get selectedIndex(): number {
    return this.selectedTabIndex;
  }
  set selectedIndex(index: number) {
    this.selectedTabIndex = index;
  }

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, navBarStyles);
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has('itemLayout')) {
      this.syncItemsLayout();
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

  protected override handleSlotChange() {
    super.handleSlotChange();
    this.syncItemsLayout();
  }

  private syncItemsLayout() {
    for (const tab of this.tabs) {
      if (tab instanceof NavBarItemElement) {
        tab.itemLayout = this.itemLayout;
      } else {
        tab.setAttribute('item-layout', this.itemLayout);
      }
    }
  }
}
