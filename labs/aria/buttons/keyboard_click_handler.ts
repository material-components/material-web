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

  // Tracks whether Space was pressed down on this element without being vetoed.
  let spaceKeyDown = false;

  // Intercepts event dispatch to allow `afterDispatch` callbacks to run after
  // the event has completely finished bubbling.
  setupDispatchHooks(element, 'keydown', 'keyup');

  const onKeyDown = (event: KeyboardEvent) => {
    if (isDisabled()) {
      return;
    }

    if (event.key === ' ') {
      // Space natively scrolls the page unless prevented synchronously on
      // keydown. Check if an earlier/capture-phase listener already vetoed the
      // event before preventing default scroll behavior.
      const wasPrevented = event.defaultPrevented;
      event.preventDefault();
      if (!wasPrevented) {
        spaceKeyDown = true;
      }
    } else if (event.key === 'Enter') {
      // Enter activates on keydown, but defer click until after dispatch so
      // listeners can veto via preventDefault() or disable the element.
      afterDispatch(event, () => {
        if (!event.defaultPrevented && !isDisabled()) {
          element.click();
        }
      });
    }
  };

  const onKeyUp = (event: KeyboardEvent) => {
    if (event.key !== ' ') {
      return;
    }

    // Space activates on keyup. Defer click until after dispatch so keyup
    // listeners can veto via preventDefault().
    afterDispatch(event, () => {
      const wasPressed = spaceKeyDown;
      spaceKeyDown = false;

      if (!event.defaultPrevented && !isDisabled() && wasPressed) {
        element.click();
      }
    });
  };

  // Reset pressed state if focus leaves the element before keyup.
  const onBlur = () => {
    spaceKeyDown = false;
  };

  const controller = new AbortController();
  element.addEventListener('keydown', onKeyDown, {signal: controller.signal});
  element.addEventListener('keyup', onKeyUp, {signal: controller.signal});
  element.addEventListener('blur', onBlur, {signal: controller.signal});

  return () => {
    controller.abort();
  };
}
