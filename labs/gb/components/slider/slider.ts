/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {focusRingClasses} from '../focus/focus-ring.js';
import {createClassMapDirective} from '../shared/directives.js';
import {PSEUDO_CLASSES} from '../shared/pseudo-classes.js';

/** Slider size configuration types. */
export type SliderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Slider orientation configuration types. */
export type SliderOrientation = 'horizontal' | 'vertical';

/** Slider classes. */
export const SLIDER_CLASSES = {
  slider: 'slider',
  ranged: 'slider-ranged',
  disabled: PSEUDO_CLASSES.disabled,
  centered: 'slider-centered',
  vertical: 'slider-vertical',
} as const;

// LINT.IfChange(icon_padding)
/** Default inset icon padding in pixels, following Material web conventions. */
export const ICON_PADDING_PX = 10;
// LINT.ThenChange(slider.scss:icon_padding)

/** Default inset icon size in pixels, sourced from Android M3E Slider.md. */
export const ICON_SIZE_PX = 24;

/**
 * Crossover distance from leading track edge in pixels where the icon color
 * flips between inactive and active track colors.
 */
export const ICON_CROSSOVER_PX = ICON_PADDING_PX + ICON_SIZE_PX / 2; // 22px

/** Handle classes. */
export const HANDLE_CLASSES = {
  handle: 'slider-handle',
  start: 'slider-start',
  end: 'slider-end',
  onTop: 'slider-on-top',
  isOverlapping: 'slider-is-overlapping',
  focusVisible: PSEUDO_CLASSES.focusVisible,
  hover: PSEUDO_CLASSES.hover,
  active: PSEUDO_CLASSES.active,
  disabled: PSEUDO_CLASSES.disabled,
} as const;

/** The state provided to the `sliderClasses()` function. */
export interface SliderClassesState {
  /** Emulates `:disabled`. */
  disabled?: boolean;
  /** Whether the slider is in range mode. */
  ranged?: boolean;
  /** Whether the slider is centered. */
  centered?: boolean;
  /** Whether the slider is in vertical orientation. */
  vertical?: boolean;
}

/**
 * Returns the slider classes to apply to an element based on the given state.
 *
 * @param state The state of the slider.
 * @return An object of class names and truthy values if they apply.
 */
export function sliderClasses({
  disabled = false,
  ranged = false,
  centered = false,
  vertical = false,
}: SliderClassesState = {}): ClassInfo {
  return {
    [SLIDER_CLASSES.slider]: true,
    [SLIDER_CLASSES.ranged]: ranged,
    [SLIDER_CLASSES.disabled]: disabled,
    [SLIDER_CLASSES.centered]: !ranged && centered,
    [SLIDER_CLASSES.vertical]: vertical,
  };
}

/** The state provided to the `handleClasses()` function. */
export interface HandleClassesState {
  start?: boolean;
  end?: boolean;
  hover?: boolean;
  active?: boolean;
  focusVisible?: boolean;
  disabled?: boolean;
  onTop?: boolean;
  isOverlapping?: boolean;
}

/**
 * Returns the handle classes to apply to a handle element based on the given state.
 *
 * @param state The state of the handle.
 * @return An object of class names and truthy values if they apply.
 */
export function handleClasses({
  start = false,
  end = false,
  hover = false,
  active = false,
  focusVisible = false,
  disabled = false,
  onTop = false,
  isOverlapping = false,
}: HandleClassesState = {}): ClassInfo {
  return {
    [HANDLE_CLASSES.handle]: true,
    [HANDLE_CLASSES.start]: start,
    [HANDLE_CLASSES.end]: end,
    [HANDLE_CLASSES.onTop]: onTop,
    [HANDLE_CLASSES.isOverlapping]: isOverlapping,
    [HANDLE_CLASSES.focusVisible]: focusVisible,
    [HANDLE_CLASSES.hover]: hover,
    [HANDLE_CLASSES.active]: active,
    [HANDLE_CLASSES.disabled]: disabled,
  };
}

