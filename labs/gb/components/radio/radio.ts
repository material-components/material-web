/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {focusRingClasses} from '@material/web/labs/gb/components/focus/focus-ring.js';
import {
  rippleClasses,
  setupRipple,
} from '@material/web/labs/gb/components/ripple/ripple.js';
import {PSEUDO_CLASSES} from '@material/web/labs/gb/components/shared/pseudo-classes.js';
import {
  AttributePart,
  Directive,
  directive,
  DirectiveParameters,
} from 'lit/async-directive.js';
import {classMap, type ClassInfo} from 'lit/directives/class-map.js';

/** Radio classes. */
export const RADIO_CLASSES = {
  radio: 'radio',
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  active: PSEUDO_CLASSES.active,
  checked: PSEUDO_CLASSES.checked,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `radioClasses()` function. */
export interface RadioClassesState {
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus`. */
  focus?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:checked`. */
  checked?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the radio classes to apply to an element based on the given state.
 *
 * @param state The state of the radio.
 * @return An object of class names and truthy values if they apply.
 */
export function radioClasses({
  hover = false,
  focus = false,
  active = false,
  checked = false,
  disabled = false,
}: RadioClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [RADIO_CLASSES.radio]: true,
    [RADIO_CLASSES.hover]: hover,
    [RADIO_CLASSES.focus]: focus,
    [RADIO_CLASSES.active]: active,
    [RADIO_CLASSES.checked]: checked,
    [RADIO_CLASSES.disabled]: disabled,
  };
}

/**
 * Sets up radio functionality for the given element.
 *
 * @param radio The element on which to set up radio functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupRadio(
  radio: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(radio, opts);
}

/** The state provided to the `radio()` directive. */
export interface RadioDirectiveState extends RadioClassesState {
  /** Additional classes to apply to the element. */
  classes?: ClassInfo;
}

class RadioDirective extends Directive {
  private element?: HTMLElement;
  private cleanup?: AbortController;

  render(state: RadioDirectiveState = {}) {
    return classMap({
      ...(state.classes || {}),
      ...radioClasses(state),
    });
  }

  override update(
    {element}: AttributePart,
    [state]: DirectiveParameters<this>,
  ) {
    if (element !== this.element) {
      this.element = element as HTMLElement;
      this.cleanup?.abort();
      this.cleanup = new AbortController();
      setupRadio(this.element, {signal: this.cleanup.signal});
    }

    return this.render(state);
  }
}

/**
 * A Lit directive that adds radio styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <input type="radio" class="${radio()}" name="radio-group">
 *   <input type="radio" class="${radio()}" name="radio-group">
 *   <input type="radio" class="${radio()}" name="radio-group">
 * `;
 * ```
 */
export const radio = directive(RadioDirective);
