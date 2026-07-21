/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property, state} from 'lit/decorators.js';

import {appBar, type AppBarSize, type AppBarVariant} from './app-bar.js';
import {styles as appBarStyles} from './app-bar.cssresult.js';

/**
 * A Material Design Expressive App Bar component (`md-gb-app-bar`).
 *
 * @slot - Used to display the primary title text of the app bar.
 * @slot subtitle - Used to display an optional subtitle below the title in medium/large bars.
 * @slot leading - Used to display the leading navigation icon button (e.g. menu or back).
 * @slot trailing - Used to display trailing action buttons and/or user avatar.
 * @slot search - Used to display search bar input or controls when `variant="search"`.
 * @fires {CustomEvent<{scrolled: boolean}>} scrollstatechange - Fired when the scrolled state changes. --bubbles --composed
 * @csspart app-bar - The root container element.
 * @cssprop --avatar-size
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --icon-button-space
 * @cssprop --icon-size
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-tracking
 * @cssprop --label-color
 * @cssprop --leading-icon-color
 * @cssprop --leading-space
 * @cssprop --subtitle
 * @cssprop --subtitle-axes
 * @cssprop --subtitle-color
 * @cssprop --subtitle-tracking
 * @cssprop --title
 * @cssprop --title-axes
 * @cssprop --title-color
 * @cssprop --title-tracking
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-space
 */
export class AppBarElement extends LitElement {
  static override styles: CSSResultOrNative[] = [
    appBarStyles,
    css`
      :host {
        display: flex;
        width: 100%;
        position: relative;
      }
    `,
  ];

  /** The size of the app bar (`sm`, `md`, `lg`). Defaults to `sm`. */
  @property({reflect: true}) size: AppBarSize = 'sm';

  /** The behavioral variant of the app bar (`standard` or `search`). Defaults to `standard`. */
  @property({reflect: true}) variant: AppBarVariant = 'standard';

  /** Whether the app bar is in its scrolled state. Defaults to `false`. */
  @property({type: Boolean, reflect: true}) scrolled = false;

  @state() private hasSubtitle = false;

  protected override render() {
    const withSubtitle = this.size !== 'sm' && this.hasSubtitle;
    const directive = appBar({
      size: this.size,
      withSubtitle,
      variant: this.variant,
      scrolled: this.scrolled,
    });

    if (this.variant === 'search') {
      return html`<div part="app-bar" class="${directive}">
        <div class="app-bar-leading">
          <slot name="leading"></slot>
        </div>
        <div class="app-bar-search-container">
          <slot name="search"></slot>
        </div>
        <div class="app-bar-trailing">
          <slot name="trailing"></slot>
        </div>
      </div>`;
    }

    if (this.size !== 'sm') {
      return html`<div part="app-bar" class="${directive}">
        <div class="app-bar-top-row">
          <div class="app-bar-leading">
            <slot name="leading"></slot>
          </div>
          <div class="app-bar-trailing">
            <slot name="trailing"></slot>
          </div>
        </div>
        <div class="app-bar-bottom-row">
          <div class="app-bar-title-wrapper">
            <div class="app-bar-title">
              <slot></slot>
            </div>
            <div
              class="app-bar-subtitle"
              style="${withSubtitle ? '' : 'display: none;'}">
              <slot
                name="subtitle"
                @slotchange=${this.handleSubtitleSlotChange}></slot>
            </div>
          </div>
        </div>
      </div>`;
    }

    return html`<div part="app-bar" class="${directive}">
      <div class="app-bar-leading">
        <slot name="leading"></slot>
      </div>
      <div class="app-bar-title-wrapper">
        <div class="app-bar-title">
          <slot></slot>
        </div>
      </div>
      <div class="app-bar-trailing">
        <slot name="trailing"></slot>
      </div>
    </div>`;
  }

  private handleSubtitleSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasSubtitle = slot.assignedNodes({flatten: true}).length > 0;
  }
}
