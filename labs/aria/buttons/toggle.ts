/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultGroup, html, isServer, LitElement} from 'lit';

import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {
  mixinCustomStateSet,
  toggleState,
} from '../../behaviors/custom-state-set.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {isFocusable, mixinFocusable} from '../../behaviors/focusable.js';
import {setupKeyboardClickHandler} from './keyboard_click_handler.js';

const baseClass = mixinFocusable(
  mixinCustomStateSet(mixinElementInternals(LitElement)),
);

/**
 * A unique symbol used to check if the toggle button is disabled.
 */
export const isToggleDisabled = Symbol('isToggleDisabled');

/**
 * A unique symbol used to check if the toggle button is pressed.
 */
export const isTogglePressed = Symbol('isTogglePressed');

/**
 * An ARIA toggle button element.
 *
 * @fires {InputEvent} input - Fired when the toggle button is pressed or unpressed. --bubbles --composed
 * @fires {Event} change - Fired when the toggle button is pressed or unpressed. --bubbles
 * @cssstate selected - Whether the toggle button is selected.
 * @cssstate enabled - True when the toggle button is enabled.
 * @cssstate disabled - True when the toggle button is disabled.
 */
export class AriaToggleElement extends baseClass {
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      user-select: none;
    }
    :host(:state(enabled)) {
      cursor: pointer;
    }
  `;

  /**
   * Whether the toggle button is selected.
   */
  get [isTogglePressed](): boolean {
    return this[internals].ariaPressed === 'true';
  }
  set [isTogglePressed](value: boolean) {
    value = Boolean(value); // coerce for safety
    this[internals].ariaPressed = String(value);
    this[toggleState]('selected', value);
  }

  /**
   * Whether the toggle button is disabled.
   */
  get [isToggleDisabled](): boolean {
    return this[internals].ariaDisabled === 'true';
  }
  set [isToggleDisabled](value: boolean) {
    value = Boolean(value); // coerce for safety
    this[internals].ariaDisabled = String(value);
    this[toggleState]('disabled', value);
    this[toggleState]('enabled', !value);
    this[isFocusable] = !value;
  }

  constructor() {
    super();
    if (isServer) return;

    this[internals].role = 'button';
    this[isTogglePressed] = false;
    this[isToggleDisabled] = false;

    setupDispatchHooks(this, 'click');
    setupKeyboardClickHandler(this);

    this.addEventListener(
      'click',
      (event: MouseEvent) => {
        if (this[isToggleDisabled]) {
          event.stopImmediatePropagation();
          event.preventDefault();
          return;
        }

        const wasPressed = this[isTogglePressed];
        this[isTogglePressed] = !wasPressed;
        afterDispatch(event, () => {
          if (event.defaultPrevented) {
            this[isTogglePressed] = wasPressed;
            return;
          }

          this.dispatchEvent(
            new InputEvent('input', {bubbles: true, composed: true}),
          );
          this.dispatchEvent(new Event('change', {bubbles: true}));
        });
      },
      {capture: true},
    );
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
