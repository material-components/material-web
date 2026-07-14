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
  PropertyValues,
} from 'lit';
import {property, state} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {ripple} from '../ripple/ripple.js';
import {hasSlotted} from '../shared/has-slotted.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import cardStyles from './card.css' with {type: 'css'}; // github-only
// import cardStyles from './card.cssresult.js'; // google3-only

import {type CardColor, card} from './card.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(LitElement);

/**
 * A Material Design card.
 *
 * @slot - Used to display the card's content. Note: add padding to content, not the host <md-gb-card> element.
 * @slot container - Used to set a custom background container for the card.
 * @csspart card - The card's root element.
 * @csspart card-btn - The card's main action button, when interactive.
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --outline-color
 * @cssprop --outline-width
 * @cssprop --state-layer-color
 */
export class CardElement extends baseClass {
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
        isolation: isolate;
      }
      .card {
        flex: 1;
        position: relative;
      }
      .card:has([name='container'].has-slotted) {
        background-color: transparent;
      }
      .card.card-hide-outline {
        --outline-color: transparent;
        --container-elevation: var(--md-sys-elevation-shadow-0);
      }
      slot[name='container'] {
        display: block;
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        --color: var(--container-color);
        z-index: -1;
        transition: inherit;
      }
      slot[name='container']::slotted(*) {
        width: 100%;
        height: 100%;
      }
    `,
  ];

  @state() private hideOutline = false;

  private lastFiredEnabledState?: boolean;

  /** The color of the card. */
  @property() color: CardColor = 'outlined';

  /** Whether the card is disabled. */
  @property({type: Boolean}) disabled = false;

  /** Whether the card is interactive. */
  @property({type: Boolean}) interactive = false;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('md-gb:set-show-outline', this.handleSetShowOutline);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      'md-gb:set-show-outline',
      this.handleSetShowOutline,
    );
  }

  private readonly handleSetShowOutline = (event: Event) => {
    const customEvent = event as CustomEvent<{shown: boolean}>;
    this.hideOutline = !customEvent.detail.shown;
  };

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('disabled')) {
      this.dispatchSetEnabledEvent();
    }
  }

  private dispatchSetEnabledEvent() {
    const enabled = !this.disabled;

    if (this.lastFiredEnabledState === enabled) return;

    const slot = this.shadowRoot?.querySelector(
      'slot[name="container"]',
    ) as HTMLSlotElement;
    if (slot) {
      for (const element of slot.assignedElements({flatten: true})) {
        element.dispatchEvent(
          new CustomEvent('md-gb:set-enabled', {
            detail: {enabled},
          }),
        );
      }
    }
    this.lastFiredEnabledState = enabled;
  }

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`<div
      part="card"
      class="${card({
        color: this.color,
        disabled: this.disabled,
        interactive: this.interactive,
        classes: {
          'card-hide-outline': this.hideOutline,
        },
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
      <slot
        name="container"
        ${hasSlotted()}
        @slotchange=${this.handleContainerSlotChange}></slot>
    </div>`;
  }

  private handleContainerSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;

    const enabled = !this.disabled;

    for (const element of slot.assignedElements({flatten: true})) {
      element.dispatchEvent(new CustomEvent('md-gb:change-container-slot'));
      element.dispatchEvent(
        new CustomEvent('md-gb:set-enabled', {
          detail: {enabled},
        }),
      );
    }
  }
}
