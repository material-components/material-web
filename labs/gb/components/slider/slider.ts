/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../shared/pseudo-classes.js';

/** Size variants for Slider. */
export type SliderSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** Slider classes. */
export const SLIDER_CLASSES = {
  slider: 'slider',
  range: 'range',
  disabled: PSEUDO_CLASSES.disabled,
  xsmall: 'xsmall',
  small: 'small',
  medium: 'medium',
  large: 'large',
  xlarge: 'xlarge',
} as const;

/** The state provided to the `sliderClasses()` function. */
export interface SliderClassesState {
  /** Whether the slider is a multi-thumb range slider. */
  range?: boolean;
  /** Emulates `:disabled`. */
  disabled?: boolean;
  /** Optional size variant. */
  size?: SliderSize;
}

/**
 * Returns the slider classes to apply to an element based on the given state.
 *
 * @param state The state of the slider.
 * @return An object of class names and truthy values if they apply.
 */
export function sliderClasses({
  range = false,
  disabled = false,
  size,
}: SliderClassesState = {}): ClassInfo {
  return {
    [SLIDER_CLASSES.slider]: true,
    [SLIDER_CLASSES.range]: range,
    [SLIDER_CLASSES.disabled]: disabled,
    [SLIDER_CLASSES.xsmall]: size === 'xsmall',
    [SLIDER_CLASSES.small]: size === 'small',
    [SLIDER_CLASSES.medium]: size === 'medium',
    [SLIDER_CLASSES.large]: size === 'large',
    [SLIDER_CLASSES.xlarge]: size === 'xlarge',
  };
}

/** The state provided to the `handleClasses()` function. */
export interface HandleClassesState {
  start?: boolean;
  end?: boolean;
  onTop?: boolean;
  isOverlapping?: boolean;
}

/** Handle container classes. */
export const HANDLE_CLASSES = {
  handle: 'handle',
  start: 'start',
  end: 'end',
  onTop: 'on-top',
  isOverlapping: 'is-overlapping',
} as const;

/**
 * Returns the handle classes to apply to a slider thumb handle container.
 */
export function handleClasses({
  start = false,
  end = false,
  onTop = false,
  isOverlapping = false,
}: HandleClassesState = {}): ClassInfo {
  return {
    [HANDLE_CLASSES.handle]: true,
    [HANDLE_CLASSES.start]: start,
    [HANDLE_CLASSES.end]: end,
    [HANDLE_CLASSES.onTop]: onTop,
    [HANDLE_CLASSES.isOverlapping]: isOverlapping,
  };
}

/**
 * Sets up slider container functionality for light DOM or framework usage.
 */
export function setupSlider(
  sliderEl: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  sliderEl.addEventListener(
    'input',
    (event) => {
      if (sliderEl.classList.contains(SLIDER_CLASSES.disabled)) return;
      const target = event.target as HTMLInputElement;
      if (!target || target.tagName !== 'INPUT' || target.type !== 'range') {
        return;
      }
      const isRange = sliderEl.classList.contains(SLIDER_CLASSES.range);
      if (!isRange) return;
      const inputStart =
        sliderEl.querySelector<HTMLInputElement>('input.start');
      const inputEnd = sliderEl.querySelector<HTMLInputElement>('input.end');
      if (!inputStart || !inputEnd) return;
      const action = startRangeAction(event, inputStart, inputEnd);
      if (isRangeActionFlipped(action, inputStart)) {
        flipRangeAction(action);
      }
      clampRangeAction(action, inputStart);
    },
    opts,
  );
}

/**
 * A Lit directive that adds slider container styling and functionality.
 */
export const slider = createClassMapDirective({
  getClasses: sliderClasses,
  setupElement: setupSlider,
});

/**
 * Normalizes a slider value into a fraction between 0 and 1 clamped to [min, max].
 */
export function calculateFraction(
  value: number,
  min: number,
  max: number,
  step = 1,
): number {
  const stepVal = step === 0 ? 1 : step;
  const range = Math.max(max - min, stepVal);
  const clamped = Math.max(min, Math.min(max, value));
  return (clamped - min) / range;
}

/**
 * Checks whether pointer event coordinates are within the bounding rect of an element.
 */
export function inBounds(
  {x, y}: PointerEvent,
  element?: HTMLElement | null,
): boolean {
  if (!element) {
    return false;
  }
  const {top, left, bottom, right} = element.getBoundingClientRect();
  return x >= left && x <= right && y >= top && y <= bottom;
}

/**
 * Checks whether two elements visually overlap.
 */
export function isOverlapping(
  elA: Element | null | undefined,
  elB: Element | null | undefined,
): boolean {
  if (!(elA && elB)) {
    return false;
  }
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  return !(
    a.top > b.bottom ||
    a.right < b.left ||
    a.bottom < b.top ||
    a.left > b.right
  );
}

/**
 * Represents an ongoing drag or keyboard interaction on a range slider.
 */
export interface RangeAction {
  canFlip: boolean;
  flipped: boolean;
  target: HTMLInputElement;
  fixed: HTMLInputElement;
  values: Map<HTMLInputElement | undefined, number | undefined>;
}

/**
 * Starts a range slider interaction action.
 */
export function startRangeAction(
  event: Event,
  inputStart: HTMLInputElement | null,
  inputEnd: HTMLInputElement | null,
): RangeAction | undefined {
  const target = event.target as HTMLInputElement;
  const fixed = target === inputStart ? inputEnd! : inputStart!;
  if (!target || !fixed) return undefined;
  return {
    canFlip: event.type === 'pointerdown',
    flipped: false,
    target,
    fixed,
    values: new Map([
      [target, target.valueAsNumber],
      [fixed, fixed.valueAsNumber],
    ]),
  };
}

/**
 * Checks if a range slider action needs clamping.
 */
export function needsRangeClamping(
  action: RangeAction | undefined,
  inputStart: HTMLInputElement | null,
): boolean {
  if (!action) return false;
  const {target, fixed} = action;
  const isStart = target === inputStart;
  return isStart
    ? target.valueAsNumber > fixed.valueAsNumber
    : target.valueAsNumber < fixed.valueAsNumber;
}

/**
 * Checks if a range slider action should be flipped when dragging past coincident thumbs.
 */
export function isRangeActionFlipped(
  action: RangeAction | undefined,
  inputStart: HTMLInputElement | null,
): boolean {
  if (!action) return false;
  const {target, fixed, values} = action;
  if (action.canFlip) {
    const coincident = values.get(target) === values.get(fixed);
    if (coincident && needsRangeClamping(action, inputStart)) {
      action.canFlip = false;
      action.flipped = true;
      action.target = fixed;
      action.fixed = target;
    }
  }
  return action.flipped;
}

/**
 * Flips the action target and fixed values.
 */
export function flipRangeAction(action: RangeAction | undefined): boolean {
  if (!action) return false;
  const {target, fixed, values} = action;
  const changed = target.valueAsNumber !== fixed.valueAsNumber;
  target.valueAsNumber = fixed.valueAsNumber;
  fixed.valueAsNumber = values.get(fixed)!;
  return changed;
}

/**
 * Clamps the range slider action values so start never crosses end.
 */
export function clampRangeAction(
  action: RangeAction | undefined,
  inputStart: HTMLInputElement | null,
): boolean {
  if (!needsRangeClamping(action, inputStart) || !action) return false;
  const {target, fixed} = action;
  target.valueAsNumber = fixed.valueAsNumber;
  return true;
}
