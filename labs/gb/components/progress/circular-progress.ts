/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Circular progress classes. */
export const CIRCULAR_PROGRESS_CLASSES = {
  circularProgress: 'circular-progress',
  indeterminate: 'indeterminate',
} as const;

/** The state provided to the `circularProgressClasses()` function. */
export interface CircularProgressClassesState {
  /** Whether the progress is indeterminate. */
  indeterminate?: boolean;
}

/**
 * Returns the circular progress root classes to apply to an element.
 *
 * @param state The state of the circular progress.
 * @return An object of class names and truthy values if they apply.
 */
export function circularProgressClasses({
  indeterminate = false,
}: CircularProgressClassesState = {}): ClassInfo {
  return {
    [CIRCULAR_PROGRESS_CLASSES.circularProgress]: true,
    [CIRCULAR_PROGRESS_CLASSES.indeterminate]: indeterminate,
  };
}

/**
 * A Lit directive that adds circular progress root styling to its element.
 *
 * @example
 * ```ts
 * html`<div class="${circularProgress({indeterminate: true})}"></div>`;
 * ```
 */
export const circularProgress =
  createClassMapDirective<CircularProgressClassesState>({
    getClasses: circularProgressClasses,
  });

const DEG_STEP = (2 * Math.PI) / 360;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Options for {@link circularWavePath}.
 */
export interface CircularWaveOptions {
  /** The size of the square viewBox the ring is inscribed in. */
  size: number;
  /** The stroke width of the ring, used to inset the ring from the edge. */
  strokeWidth: number;
  /** The wave amplitude, in viewBox units. */
  amplitude: number;
  /** The wave wavelength, in viewBox units. */
  wavelength: number;
  /** The phase offset of the wave, in radians. */
  phase?: number;
  /** Whether to render a wave. When false, a plain ring is returned. */
  wavy?: boolean;
}

/**
 * Builds the SVG path `d` for a closed ring inscribed in a square viewBox of
 * `size` units.
 *
 * The number of wave cycles is rounded to an integer so the wave closes on
 * itself without a visible seam. When `wavy` is false (or `amplitude`/
 * `wavelength` is not positive) a plain circle (sampled as a closed polygon) is
 * returned at the same mean radius, so a wavy active indicator and a smooth
 * track stay concentric.
 */
export function circularWavePath(options: CircularWaveOptions): string {
  const {
    size,
    strokeWidth,
    amplitude,
    wavelength,
    phase = 0,
    wavy = true,
  } = options;
  const center = size / 2;
  const safeAmplitude = amplitude > 0 ? amplitude : 0;
  // Reserve room for the wave peaks so the smooth track and the wavy active
  // indicator share the same mean radius.
  const radius = center - strokeWidth / 2 - safeAmplitude;

  if (radius <= 0) {
    return '';
  }

  const circumference = 2 * Math.PI * radius;
  const waves =
    wavy && safeAmplitude > 0 && wavelength > 0
      ? Math.max(1, Math.round(circumference / wavelength))
      : 0;
  const oscillation = waves > 0 ? safeAmplitude : 0;

  const points: string[] = [];
  for (let angle = 0; angle < 2 * Math.PI; angle += DEG_STEP) {
    const r = radius + oscillation * Math.sin(waves * angle + phase);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    points.push(`${round(x)},${round(y)}`);
  }

  return `M${points[0]} L${points.slice(1).join(' ')} Z`;
}
