/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Linear progress classes. */
export const LINEAR_PROGRESS_CLASSES = {
  linearProgress: 'linear-progress',
  indeterminate: 'indeterminate',
} as const;

/** The state provided to the `linearProgressClasses()` function. */
export interface LinearProgressClassesState {
  /** Whether the progress is indeterminate. */
  indeterminate?: boolean;
}

/**
 * Returns the linear progress root classes to apply to an element.
 *
 * @param state The state of the linear progress.
 * @return An object of class names and truthy values if they apply.
 */
export function linearProgressClasses({
  indeterminate = false,
}: LinearProgressClassesState = {}): ClassInfo {
  return {
    [LINEAR_PROGRESS_CLASSES.linearProgress]: true,
    [LINEAR_PROGRESS_CLASSES.indeterminate]: indeterminate,
  };
}

/**
 * A Lit directive that adds linear progress root styling to its element.
 *
 * @example
 * ```ts
 * html`<div class="${linearProgress({indeterminate: true})}"></div>`;
 * ```
 */
export const linearProgress =
  createClassMapDirective<LinearProgressClassesState>({
    getClasses: linearProgressClasses,
  });

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Options for {@link linearWavePath}.
 */
export interface LinearWaveOptions {
  /** The width of the wave, in pixels. */
  width: number;
  /** The height of the wave's viewBox, in pixels. */
  height: number;
  /** The wave amplitude, in pixels. */
  amplitude: number;
  /** The wave wavelength, in pixels. */
  wavelength: number;
  /** The phase offset of the wave, in radians. */
  phase?: number;
  /** Whether to render a wave. When false, a straight line is returned. */
  wavy?: boolean;
}

/**
 * Builds the SVG path `d` for a horizontal sine wave centered vertically.
 *
 * When `wavy` is false (or `amplitude`/`wavelength`/`width` is not positive) a
 * straight line is returned.
 */
export function linearWavePath(options: LinearWaveOptions): string {
  const {
    width,
    height,
    amplitude,
    wavelength,
    phase = 0,
    wavy = true,
  } = options;
  const center = height / 2;

  if (!wavy || amplitude <= 0 || wavelength <= 0 || width <= 0) {
    return `M0,${round(center)} L${round(Math.max(width, 0))},${round(center)}`;
  }

  const k = (2 * Math.PI) / wavelength;
  const points: string[] = [];
  for (let x = 0; x < width; x += 1) {
    const y = center + amplitude * Math.sin(k * x + phase);
    points.push(`${round(x)},${round(y)}`);
  }
  const endY = center + amplitude * Math.sin(k * width + phase);
  points.push(`${round(width)},${round(endY)}`);

  return `M${points[0]} L${points.slice(1).join(' ')}`;
}