/** The state provided to the `handleNubClasses()` function. */
export interface HandleNubClassesState {
  focusVisible?: boolean;
}

/**
 * Returns the handle nub classes to apply to a handle nub element.
 *
 * @param state The state of the handle nub.
 * @return An object of class names and truthy values if they apply.
 */
export function handleNubClasses({
  focusVisible = false,
}: HandleNubClassesState = {}): ClassInfo {
  return {
    'slider-handle-nub': true,
    ...focusRingClasses({focusVisible}),
  };
}

/** State values passed to `computeSliderProperties()`. */
export interface SliderStateValues {
  min?: number;
  max?: number;
  step?: number | 'any';
  value?: number;
  valueStart?: number;
  valueEnd?: number;
  range?: boolean;
  centered?: boolean;
  trackLength?: number;
  minSpacing?: number;
}

/** Default handle width in pixels. */
export const HANDLE_WIDTH_PX = 4;
/** Default handle half-width in pixels. */
export const HANDLE_HALF_WIDTH_PX = 2;
/** Default slider gap in pixels. */
export const SLIDER_GAP_PX = 8;

/**
 * Safety ceiling on the number of stop intervals to prevent pathological
 * browser hangs or memory consumption if a microscopic step value is supplied.
 */
const MAX_STOP_INTERVALS = 1000;

/**
 * Default minimum spacing between stop indicator centers in pixels (2x stop-indicator-size).
 * Ensures stop dots remain visually distinct and do not bleed together.
 */
export const DEFAULT_MIN_STOP_SPACING_PX = 8;

/**
 * Pure function that computes the number of stop intervals for a slider,
 * applying legibility, non-integer, and bounds guards.
 *
 * @param min Minimum slider value.
 * @param max Maximum slider value.
 * @param step Step size between stops.
 * @param trackLengthPx Length of track in pixels. If undefined, spacing guard is skipped.
 * @param handleWidthPx Width of handle in pixels (default 4).
 * @param minSpacingPx Minimum distance between stop centers in pixels (default 8).
 * @return The interval count (painted stops = n + 1). Returns 0 if suppressed or invalid.
 */
export function computeStopIntervals(
  min: number,
  max: number,
  step?: number | 'any',
  trackLengthPx?: number,
  handleWidthPx = HANDLE_WIDTH_PX,
  minSpacingPx = DEFAULT_MIN_STOP_SPACING_PX,
): number {
  if (step === 'any') return 0;
  const span = max - min;
  if (!isFinite(span) || span <= 0) return 0;
  const s =
    isFinite(step as number) && (step as number) > 0 ? (step as number) : 1;
  const raw = span / s;
  if (!isFinite(raw)) return 0;
  const rounded = Math.round(raw);
  const n =
    Math.abs(raw - rounded) <= 1e-6 * Math.max(1, Math.abs(raw))
      ? rounded
      : Math.floor(raw);
  if (n < 1) return 0;
  if (n > MAX_STOP_INTERVALS) return 0;
  if (trackLengthPx != null && isFinite(trackLengthPx)) {
    const travel = Math.max(0, trackLengthPx - handleWidthPx);
    if (travel / n < minSpacingPx) return 0;
  }
  return n;
}

/**
 * Pure function that computes normalized custom property fractions and flags
 * required by the slider stylesheet.
 *
 * @param values Current state values of the slider.
 * @return A dictionary of `--__*` CSS custom properties and string values.
 */
