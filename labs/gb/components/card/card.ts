/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FOCUS_RING_CLASSES} from '@material/web/labs/gb/components/focus/focus-ring.js';
import {PSEUDO_CLASSES} from '@material/web/labs/gb/components/shared/pseudo-classes.js';
import {Directive, directive} from 'lit/directive.js';
import {classMap, type ClassInfo} from 'lit/directives/class-map.js';

/** Card color configuration types. */
export type CardColor = 'elevated' | 'filled' | 'outlined';

/** Card color configurations. */
export const CARD_COLORS = {
  elevated: 'elevated',
  filled: 'filled',
  outlined: 'outlined',
} as const;

/** Card classes. */
export const CARD_CLASSES = {
  card: 'card',
  cardElevated: 'card-elevated',
  cardFilled: 'card-filled',
  cardOutlined: 'card-outlined',
  hover: PSEUDO_CLASSES.hover,
  focus: PSEUDO_CLASSES.focus,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `cardClasses()` function. */
export interface CardClassesState {
  /** The color of the card. */
  color?: CardColor;
  /** Whether the card is interactive. */
  interactive?: boolean;
  /** Emulates `:hover`. */
  hover?: boolean;
  /** Emulates `:focus`. */
  focus?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
}

/**
 * Returns the card classes to apply to an element based on the given state.
 *
 * @param state The state of the card.
 * @return An object of class names and truthy values if they apply.
 */
export function cardClasses({
  color,
  interactive = false,
  hover = false,
  focus = false,
  disabled = false,
}: CardClassesState = {}): ClassInfo {
  return {
    [FOCUS_RING_CLASSES.focusRingOuter]: interactive,
    [CARD_CLASSES.card]: true,
    [CARD_CLASSES.cardElevated]: color === CARD_COLORS.elevated,
    [CARD_CLASSES.cardFilled]: color === CARD_COLORS.filled,
    [CARD_CLASSES.cardOutlined]: color === CARD_COLORS.outlined || !color,
    [CARD_CLASSES.hover]: hover,
    [CARD_CLASSES.focus]: focus,
    [CARD_CLASSES.disabled]: disabled,
  };
}

/** The state provided to the `card()` directive. */
export interface CardDirectiveState extends CardClassesState {
  /** Additional classes to apply to the element. */
  classes?: ClassInfo;
}

class CardDirective extends Directive {
  render(state: CardDirectiveState = {}) {
    return classMap({
      ...(state.classes || {}),
      ...cardClasses(state),
    });
  }
}

/**
 * A Lit directive that adds card styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${card({color: 'filled'})} flex flex-row p-4">
 *     Card content
 *   </div>
 * `
 * ```
 */
export const card = directive(CardDirective);
