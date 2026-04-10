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
  AsyncDirective,
  AttributePart,
  directive,
  DirectiveParameters,
} from 'lit/async-directive.js';
import {classMap, type ClassInfo} from 'lit/directives/class-map.js';

/** Checkbox classes. */
export const CHECKBOX_CLASSES = {
  checkbox: 'checkbox',
  invalid: PSEUDO_CLASSES.invalid,
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  active: PSEUDO_CLASSES.active,
  checked: PSEUDO_CLASSES.checked,
  indeterminate: PSEUDO_CLASSES.indeterminate,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `checkboxClasses()` function. */
export interface CheckboxClassesState {
  /** Emulates `:invalid`. */
  invalid?: boolean;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus`. */
  focus?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:checked`. */
  checked?: boolean;
  /** Emulates `:indeterminate`. */
  indeterminate?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the checkbox classes to apply to an element based on the given state.
 *
 * @param state The state of the checkbox.
 * @return An object of class names and truthy values if they apply.
 */
export function checkboxClasses({
  invalid = false,
  hover = false,
  focus = false,
  active = false,
  checked = false,
  indeterminate = false,
  disabled = false,
}: CheckboxClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [CHECKBOX_CLASSES.checkbox]: true,
    [CHECKBOX_CLASSES.checked]: checked,
    [CHECKBOX_CLASSES.indeterminate]: indeterminate,
    [CHECKBOX_CLASSES.disabled]: disabled,
    [CHECKBOX_CLASSES.invalid]: invalid,
    [CHECKBOX_CLASSES.hover]: hover,
    [CHECKBOX_CLASSES.focus]: focus,
    [CHECKBOX_CLASSES.active]: active,
  };
}

/**
 * Sets up checkbox functionality for the given element.
 *
 * @param checkbox The element on which to set up checkbox functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupCheckbox(
  checkbox: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupRipple(checkbox, opts);
}

/** The state provided to the `checkbox()` directive. */
export interface CheckboxDirectiveState extends CheckboxClassesState {
  /** Additional classes to apply to the element. */
  classes?: ClassInfo;
}

class CheckboxDirective extends AsyncDirective {
  private element?: HTMLElement;
  private cleanup?: AbortController;

  render(state: CheckboxDirectiveState) {
    return classMap({
      ...(state.classes || {}),
      ...checkboxClasses(state),
    });
  }

  override update(
    {element}: AttributePart,
    [state]: DirectiveParameters<this>,
  ) {
    if (this.isConnected && element !== this.element) {
      this.element = element as HTMLElement;
      this.disconnected();
      this.reconnected();
    }

    return this.render(state);
  }

  protected override disconnected() {
    this.cleanup?.abort();
  }

  protected override reconnected() {
    if (this.element) {
      this.cleanup = new AbortController();
      setupCheckbox(this.element, {signal: this.cleanup.signal});
    }
  }
}

/**
 * A Lit directive that adds checkbox styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<input type="checkbox" class="${checkbox()}">`;
 * ```
 */
export const checkbox = directive(CheckboxDirective);
