/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Linear progress thickness options. */
export type ProgressThickness = 'normal' | 'thick';

/** Linear progress variant options. */
export type ProgressVariant = 'normal' | 'wavy';

/** Linear progress classes constants. */
export const LINEAR_PROGRESS_CLASSES = {
  active: 'linear-progress-active',
  determinate: 'linear-progress-determinate',
  fourColor: 'linear-progress-four-color',
  indeterminate: 'linear-progress-indeterminate',
  progress: 'linear-progress',
  stopIndicator: 'linear-progress-stop-indicator',
  svg: 'linear-progress-svg',
  thick: 'linear-progress-thick',
  track: 'linear-progress-track',
  wavy: 'linear-progress-wavy',
} as const;

/** The state provided to the `linearProgressClasses()` function. */
export interface LinearProgressClassesState {
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
 * Returns linear progress classes to apply based on the given state.
 *
 * @param state The state of the linear progress indicator.
 * @return An object of class names and truthy values if they apply.
 */
export function linearProgressClasses({
  fourColor = false,
  indeterminate = false,
  thick = false,
  wavy = false,
}: LinearProgressClassesState = {}): ClassInfo {
  return {
    [LINEAR_PROGRESS_CLASSES.progress]: true,
    [LINEAR_PROGRESS_CLASSES.determinate]: !indeterminate,
    [LINEAR_PROGRESS_CLASSES.indeterminate]: Boolean(indeterminate),
    [LINEAR_PROGRESS_CLASSES.thick]: Boolean(thick),
    [LINEAR_PROGRESS_CLASSES.wavy]: Boolean(wavy),
    [LINEAR_PROGRESS_CLASSES.fourColor]:
      Boolean(fourColor) && Boolean(indeterminate),
  };
}

/**
 * Lit directive for linear progress element class styling.
 *
 * @example
 * ```ts
 * html`<div class="${linearProgress({wavy: true})}">...</div>`;
 * ```
 */
export const linearProgress =
  createClassMapDirective<LinearProgressClassesState>({
    getClasses: linearProgressClasses,
  });