export function computeSliderProperties(
  values: SliderStateValues,
): Record<string, string> {
  const min = values.min ?? 0;
  const max = values.max ?? 100;
  const step =
    values.step !== undefined && values.step !== 'any' && values.step > 0
      ? values.step
      : 1;
  const range = Boolean(values.range);
  const centered = Boolean(values.centered);
  const span = Math.max(max - min, step);

  const renderValueStart = values.valueStart;
  const renderValueEnd = range
    ? values.valueEnd
    : (values.value ?? values.valueEnd);

  const startF = range ? ((renderValueStart ?? min) - min) / span : 0;
  const endF = ((renderValueEnd ?? min) - min) / span;
  const originF = range ? startF : centered ? 0.5 : 0;

  const trackLen = values.trackLength ?? 200;
  const travel = Math.max(0, trackLen - HANDLE_WIDTH_PX);

  const hasInactiveLead = range || centered;

  let inactiveLeadEndF = 0;
  let inactiveLeadGap = 0;
  let originLeadGap = 0;

  let inactiveTrailStartF = endF;
  let inactiveTrailGap = 1;
  let originTrailGap = 0;

  let activeStartF = Math.min(originF, endF);
  let activeEndF = Math.max(originF, endF);
  let activeStartGap = range ? 1 : 0;
  let activeEndGap = 1;

  if (range) {
    inactiveLeadEndF = startF;
    inactiveLeadGap = 1;
    originLeadGap = 0;

    inactiveTrailStartF = endF;
    inactiveTrailGap = 1;
    originTrailGap = 0;

    activeStartF = startF;
    activeEndF = endF;
    activeStartGap = 1;
    activeEndGap = 1;
  } else if (!centered) {
    inactiveLeadEndF = 0;
    inactiveLeadGap = 0;
    originLeadGap = 0;

    inactiveTrailStartF = endF;
    inactiveTrailGap = 1;
    originTrailGap = 0;

    activeStartF = 0;
    activeEndF = endF;
    activeStartGap = 0;
    activeEndGap = 1;
  } else {
    // Centered slider track geometry:
    // - Off-centre: a 6px total origin split (3px lead + 3px trail), driven by
    //   --_slider-origin-split: 3px, dividing active fill from the opposite track.
    // - Exactly at centre: both tracks stop 8px from the handle centre, giving 16px
    //   total across the nub and a uniform 6px clearance either side of the 4px nub;
    //   the active track has zero width.
    // - Transition zone, 0 < displacement <= 11px: tracks stop 8px from the handle
    //   centre (>= 6px clearance preserved) and the active width clamps to 0; at and
    //   above 11px the origin split applies. The geometry is continuous at the boundary
    //   because active width = displacement - 11, which is exactly 0 at 11px.
    const isAtOrigin = Math.abs(endF - originF) < 1e-6;
    if (isAtOrigin) {
      inactiveLeadEndF = originF;
      inactiveLeadGap = 1;
      originLeadGap = 0;

      inactiveTrailStartF = originF;
      inactiveTrailGap = 1;
      originTrailGap = 0;

      activeStartF = originF;
      activeEndF = originF;
      activeStartGap = 1;
      activeEndGap = 1;
    } else if (endF > originF) {
      const offsetPx = travel * (endF - originF);
      // Inactive lead track transition:
      // handleCenter - 8px < originPx - 3px <=> offsetPx < 5px
      if (offsetPx < 5) {
        inactiveLeadEndF = endF;
        inactiveLeadGap = 1;
        originLeadGap = 0;
      } else {
        inactiveLeadEndF = originF;
        inactiveLeadGap = 0;
        originLeadGap = 1;
      }

      inactiveTrailStartF = endF;
      inactiveTrailGap = 1;
      originTrailGap = 0;

      // Active track: exists only when handleCenter - 8px > originPx + 3px <=> offsetPx > 11px
      if (offsetPx > 11) {
        activeStartF = originF;
        activeStartGap = 0;
        originLeadGap = 1;

        activeEndF = endF;
        activeEndGap = 1;
        originTrailGap = 0;
      } else {
        // In the transition zone, active track has 0 extent (self-collapsed)
        activeStartF = originF;
        activeEndF = originF;
        activeStartGap = 0;
        activeEndGap = 0;
      }
    } else {
      // endF < originF
      const offsetPx = travel * (originF - endF);
      // Inactive trail track transition:
      // handleCenter + 8px > originPx + 3px <=> offsetPx < 5px
      if (offsetPx < 5) {
        inactiveTrailStartF = endF;
        inactiveTrailGap = 1;
        originTrailGap = 0;
      } else {
        inactiveTrailStartF = originF;
        inactiveTrailGap = 0;
        originTrailGap = 1;
      }

      inactiveLeadEndF = endF;
      inactiveLeadGap = 1;
      originLeadGap = 0;

      // Active track: exists only when handleCenter + 8px < originPx - 3px <=> offsetPx > 11px
      if (offsetPx > 11) {
        activeStartF = endF;
        activeStartGap = 1;
        originLeadGap = 0;

        activeEndF = originF;
        activeEndGap = 0;
        originTrailGap = 1;
      } else {
        // In the transition zone, active track has 0 extent (self-collapsed)
        activeStartF = originF;
        activeEndF = originF;
        activeStartGap = 0;
        activeEndGap = 0;
      }
    }
  }

  const startStopSelected = activeStartF <= 1e-6 && activeEndF >= -1e-6;
  const endStopSelected = activeEndF >= 1 - 1e-6;

  // Inset icon crossover calculation (standard horizontal slider only).
  // Sourced from Android M3E Slider.md:101-107.
  // Note: Android clips per-track-box so an icon straddling the boundary is
  // bicoloured; our single-element version switches colour at the crossover instead.
  // This is a deliberate simplification.
  const activeEndPx =
    endF > 0 ? HANDLE_HALF_WIDTH_PX + travel * endF - SLIDER_GAP_PX : 0;
  const iconOverActive =
    !range && !centered && activeEndPx >= ICON_CROSSOVER_PX;

  return {
    '--__start-fraction': String(startF),
    '--__end-fraction': String(endF),
    '--__lead-handle-fraction': String(range ? startF : endF),
    '--__trail-handle-fraction': String(endF),
    '--__active-start-fraction': String(activeStartF),
    '--__active-end-fraction': String(activeEndF),
    '--__active-start-gap': String(activeStartGap),
    '--__active-end-gap': String(activeEndGap),
    '--__active-start-at-edge': !range && !centered ? '1' : '0',
    '--__has-inactive-lead': hasInactiveLead ? '1' : '0',
    '--__inactive-lead-end-fraction': String(inactiveLeadEndF),
    '--__inactive-lead-gap': String(inactiveLeadGap),
    '--__origin-lead-gap': String(originLeadGap),
    '--__inactive-trail-start-fraction': String(inactiveTrailStartF),
    '--__inactive-trail-gap': String(inactiveTrailGap),
    '--__origin-trail-gap': String(originTrailGap),
    '--__start-stop-selected': startStopSelected ? '1' : '0',
    '--__end-stop-selected': endStopSelected ? '1' : '0',
    '--__icon-over-active': iconOverActive ? '1' : '0',
    '--__tick-count': String(
      computeStopIntervals(
        min,
        max,
        values.step,
        values.trackLength,
        HANDLE_WIDTH_PX,
        values.minSpacing ?? DEFAULT_MIN_STOP_SPACING_PX,
      ),
    ),
  };
}

