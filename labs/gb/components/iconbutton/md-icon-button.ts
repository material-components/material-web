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

import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js';
import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.cssresult.js';
import iconButtonStyles from './icon-button.cssresult.js';

import type {
  IconButtonColor,
  IconButtonSize,
  IconButtonWidth,
} from './icon-button.js';
import {iconButton} from './icon-button.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design icon button component. */
    'md-icon-button': IconButton;
  }
}

const baseClass = mixinDelegatesAria(
  mixinFormSubmitter(mixinFormAssociated(mixinElementInternals(LitElement))),
);

/**
 * A Material Design icon button component.
 */
@customElement('md-icon-button')
export class IconButton extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    css`
      :host {
        display: inline-flex;
      }
      .icon-btn {
        flex: 1;
      }
    `,
  ];

  /**
   * The color of the button.
   */
  @property() color: IconButtonColor = 'standard';

  /**
   * The size of the button.
   */
  @property() size: IconButtonSize = 'sm';

  /**
   * Changes the shape of the button to be square.
   */
  @property({type: Boolean}) square = false;

  /**
   * Changes the width of the button.
   */
  @property() width: IconButtonWidth = '';

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
   */
  @property() download = '';

  /**
   * Where to display the linked `href` URL for a link button.
   */
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  protected override render() {
    const classes = iconButton({
      color: this.color,
      size: this.size,
      width: this.width,
      square: this.square,
      disabled: this.softDisabled,
    });

    const {ariaLabel, ariaHasPopup, ariaExpanded} = this as ARIAMixinStrict;
    if (this.type === 'link') {
      return html`<a
        part="icon-btn"
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
      part="icon-btn"
      class=${classes}
      type="button"
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
