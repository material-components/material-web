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
} from 'lit';
import {property} from 'lit/decorators.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import toolbarStyles from './toolbar.css' with {type: 'css'}; // github-only
// import toolbarStyles from './toolbar.cssresult.js'; // google3-only

/**
 * A Material Design gBreeze toolbar button custom element (`md-gb-toolbar-button`).
 *
 * @slot - Used to display a text label.
 * @slot icon - Used to display a custom icon element.
 * @fires {Event} change - Fired when a toggle button's selection state changes. --bubbles
 * @fires {InputEvent} input - Fired when a toggle button's selection state changes. --bubbles --composed
 * @csspart btn - The button's root container.
 */
export class ToolbarButtonElement extends LitElement {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    toolbarStyles,
    css`
      :host {
        box-sizing: border-box;
        display: inline-flex;
        position: relative;
        vertical-align: middle;
      }
    `,
  ];

  /** Whether the toolbar button is selected or active. */
  @property({type: Boolean, reflect: true}) selected = false;

  /** Alias for `selected` property. */
  get active(): boolean {
    return this.selected;
  }
  set active(value: boolean) {
    this.selected = value;
  }

  /** Whether the button behaves as a toggle switch. */
  @property({type: Boolean}) toggle = false;

  /** Whether the button is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** Optional Material Symbol icon string identifier. */
  @property({type: String}) icon = '';

  /** Optional text label for the button. */
  @property({type: String}) label = '';

  /** Optional accessible aria-label. */
  @property({attribute: 'aria-label'}) override ariaLabel = '';

  protected handleClick(event: MouseEvent) {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (this.toggle) {
      this.selected = !this.selected;
      this.dispatchEvent(new Event('change', {bubbles: true}));
      this.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}),
      );
    }
  }

  protected override render() {
    const isIconButton =
      this.tagName.toLowerCase() === 'md-gb-toolbar-icon-button';
    const hasLabel = !isIconButton;
    const accessibleLabel =
      this.ariaLabel || this.label || this.icon || undefined;

    return html`
      <button
        part="btn"
        class="toolbar-btn ${this.selected ? 'selected' : ''} ${hasLabel ? 'has-label' : 'icon-only'}"
        ?disabled=${this.disabled}
        aria-pressed=${this.toggle ? (this.selected ? 'true' : 'false') : nothing}
        aria-label=${accessibleLabel || nothing}
        @click=${this.handleClick}>
        <slot name="icon">
          ${this.icon
            ? html`<span class="toolbar-btn-icon md-icon">${this.icon}</span>`
            : nothing}
        </slot>
        ${hasLabel
          ? html`<span class="toolbar-btn-label">
              <slot>${this.label}</slot>
            </span>`
          : nothing}
      </button>
    `;
  }
}

/**
 * A Material Design gBreeze toolbar icon button (`md-gb-toolbar-icon-button`).
 */
export class ToolbarIconButtonElement extends ToolbarButtonElement {
  protected override render() {
    const accessibleLabel =
      this.ariaLabel || this.icon || undefined;

    return html`
      <button
        part="btn"
        class="toolbar-btn ${this.selected ? 'selected' : ''} icon-only"
        ?disabled=${this.disabled}
        aria-pressed=${this.toggle ? (this.selected ? 'true' : 'false') : nothing}
        aria-label=${accessibleLabel || nothing}
        @click=${this.handleClick}>
        <slot name="icon">
          ${this.icon
            ? html`<span class="toolbar-btn-icon md-icon">${this.icon}</span>`
            : nothing}
        </slot>
      </button>
    `;
  }
}
