/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';
import {hasSlotted} from '../shared/has-slotted.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import listStyles from './list.css' with {type: 'css'}; // github-only
// import {styles as listStyles} from './list.cssresult.js'; // google3-only

import {listItem} from './list.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(mixinElementInternals(LitElement));

/**
 * A Material Design list item component.
 *
 * @slot - Used to display the item's primary label.
 * @slot avatar - Used to display a circular avatar before the item's content.
 * @slot leading - Used to display icons and content before the item's main content.
 * @slot overline - Used to display overline text above the main label.
 * @slot supporting-text - Used to display supporting text below the main label.
 * @slot trailing-text - Used to display metadata or text after the item's main content.
 * @slot trailing - Used to display icons and content after the item's main content.
 * @csspart list-item - The list item's root element.
 * @cssprop --container-height
 * @cssprop --container-color
 * @cssprop --container-shape
 * @cssprop --label-text-color
 * @cssprop --label-text
 * @cssprop --label-text-tracking
 * @cssprop --leading-space
 * @cssprop --trailing-space
 * @cssprop --between-space
 * @cssprop --top-space
 * @cssprop --bottom-space
 * @cssprop --avatar-size
 * @cssprop --avatar-shape
 * @cssprop --avatar-color
 * @cssprop --avatar-label
 * @cssprop --avatar-label-tracking
 * @cssprop --avatar-label-color
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-size
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-size
 * @cssprop --overline
 * @cssprop --overline-tracking
 * @cssprop --overline-color
 * @cssprop --supporting-text
 * @cssprop --supporting-text-tracking
 * @cssprop --supporting-text-color
 * @cssprop --trailing-supporting-text
 * @cssprop --trailing-supporting-text-tracking
 * @cssprop --trailing-supporting-text-color
 */
export class ListItemElement extends baseClass {
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
