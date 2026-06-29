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
import {customElement, property, state} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {redispatchEvent} from '../../../../internal/events/redispatch-event.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {mixinFormAssociated} from '../../../behaviors/form-associated.js';
import {mixinFormSubmitter} from '../../../behaviors/form-submitter.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only

import {hasSlotted} from '../shared/has-slotted.js';

import buttonStyles from './button.css' with {type: 'css'}; // github-only
// import buttonStyles from './button.cssresult.js'; // google3-only

import {button} from './button.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design button. */
    'md-gb-button': Button;
  }
}

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(LitElement))),
);

/**
 * A Material Design button.
 *
 * @slot - Used to display a label and optional icon.
 * @slot container - Used to set a custom background container for the button.
 * @fires {InputEvent} input - Fired when a toggle button is selected or unselected. --bubbles --composed
 * @fires {Event} change - Fired when a toggle button is selected or unselected. --bubbles
 * @csspart btn - The button's root element.
 * @cssprop --container-color
 * @cssprop --container-height
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --outline-width
 * @cssprop --outline-color
 * @cssprop --icon-label-space
 * @cssprop --icon-color
 * @cssprop --icon-size
 * @cssprop --label-text
 * @cssprop --label-text-tracking
 * @cssprop --label-text-color
 * @cssprop --leading-space
 * @cssprop --state-layer-color
 * @cssprop --trailing-space
 */
@customElement('md-gb-button')
export class Button extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    buttonStyles,
    css`
      :host {
        display: inline-flex;
        isolation: isolate;
      }
      .btn {
        flex: 1;
        position: relative;
      }
      .btn:has([name='container'].has-slotted) {
        background-color: transparent;
      }
      .btn.btn-hide-outline {
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

  /**
   * The color of the button.
   */
  @property()
  color: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text' = 'text';

  /**
   * The size of the button.
   */
  @property() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'sm';

  /**
   * Changes the shape of the button to be square.
   */
  @property({type: Boolean}) square = false;

  /**
   * A string indicating the behavior of the button.
   *
   * - "submit" (default): A button that submits its associated form.
   * - "reset": A button that resets its associated form.
   * - "button": A normal button.
   * - "toggle": A toggle button using the `selected` property.
   * - "link": An anchor link (`<a>`). Type is always "link" when `href` is set.
   */
  @property({noAccessor: true})
  override get type(): string {
    return this.href ? 'link' : super.type;
  }
  override set type(type: string) {
    if (this.href && type !== 'link') {
      return;
    }
    super.type = type;
  }

  /**
   * Whether or not the button is "soft-disabled" (disabled but still
   * focusable).
   *
   * Use this when a button needs increased visibility when disabled. See
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_disabled_controls
   * for more guidance on when this is needed.
   */
  @property({type: Boolean, attribute: 'soft-disabled', reflect: true})
  softDisabled = false;

  /**
   * Whether or not the button is selected, when `type="toggle"`.
   */
  @property({type: Boolean}) selected = false;

  /**
   * The URL that the link button points to.
   */
  @property() href = '';

  /**
   * The filename to use when downloading the linked resource.
   * If not specified, the browser will determine a filename.
   * This is only applicable when the button is used as a link (`href` is set).
   */
  @property() download = '';

  /**
   * Where to display the linked `href` URL for a link button. Common options
   * include `_blank` to open in a new tab.
   */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  private lastFiredEnabledState?: boolean;

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
    if (
      changedProperties.has('disabled') ||
      changedProperties.has('softDisabled')
    ) {
      this.dispatchSetEnabledEvent();
    }
  }

  private dispatchSetEnabledEvent() {
    const enabled = !(this.disabled || this.softDisabled);

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
    const classes = button({
      color: this.color,
      size: this.size,
      square: this.square,
      // Emulate `:disabled` when soft-disabled
      disabled: this.softDisabled,
      classes: {
        'btn-hide-outline': this.hideOutline,
      },
    });

    // Needed for closure conformance
    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    if (this.type === 'link') {
      return html`<a
        part="btn"
        class=${classes}
        href=${this.href}
        download=${this.download || nothing}
        target=${this.target || nothing}
        aria-label=${ariaLabel || nothing}
        aria-haspopup=${ariaHasPopup || nothing}
        aria-expanded=${ariaExpanded || nothing}
        aria-disabled=${this.disabled || this.softDisabled || nothing}
        tabindex=${this.disabled && !this.softDisabled ? -1 : nothing}>
        <slot></slot>
        <slot
          name="container"
          ${hasSlotted()}
          @slotchange=${this.handleContainerSlotChange}></slot>
      </a>`;
    }

    return html`<button
      part="btn"
      class=${classes}
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || nothing}
      aria-label=${ariaLabel || nothing}
      aria-pressed=${this.type === 'toggle' ? this.selected : nothing}
      aria-haspopup=${ariaHasPopup || nothing}
      aria-expanded=${ariaExpanded || nothing}
      @change=${this.handleChange}>
      <slot></slot>
      <slot
        name="container"
        ${hasSlotted()}
        @slotchange=${this.handleContainerSlotChange}></slot>
    </button>`;
  }

  private handleContainerSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;

    const enabled = !(this.disabled || this.softDisabled);

    for (const element of slot.assignedElements({flatten: true})) {
      element.dispatchEvent(new CustomEvent('md-gb:change-container-slot'));
      element.dispatchEvent(
        new CustomEvent('md-gb:set-enabled', {
          detail: {enabled},
        }),
      );
    }
  }

  private handleChange(event: Event) {
    this.selected = (event.target as HTMLElement).ariaPressed === 'true';
    redispatchEvent(this, event);
  }
}
