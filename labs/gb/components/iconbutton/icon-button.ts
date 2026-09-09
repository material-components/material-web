/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../../internal/events/dispatch-hooks.js';
import {focusRingClasses} from '../focus/focus-ring.js';
import {rippleClasses, setupRipple} from '../ripple/ripple.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES, isDisabled} from '../shared/pseudo-classes.js';

/** Icon Button color configuration types. */
export type IconButtonColor = 'filled' | 'tonal' | 'outlined' | 'standard';

/** Icon Button color configurations. */
export const ICON_BUTTON_COLORS = {
  filled: 'filled',
  tonal: 'tonal',
  outlined: 'outlined',
  standard: 'standard',
} as const;

/** Icon Button size configuration types. */
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Icon Button size configurations. */
export const ICON_BUTTON_SIZES = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
} as const;

/** Icon Button width configuration types. */
export type IconButtonWidth = 'narrow' | 'wide' | '';

/** Icon Button width configurations. */
export const ICON_BUTTON_WIDTHS = {
  narrow: 'narrow',
  wide: 'wide',
} as const;

/** Icon Button classes. */
export const ICON_BUTTON_CLASSES = {
  iconBtn: 'icon-btn',
  iconBtnFilled: 'icon-btn-filled',
  iconBtnTonal: 'icon-btn-tonal',
  iconBtnOutlined: 'icon-btn-outlined',
  iconBtnStandard: 'icon-btn-standard',
  iconBtnXs: 'icon-btn-xs',
  iconBtnSm: 'icon-btn-sm',
  iconBtnMd: 'icon-btn-md',
  iconBtnLg: 'icon-btn-lg',
  iconBtnXl: 'icon-btn-xl',
  iconBtnSquare: 'icon-btn-square',
  iconBtnNarrow: 'icon-btn-narrow',
  iconBtnWide: 'icon-btn-wide',
  iconBtnUnselected: 'icon-btn-unselected',
  iconBtnSelected: 'icon-btn-selected',
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
};

/** The state provided to the `iconButtonClasses()` function. */
export interface IconButtonClassesState {
  /** The color of the icon button. */
  color?: IconButtonColor;
  /** The size of the icon button. */
  size?: IconButtonSize;
  /** The width of the icon button. */
  width?: IconButtonWidth;
  /** Whether the icon button is a square shape. */
  square?: boolean;
  /** Whether the toggle button is selected, if not undefined. */
  selected?: boolean;
  /** Emulates `:active`. */
  active?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the icon button classes to apply to an element based on the given
 * state.
 *
 * @param state The state of the icon button.
 * @return An object of class names and truthy values if they apply.
 */
export function iconButtonClasses({
  color,
  size,
  width,
  square = false,
  selected,
  active = false,
  disabled = false,
}: IconButtonClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [ICON_BUTTON_CLASSES.iconBtn]: true,
    [ICON_BUTTON_CLASSES.iconBtnFilled]: color === ICON_BUTTON_COLORS.filled,
    [ICON_BUTTON_CLASSES.iconBtnTonal]: color === ICON_BUTTON_COLORS.tonal,
    [ICON_BUTTON_CLASSES.iconBtnOutlined]:
      color === ICON_BUTTON_COLORS.outlined,
    [ICON_BUTTON_CLASSES.iconBtnStandard]:
      color === ICON_BUTTON_COLORS.standard || !color,
    [ICON_BUTTON_CLASSES.iconBtnXs]: size === ICON_BUTTON_SIZES.xs,
    [ICON_BUTTON_CLASSES.iconBtnSm]: size === ICON_BUTTON_SIZES.sm || !size,
    [ICON_BUTTON_CLASSES.iconBtnMd]: size === ICON_BUTTON_SIZES.md,
    [ICON_BUTTON_CLASSES.iconBtnLg]: size === ICON_BUTTON_SIZES.lg,
    [ICON_BUTTON_CLASSES.iconBtnXl]: size === ICON_BUTTON_SIZES.xl,
    [ICON_BUTTON_CLASSES.iconBtnNarrow]: width === ICON_BUTTON_WIDTHS.narrow,
    [ICON_BUTTON_CLASSES.iconBtnWide]: width === ICON_BUTTON_WIDTHS.wide,
    [ICON_BUTTON_CLASSES.iconBtnSquare]: square,
    [ICON_BUTTON_CLASSES.iconBtnUnselected]: selected === false,
    [ICON_BUTTON_CLASSES.iconBtnSelected]: selected === true,
    [ICON_BUTTON_CLASSES.active]: active,
    [ICON_BUTTON_CLASSES.disabled]: disabled,
  };
}

/**
 * Sets up icon button functionality for the given element.
 *
 * @param iconButton The element on which to set up icon button functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupIconButton(
  iconButton: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupDispatchHooks(iconButton, 'click');
  setupRipple(iconButton, opts);
  iconButton.addEventListener(
    'click',
    (event) => {
      if (isDisabled(iconButton)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }

      afterDispatch(event, () => {
        const isToggle = iconButton.hasAttribute('aria-pressed');
        if (event.defaultPrevented || !isToggle) {
          return;
        }

        const isPressed = iconButton.ariaPressed === 'true';
        iconButton.ariaPressed = String(!isPressed);
        iconButton.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
        iconButton.dispatchEvent(new Event('change', {bubbles: true}));
      });
    },
    opts,
  );
}

/**
 * A Lit directive that adds icon button styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<button class="${iconButton({color: 'filled'})}">
 *   <md-icon>favorite</md-icon>
 * </button>`;
 * ```
 */
export const iconButton = createClassMapDirective({
  getClasses: iconButtonClasses,
  setupElement: setupIconButton,
});
