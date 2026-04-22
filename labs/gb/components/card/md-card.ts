/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIAMixinStrict} from '@material/web/internal/aria/aria.js';
import {mixinDelegatesAria} from '@material/web/internal/aria/delegate.js';
import {ripple} from '@material/web/labs/gb/components/ripple/ripple.js';
import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.cssresult.js'; // google3-only
import cardStyles from './card.css' with {type: 'css'}; // github-only
// import cardStyles from './card.cssresult.js'; // google3-only

import {type CardColor, card} from './card.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design card component. */
    'md-card': Card;
  }
}

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design card.
 */
@customElement('md-card')
export class Card extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    cardStyles,
    css`
      :host {
        display: inline-flex;
      }
      .card {
        flex: 1;
      }
    `,
  ];

  /** The color of the card. */
  @property() color: CardColor = 'outlined';

  /** Whether the card is disabled. */
  @property({type: Boolean}) disabled = false;

  /** Whether the card is interactive. */
  @property({type: Boolean}) interactive = false;

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<div
      part="card"
      class="${card({
        color: this.color,
        disabled: this.disabled,
        interactive: this.interactive,
      })}">
      ${this.interactive
        ? html`<button
            part="card-btn"
            class="card-btn ripple focus-ring-target"
            ${ripple()}
            ?disabled="${this.disabled}"
            aria-label="${ariaLabel || nothing}"></button>`
        : nothing}
      <slot></slot>
    </div>`;
  }
}