/**
 * Sets up slider functionality for the given root element.
 *
 * @param rootEl The root element on which to set up slider functionality.
 * @param opts Setup options, supports a cleanup `signal`.
 */
export function setupSlider(
  rootEl: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const inputEnd = rootEl.querySelector<HTMLInputElement>('input.slider-end');
  const inputStart =
    rootEl.querySelector<HTMLInputElement>('input.slider-start');
  if (!inputEnd) return;

  let trackLength: number | undefined;

  const update = () => {
    const isRange =
      rootEl.classList.contains('slider-ranged') ||
      rootEl.hasAttribute('range') ||
      Boolean(inputStart);
    const isCentered =
      rootEl.classList.contains('slider-centered') ||
      rootEl.hasAttribute('centered');
    const minSpacingRaw = getComputedStyle(rootEl).getPropertyValue(
      '--stop-indicator-min-spacing',
    );
    const parsedMinSpacing = Number(minSpacingRaw.replace('px', '').trim());
    const minSpacing =
      isFinite(parsedMinSpacing) && parsedMinSpacing > 0
        ? parsedMinSpacing
        : undefined;

    const props = computeSliderProperties({
      min: Number(inputEnd.min || 0),
      max: Number(inputEnd.max || 100),
      step: inputEnd.step === 'any' ? 'any' : Number(inputEnd.step || 1),
      range: isRange,
      centered: isCentered,
      valueStart: inputStart ? inputStart.valueAsNumber : undefined,
      valueEnd: inputEnd.valueAsNumber,
      value: inputEnd.valueAsNumber,
      trackLength,
      minSpacing,
    });
    for (const [key, val] of Object.entries(props)) {
      if (
        key === '--__icon-over-active' ||
        key === '--__start-stop-selected' ||
        key === '--__end-stop-selected'
      ) {
        continue;
      }
      rootEl.style.setProperty(key, val);
    }
    const startStop = rootEl.querySelector(
      '.slider-boundary-stop.slider-start',
    );
    if (startStop) {
      startStop.classList.toggle(
        'slider-selected',
        props['--__start-stop-selected'] === '1',
      );
    }
    const endStop = rootEl.querySelector('.slider-boundary-stop.slider-end');
    if (endStop) {
      endStop.classList.toggle(
        'slider-selected',
        props['--__end-stop-selected'] === '1',
      );
    }
    const icon = rootEl.querySelector('.slider-icon');
    if (icon) {
      icon.classList.toggle(
        'slider-over-active',
        props['--__icon-over-active'] === '1',
      );
    }
  };

  inputEnd.addEventListener('input', update, opts);
  inputEnd.addEventListener('change', update, opts);
  inputStart?.addEventListener('input', update, opts);
  inputStart?.addEventListener('change', update, opts);

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const isVertical = rootEl.classList.contains('slider-vertical');
        const length = Math.round(
          isVertical ? entry.contentRect.height : entry.contentRect.width,
        );
        if (trackLength === length) continue;
        trackLength = length;
        update();
      }
    });
    observer.observe(rootEl);
    opts?.signal?.addEventListener('abort', () => {
      observer.disconnect();
    });
  }

  update();
}

