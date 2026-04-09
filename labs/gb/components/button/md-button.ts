/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIAMixinStrict} from '@material/web/internal/aria/aria.js';
import {mixinDelegatesAria} from '@material/web/internal/aria/delegate.js';
import {redispatchEvent} from '@material/web/internal/events/redispatch-event.js';
import {mixinElementInternals} from '@material/web/labs/behaviors/element-internals.js';
import {mixinFormAssociated} from '@material/web/labs/behaviors/form-associated.js';
import {mixinFormSubmitter} from '@material/web/labs/behaviors/form-submitter.js';
import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.cssresult.js'; // google3-only
import buttonStyles from './button.css' with {type: 'css'}; // github-only
// import buttonStyles from './button.cssresult.js'; // google3-only

import {button} from './button.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design button. */
    'md-button': Button;
  }
}

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(LitElement))),
);

/**
 * A Material Design button.
 */
@customElement('md-button')
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
      }
      .btn {
        flex: 1;
      }
    `,
  ];

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

  protected override render() {
    const classes = button({
      color: this.color,
      size: this.size,
      square: this.square,
      // Emulate `:disabled` when soft-disabled
      disabled: this.softDisabled,
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
    </button>`;
  }

  private handleChange(event: Event) {
    this.selected = (event.target as HTMLElement).ariaPressed === 'true';
    redispatchEvent(this, event);
  }
}
