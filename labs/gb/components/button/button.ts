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
import {PSEUDO_CLASSES} from '@material/web/labs/gb/components/shared/pseudo-classes.js';
import {
  AsyncDirective,
  AttributePart,
  directive,
  DirectiveParameters,
} from 'lit/async-directive.js';
import {classMap, type ClassInfo} from 'lit/directives/class-map.js';

/** Button color configuration types. */
export type ButtonColor = 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text';

/** Button color configurations. */
export const BUTTON_COLORS = {
  filled: 'filled',
  elevated: 'elevated',
  tonal: 'tonal',
  outlined: 'outlined',
  text: 'text',
} as const;

/** Button size configuration types. */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Button size configurations. */
export const BUTTON_SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

/** Button classes. */
export const BUTTON_CLASSES = {
  btn: 'btn',
  btnFilled: 'btn-filled',
  btnElevated: 'btn-elevated',
  btnTonal: 'btn-tonal',
  btnOutlined: 'btn-outlined',
  btnText: 'btn-text',
  btnXs: 'btn-xs',
  btnSm: 'btn-sm',
  btnMd: 'btn-md',
  btnLg: 'btn-lg',
  btnXl: 'btn-xl',
  btnSquare: 'btn-square',
  btnUnselected: 'btn-unselected',
  btnSelected: 'btn-selected',
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
};

/** The state provided to the `buttonClasses()` function. */
export interface ButtonClassesState {
  /** The color of the button. */
  color?: ButtonColor;
  /** The size of the button. */
  size?: ButtonSize;
  /** Whether the button is a square shape. */
  square?: boolean;
  /** Whether the toggle button is selected, if not undefined. */
  selected?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the button classes to apply to an element based on the given state.
 *
 * @param state The state of the button.
 * @return An object of class names and truthy values if they apply.
 */
export function buttonClasses({
  color,
  size,
  square = false,
  selected,
  active = false,
  disabled = false,
}: ButtonClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [BUTTON_CLASSES.btn]: true,
    [BUTTON_CLASSES.btnFilled]: color === BUTTON_COLORS.filled,
    [BUTTON_CLASSES.btnElevated]: color === BUTTON_COLORS.elevated,
    [BUTTON_CLASSES.btnTonal]: color === BUTTON_COLORS.tonal,
    [BUTTON_CLASSES.btnOutlined]: color === BUTTON_COLORS.outlined,
    [BUTTON_CLASSES.btnText]: color === BUTTON_COLORS.text || !color,
    [BUTTON_CLASSES.btnXs]: size === BUTTON_SIZES.xs,
    [BUTTON_CLASSES.btnSm]: size === BUTTON_SIZES.sm || !size,
    [BUTTON_CLASSES.btnMd]: size === BUTTON_SIZES.md,
    [BUTTON_CLASSES.btnLg]: size === BUTTON_SIZES.lg,
    [BUTTON_CLASSES.btnXl]: size === BUTTON_SIZES.xl,
    [BUTTON_CLASSES.btnSquare]: square,
    [BUTTON_CLASSES.btnUnselected]: selected === false,
    [BUTTON_CLASSES.btnSelected]: selected === true,
    [BUTTON_CLASSES.active]: active,
    [BUTTON_CLASSES.disabled]: disabled,
  };
}

/**
 * Sets up button functionality for the given element.
 *
 * @param button The element on which to set up button functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupButton(
  button: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupDispatchHooks(button, 'click');
  setupRipple(button, opts);
  button.addEventListener(
    'click',
    (event) => {
      // When disabled, explicitly prevent the click from propagating to other
      // event listeners as well as prevent the default action. This is because
      // the underlying element may not actually be `:disabled`, such as an
      // anchor tag or a soft-disabled button.
      if (
        button.matches(`.${BUTTON_CLASSES.disabled},[aria-disabled="true"]`)
      ) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }

      afterDispatch(event, () => {
        const isToggle =
          button.hasAttribute('aria-pressed') ||
          button.matches(
            `.${BUTTON_CLASSES.btnSelected},.${BUTTON_CLASSES.btnUnselected}`,
          );
        if (event.defaultPrevented || !isToggle) {
          return;
        }

        const isPressed = button.ariaPressed === 'true';
        button.ariaPressed = String(!isPressed);
        // Mimic native browser input and change event behavior.
        button.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
        button.dispatchEvent(new Event('change', {bubbles: true}));
      });
    },
    opts,
  );
}

/** The state provided to the `button()` directive. */
export interface ButtonDirectiveState extends ButtonClassesState {
  /** Additional classes to apply to the element. */
  classes?: ClassInfo;
}

class ButtonDirective extends AsyncDirective {
  private element?: HTMLElement;
  private cleanup?: AbortController;

  render(state: ButtonDirectiveState) {
    return classMap({
      ...(state.classes || {}),
      ...buttonClasses(state),
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
      setupButton(this.element, {signal: this.cleanup.signal});
    }
  }
}

/**
 * A Lit directive that adds button styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<button class="${button({color: 'filled'})}">Filled</button>`;
 * ```
 */
export const button = directive(ButtonDirective);
