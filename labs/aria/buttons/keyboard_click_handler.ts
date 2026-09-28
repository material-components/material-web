/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {isDisabled as defaultIsDisabled} from '../pseudo-classes.js';

/**
 * Options for configuring keyboard click handling.
 */
export interface KeyboardClickHandlerOptions {
  /**
   * Optional function to determine if the element is disabled.
   *
   * Defaults to checking for disabled attributes or pseudo-classes.
   */
  isDisabled?: () => boolean;
}

/**
 * Sets up button-like keyboard click activation for an element (Enter on
 * keydown, Space on keyup).
 *
 * @param element The target HTMLElement.
 * @param options Additional setup options.
 * @return A cleanup function that removes all registered listeners.
 */
export function setupKeyboardClickHandler(
  element: HTMLElement,
  options?: KeyboardClickHandlerOptions,
): () => void {
  const isDisabled = options?.isDisabled ?? (() => defaultIsDisabled(element));

  // Tracks whether Space was pressed down on this element.
  let isSpacePressed = false;

  // Intercepts event dispatch to allow `afterDispatch` callbacks to run after
  // the event has completely finished bubbling.
  setupDispatchHooks(element, 'keydown', 'keyup');

  const isSpace = (event: KeyboardEvent) => event.key === ' ';
  const isEnter = (event: KeyboardEvent) => event.key === 'Enter';

  const onKeyDown = (event: KeyboardEvent) => {
    if (!(isSpace(event) || isEnter(event)) || isDisabled()) {
      return;
    }

    // Defer activation until after dispatch so keydown listeners can cancel
    // via preventDefault().
    afterDispatch(event, () => {
      if (event.defaultPrevented) {
        return;
      }

      if (isSpace(event)) {
        // Space activates on keyup, record that it is currently pressed.
        isSpacePressed = true;
        // Space natively scrolls the page unless prevented synchronously on
        // keydown.
        event.preventDefault();
      } else if (isEnter(event)) {
        // Enter activates on keydown.
        element.click();
      }
    });
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (!isSpace(event) || isDisabled()) {
      return;
    }

    // Space activates on keyup. Defer click until after dispatch so keyup
    // listeners can cancel via preventDefault().
    afterDispatch(event, () => {
      const wasSpacePressed = isSpacePressed;
      isSpacePressed = false;

      if (!event.defaultPrevented && wasSpacePressed) {
        element.click();
      }
    });
  };

  // Reset pressed state if focus leaves the element before keyup.
  const onBlur = () => {
    isSpacePressed = false;
  };

  const controller = new AbortController();
  element.addEventListener('keydown', onKeyDown, {signal: controller.signal});
  element.addEventListener('keyup', onKeyUp, {signal: controller.signal});
  element.addEventListener('blur', onBlur, {signal: controller.signal});

  return () => {
    controller.abort();
  };
}
