/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  afterDispatch,
  setupDispatchHooks,
} from '@material/web/internal/events/dispatch-hooks.js';
import {focusRingClasses} from '@material/web/labs/gb/components/focus/focus-ring.js';
import {
  rippleClasses,
  setupRipple,
} from '@material/web/labs/gb/components/ripple/ripple.js';
import {createClassMapDirective} from '@material/web/labs/gb/components/shared/directives.js';
import {
  PSEUDO_CLASSES,
  isDisabled,
} from '@material/web/labs/gb/components/shared/pseudo-classes.js';
import {type ClassInfo} from 'lit/directives/class-map.js';

/** Switch classes. */
export const SWITCH_CLASSES = {
  switch: 'switch',
  checked: PSEUDO_CLASSES.checked,
  hover: PSEUDO_CLASSES.hover,
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `switchClasses()` function. */
export interface SwitchClassesState {
  /** Emulates `:checked`. */
  checked?: boolean;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the switch classes to apply to an element based on the given state.
 *
 * @param state The state of the switch.
 * @return An object of class names and truthy values if they apply.
 */
export function switchClasses({
  checked = false,
  hover = false,
  active = false,
  disabled = false,
}: SwitchClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [SWITCH_CLASSES.switch]: true,
    [SWITCH_CLASSES.checked]: checked,
    [SWITCH_CLASSES.hover]: hover,
    [SWITCH_CLASSES.active]: active,
    [SWITCH_CLASSES.disabled]: disabled,
  };
}

/**
 * Sets up switch functionality for the given element.
 *
 * @param switchEl The element on which to set up switch functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupSwitch(
  switchEl: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const isButton = switchEl.matches('button');
  if (isButton) {
    // Only setup dispatch hooks if we add a button click listener, but call it
    // before setupRipple() adds its click listener.
    setupDispatchHooks(switchEl, 'click');
  }

  setupRipple(switchEl, opts);
  if (!isButton) return;

  // Support toggling <button role="switch" aria-checked="">
  switchEl.addEventListener(
    'click',
    (event) => {
      if (isDisabled(switchEl)) return;
      const wasChecked = switchEl.ariaChecked === 'true';
      switchEl.ariaChecked = String(!wasChecked);
      afterDispatch(event, () => {
        if (event.defaultPrevented) {
          switchEl.ariaChecked = String(wasChecked);
          return;
        }

        // Mimic native browser input and change event behavior.
        switchEl.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
        switchEl.dispatchEvent(new Event('change', {bubbles: true}));
      });
    },
    opts,
  );
}

/**
 * A Lit directive that adds switch styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <input role="switch" type="checkbox" class="${switchToggle()}">
 *
 *   <button role="switch" aria-checked="false" class="${switchToggle()}"></button>
 * `;
 * ```
 */
export const switchToggle = createClassMapDirective({
  getClasses: switchClasses,
  setupElement: setupSwitch,
});
