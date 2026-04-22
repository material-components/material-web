/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIAMixinStrict} from '@material/web/internal/aria/aria.js';
import {mixinDelegatesAria} from '@material/web/internal/aria/delegate.js';
import {
  internals,
  mixinElementInternals,
} from '@material/web/labs/behaviors/element-internals.js';
import {hasSlotted} from '@material/web/labs/gb/components/shared/has-slotted.js';
import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '@material/web/labs/gb/components/ripple/ripple.cssresult.js'; // google3-only
import listStyles from './list.css' with {type: 'css'}; // github-only
// import {styles as listStyles} from './list.cssresult.js'; // google3-only

import {listItem} from './list.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design list item component. */
    'md-list-item': ListItem;
  }
}

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(mixinElementInternals(LitElement));

/**
 * A Material Design list item component.
 */
@customElement('md-list-item')
export class ListItem extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    listStyles,
    css`
      :host {
        display: flex;
        align-items: center;
      }
      .list-item {
        flex: 1;
        align-items: inherit;
      }
      :is(.list-item-leading, .list-item-trailing):not(:has(.has-slotted)) {
        display: none;
      }
      slot:not(.has-slotted) {
        display: contents;
      }
    `,
  ];

  constructor() {
    super();
    this[internals].role = 'listitem';
  }

  /**
   * Whether the list item is selected.
   */
  @property({type: Boolean}) checked = false;

  /**
   * Whether the list item is disabled.
   */
  @property({type: Boolean}) disabled = false;

  /**
   * Whether the list item is non-interactive.
   */
  @property({type: Boolean, reflect: true, attribute: 'static'})
  nonInteractive = false;

  protected override render() {
    const state = {
      checked: this.checked,
      disabled: this.disabled,
      static: this.nonInteractive,
    };
    if (this.nonInteractive) {
      return html`<div part="list-item" class="${listItem(state)}"
        >${this.renderContent()}</div
      >`;
    }

    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<button
      part="list-item"
      class="${listItem(state)}"
      ?disabled=${this.disabled}
      aria-label=${ariaLabel || nothing}>
      ${this.renderContent()}
    </button>`;
  }

  private renderContent() {
    return html`
      <span class="list-item-leading">
        <slot name="avatar" class="list-item-avatar" ${hasSlotted()}></slot>
        <slot name="leading" ${hasSlotted()}></slot>
      </span>
      <span class="list-item-content">
        <slot name="overline" class="list-item-overline"></slot>
        <slot></slot>
        <slot name="supporting-text" class="list-item-supporting-text"></slot>
      </span>
      <span class="list-item-trailing">
        <slot
          name="trailing-text"
          class="list-item-trailing-text"
          ${hasSlotted()}></slot>
        <slot name="trailing" ${hasSlotted()}></slot>
      </span>
    `;
  }
}
