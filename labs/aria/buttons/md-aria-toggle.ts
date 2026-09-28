/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultGroup} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {AriaToggleElement, isToggleDisabled, isTogglePressed} from './toggle.js';

declare global {
  interface HTMLElementTagNameMap {
    /** An ARIA toggle button element. */
    'md-aria-toggle': MdAriaToggleElement;
  }
}

/**
 * An ARIA toggle button element with default properties and styles.
 */
@customElement('md-aria-toggle')
export class MdAriaToggleElement extends AriaToggleElement {
  static override styles: CSSResultGroup = [
    AriaToggleElement.styles,
    css`
      :host {
        background-color: ButtonFace;
        color: ButtonText;
      }
      :host(:state(selected)) {
        background-color: SelectedItem;
        color: SelectedItemText;
      }
      :host(:focus-visible) {
        outline: 2px solid AccentColor;
        outline-offset: 2px;
      }
      :host(:state(disabled)) {
        opacity: 38%;
      }
    `,
  ];

  /**
   * Whether the toggle button is selected.
   */
  @property({type: Boolean, reflect: true})
  get selected(): boolean {
    return this[isTogglePressed];
  }
  set selected(value: boolean) {
    const oldValue = this.selected;
    this[isTogglePressed] = value;
    this.requestUpdate('selected', oldValue); // Remove when Lit 2 support is dropped.
  }

  /**
   * Whether the toggle button is disabled.
   */
  @property({type: Boolean, reflect: true})
  get disabled(): boolean {
    return this[isToggleDisabled];
  }
  set disabled(value: boolean) {
    const oldValue = this.disabled;
    this[isToggleDisabled] = value;
    this.requestUpdate('disabled', oldValue); // Remove when Lit 2 support is dropped.
  }
}
