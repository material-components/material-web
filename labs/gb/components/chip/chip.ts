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
import {isDisabled, PSEUDO_CLASSES} from '../shared/pseudo-classes.js';

/** Chip color/emphasis configuration types. */
export type ChipColor = 'elevated' | 'filled' | 'outlined' | 'tonal';

/** Chip color configurations. */
export const CHIP_COLORS = {
  elevated: 'elevated',
  filled: 'filled',
  outlined: 'outlined',
  tonal: 'tonal',
} as const;

/** Chip functional type. */
export type ChipType = 'action' | 'filter' | 'toggle' | 'link';

/** Chip classes. */
export const CHIP_CLASSES = {
  chip: 'chip',
  chipElevated: 'chip-elevated',
  chipFilled: 'chip-filled',
  chipOutlined: 'chip-outlined',
  chipTonal: 'chip-tonal',
  chipSelected: 'chip-selected',
  chipFilter: 'chip-filter',
  chipInput: 'chip-input',
  chipRemovable: 'chip-removable',
  chipWithLeadingIcon: 'chip-with-leading-icon',
  chipWithTrailingIcon: 'chip-with-trailing-icon',
  chipWithAvatar: 'chip-with-avatar',
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `chipClasses()` function. */
export interface ChipClassesState {
  /** The emphasis color of the chip. */
  color?: ChipColor;
  /** The functional behavior type of the chip (`action`, `filter`, `toggle`, `link`). */
  type?: ChipType;
  /** Whether the filter or toggle chip is selected. */
  selected?: boolean;
  /** Whether the chip is removable (`removable="true"`). */
  removable?: boolean;
  /** Whether the chip has a leading icon. */
  withLeadingIcon?: boolean;
  /** Whether the chip has a trailing icon. */
  withTrailingIcon?: boolean;
  /** Whether the chip has an avatar. */
  withAvatar?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the chip classes to apply to an element based on the given state.
 *
 * @param state The state of the chip.
 * @return An object of class names and truthy values if they apply.
 */
export function chipClasses({
  color = 'outlined',
  type = 'action',
  selected = false,
  removable = false,
  withLeadingIcon = false,
  withTrailingIcon = false,
  withAvatar = false,
  disabled = false,
}: ChipClassesState = {}): ClassInfo {
  return {
    ...rippleClasses(),
    ...focusRingClasses(),
    [CHIP_CLASSES.chip]: true,
    [CHIP_CLASSES.chipElevated]: color === CHIP_COLORS.elevated,
    [CHIP_CLASSES.chipFilled]: color === CHIP_COLORS.filled,
    [CHIP_CLASSES.chipOutlined]: color === CHIP_COLORS.outlined,
    [CHIP_CLASSES.chipTonal]: color === CHIP_COLORS.tonal,
    [CHIP_CLASSES.chipSelected]: selected,
    [CHIP_CLASSES.chipFilter]: type === 'filter' || type === 'toggle',
    [CHIP_CLASSES.chipInput]: removable || type === 'action',
    [CHIP_CLASSES.chipRemovable]: removable,
    [CHIP_CLASSES.chipWithLeadingIcon]: withLeadingIcon,
    [CHIP_CLASSES.chipWithTrailingIcon]: withTrailingIcon,
    [CHIP_CLASSES.chipWithAvatar]: withAvatar,
    [CHIP_CLASSES.disabled]: disabled,
  };
}

/**
 * Sets up chip functionality for the given element.
 *
 * @param chip The element on which to set up chip functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupChip(
  chip: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  setupDispatchHooks(chip, 'click');
  setupRipple(chip, opts);
  chip.addEventListener(
    'click',
    (event) => {
      if (isDisabled(chip)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return;
      }

      afterDispatch(event, () => {
        const isToggle =
          chip.hasAttribute('aria-pressed') ||
          chip.matches(
            `.${CHIP_CLASSES.chipFilter},.${CHIP_CLASSES.chipSelected}`,
          );
        if (event.defaultPrevented || !isToggle) {
          return;
        }

        const isPressed = chip.ariaPressed === 'true';
        chip.ariaPressed = String(!isPressed);
        chip.dispatchEvent(
          new InputEvent('input', {bubbles: true, composed: true}),
        );
        chip.dispatchEvent(new Event('change', {bubbles: true}));
      });
    },
    opts,
  );
}

/**
 * A Lit directive that adds chip styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`<button class="${chip({color: 'elevated'})}">Elevated Chip</button>`;
 * ```
 */
export const chip = createClassMapDirective({
  getClasses: chipClasses,
  setupElement: setupChip,
});
