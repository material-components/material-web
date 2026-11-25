/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Circular progress thickness options. */
export type ProgressThickness = 'normal' | 'thick';

/** Circular progress variant options. */
export type ProgressVariant = 'normal' | 'wavy';

/** Circular progress classes constants. */
export const CIRCULAR_PROGRESS_CLASSES = {
  active: 'circular-progress-active',
  determinate: 'circular-progress-determinate',
  fourColor: 'circular-progress-four-color',
  indeterminate: 'circular-progress-indeterminate',
  progress: 'circular-progress',
  svg: 'circular-progress-svg',
  thick: 'circular-progress-thick',
  track: 'circular-progress-track',
  wavy: 'circular-progress-wavy',
} as const;

/** The state provided to the `circularProgressClasses()` function. */
export interface CircularProgressClassesState {
  /** Whether the indicator uses 4 colors in indeterminate mode. */
  fourColor?: boolean;
  /** Whether the indicator is in indeterminate mode. */
  indeterminate?: boolean;
  /** Whether the indicator has a thick stroke. */
  thick?: boolean;
  /** Whether the indicator has a wavy path. */
  wavy?: boolean;
}

/**
 * Returns circular progress classes to apply based on the given state.
 *
 * @param state The state of the circular progress indicator.
 * @return An object of class names and truthy values if they apply.
 */
export function circularProgressClasses({
  fourColor = false,
  indeterminate = false,
  thick = false,
  wavy = false,
}: CircularProgressClassesState = {}): ClassInfo {
  return {
    [CIRCULAR_PROGRESS_CLASSES.progress]: true,
    [CIRCULAR_PROGRESS_CLASSES.determinate]: !indeterminate,
    [CIRCULAR_PROGRESS_CLASSES.indeterminate]: Boolean(indeterminate),
    [CIRCULAR_PROGRESS_CLASSES.thick]: Boolean(thick),
    [CIRCULAR_PROGRESS_CLASSES.wavy]: Boolean(wavy),
    [CIRCULAR_PROGRESS_CLASSES.fourColor]:
      Boolean(fourColor) && Boolean(indeterminate),
  };
}

/**
 * Lit directive for circular progress element class styling.
 *
 * @example
 * ```ts
 * html`<div class="${circularProgress({wavy: true})}">...</div>`;
 * ```
 */
export const circularProgress =
  createClassMapDirective<CircularProgressClassesState>({
    getClasses: circularProgressClasses,
  });
