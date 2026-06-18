/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {button} from '../button/button.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import buttonStyles from '../button/button.css' with {type: 'css'}; // github-only
// import buttonStyles from '../button/button.cssresult.js'; // google3-only
import splitButtonStyles from './split-button.css' with {type: 'css'}; // github-only
// import {styles as splitButtonStyles} from './split-button.cssresult.js'; // google3-only

import {
  splitButton,
  type SplitButtonColor,
  type SplitButtonSize,
} from './split-button.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design split button component. */
    'md-split-button': SplitButton;
  }
}

/**
 * A Material Design split button component.
 *
 * @slot leading - The main action content of the split button.
 * @slot trailing - The trailing action content of the split button.
 * @slot - The label of the split button.
 */
@customElement('md-split-button')
export class SplitButton extends LitElement {
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    buttonStyles,
    splitButtonStyles,
    css`
      :host {
        display: inline-flex;
      }
      .split-btn {
        flex: 1;
      }
      [name='leading'] {
        display: contents;
        &::slotted(button) {
          all: inherit;
          display: flex;
        }
      }
      [name='trailing'] {
        position: relative;
        &::slotted(button) {
          position: absolute;
          inset: 0;
          appearance: none;
          background: none;
          border: none;
          outline: none;
        }
      }
    `,
  ];

  @property() color: SplitButtonColor = 'filled';
  @property() size: SplitButtonSize = 'sm';
  @property({type: Boolean}) selected = false;

  protected override render() {
    const buttonConfig = {
      color: this.color,
      size: this.size,
    };

    return html`<div part="split-btn" class="${splitButton(this)}">
      <slot
        name="leading"
        part="leading-btn"
        class="${button(buttonConfig)}"
        @focusin=${this.updateSlotFocusVisible}
        @focusout=${this.updateSlotFocusVisible}>
      </slot>
      <slot
        name="trailing"
        part="trailing-btn"
        class="${button(buttonConfig)}"
        @focusin=${this.updateSlotFocusVisible}
        @focusout=${this.updateSlotFocusVisible}
        @slotchange=${this.handleTrailingSlotchange}>
      </slot>
      <slot></slot>
    </div>`;
  }

  private updateSlotFocusVisible(event: Event) {
    const slot = event.currentTarget as HTMLSlotElement;
    const hasFocusVisible = slot
      .assignedElements()
      .some((el) => el.matches(':focus-visible,:has(:focus-visible)'));
    slot.classList.toggle('focus-visible', hasFocusVisible);
  }

  private cleanupToggleListener?: AbortController;
  private handleTrailingSlotchange(event: Event) {
    this.cleanupToggleListener?.abort();
    this.cleanupToggleListener = new AbortController();
    const slot = event.target as HTMLSlotElement;
    const trailingButton = slot
      .assignedElements()
      .find((el): el is HTMLButtonElement => el.matches('button'));
    if (!trailingButton?.popoverTargetElement) return;
    trailingButton.popoverTargetElement.addEventListener(
      'toggle',
      (event: Event) => {
        this.selected = (event as ToggleEvent).newState === 'open';
      },
      {signal: this.cleanupToggleListener.signal},
    );
  }
}