/**
 * A Lit directive that adds slider styling and functionality to its element.
 *
 * @example
 * ```ts
 * html`
 *   <div class="${slider()}">
 *     <input type="range" class="slider-end focus-ring-target" min="0" max="100" value="50">
 *     <div class="slider-track">
 *       <div class="slider-inactive-lead slider-track-box"></div>
 *       <div class="slider-active slider-track-box"></div>
 *       <div class="slider-inactive-trail slider-track-box"></div>
 *       <div class="slider-boundary-stop slider-end"></div>
 *     </div>
 *     <div class="slider-handles">
 *       <div class="slider-handle slider-end"></div>
 *     </div>
 *   </div>
 * `;
 * ```
 */
export const slider = createClassMapDirective({
  getClasses: sliderClasses,
  setupElement: setupSlider,
});

/**
 * Formats an automatic value indicator numeric value according to character limit rules:
 * - Reduced fractional digits until the rendered string fits 4 characters.
 * - Integers pass through as-is even if longer than 4 characters.
 * - Examples: 73.625 -> '73.6', 100.5 -> '101', -12.75 -> '-13', 0.25 -> '0.25', 1000 -> '1000', -50 -> '-50'.
 */
export function formatValueIndicatorLabel(value?: number): string {
  if (value === undefined || !isFinite(value)) return '';
  if (Number.isInteger(value)) return String(value);
  const raw = String(value);
  if (raw.length <= 4) return raw;

  const dotIndex = raw.indexOf('.');
  const maxDecimals = dotIndex >= 0 ? raw.length - dotIndex - 1 : 0;
  for (let d = maxDecimals - 1; d >= 0; d--) {
    const formatted = Number(value.toFixed(d)).toString();
    if (formatted.length <= 4) {
      return formatted;
    }
  }
  return Number(value.toFixed(0)).toString();
}
