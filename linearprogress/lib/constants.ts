/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const cssClasses = {
  CLOSED_CLASS: 'md3-linear-progress--closed',
  CLOSED_ANIMATION_OFF_CLASS: 'md3-linear-progress--closed-animation-off',
  INDETERMINATE_CLASS: 'md3-linear-progress--indeterminate',
  REVERSED_CLASS: 'md3-linear-progress--reversed',
  ANIMATION_READY_CLASS: 'md3-linear-progress--animation-ready',
};

export const strings = {
  ARIA_HIDDEN: 'aria-hidden',
  ARIA_VALUEMAX: 'aria-valuemax',
  ARIA_VALUEMIN: 'aria-valuemin',
  ARIA_VALUENOW: 'aria-valuenow',
  BUFFER_BAR_SELECTOR: '.md3-linear-progress__buffer-bar',
  FLEX_BASIS: 'flex-basis',
  PRIMARY_BAR_SELECTOR: '.md3-linear-progress__primary-bar',
};

// these are percentages pulled from keyframes.scss
export const animationDimensionPercentages = {
  PRIMARY_HALF: .8367142,
  PRIMARY_FULL: 2.00611057,
  SECONDARY_QUARTER: .37651913,
  SECONDARY_HALF: .84386165,
  SECONDARY_FULL: 1.60277782,
};
