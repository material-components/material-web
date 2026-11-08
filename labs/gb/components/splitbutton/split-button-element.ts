/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
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

/**
 * A Material Design split button component.
 *
 * @slot leading - Requires a `<button>` for the main action.
 * @slot trailing - Requires a `<button>` for the menu action. Use `popovertarget` to display a menu.
 * @slot - Used to render the trailing button's popover menu.
 * @csspart split-btn - The split button's root element.
 * @csspart leading-btn - The split button's main action.
 * @csspart trailing-btn - The split button's menu action.
 * @cssprop --between-space
 * @cssprop --icon-size
 * @cssprop --inner-corner-size
 * @cssprop --outer-corner-size
 * @cssprop --leading-space
 * @cssprop --trailing-space
 */
export class SplitButtonElement extends LitElement {
  /** @nocollapse */
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
        /* Contains the slots' touch targets (::before, absolute). The leading
           slot is display: contents, so without this its touch target sizes
           against the viewport and covers the page. */
        position: relative;
      }
      /* The menu icon is the trailing slot's ::after, painted over the
         slotted button: clicks pass through to the button. */
      [name='trailing']::after {
        pointer-events: none;
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
        @focusout=${this.updateSlotFocusVisible}
        @click=${this.forwardSlotClick}>
      </slot>
      <slot
        name="trailing"
        part="trailing-btn"
        class="${button(buttonConfig)}"
        @focusin=${this.updateSlotFocusVisible}
        @focusout=${this.updateSlotFocusVisible}
        @click=${this.forwardSlotClick}
        @slotchange=${this.handleTrailingSlotchange}>
      </slot>
      <slot></slot>
    </div>`;
  }

  /**
   * A click on a slot's own box (its 48dp touch target, outside the slotted
   * button) activates that slot's button, as a tap on the touch target of a
   * button does.
   */
  private forwardSlotClick(event: MouseEvent) {
    const slot = event.currentTarget as HTMLSlotElement;
    if (event.target !== slot) return;
    const target = slot
      .assignedElements()
      .find((el): el is HTMLButtonElement => el.matches('button'));
    if (!target || target.disabled) return;
    event.stopPropagation();
    target.click();
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
