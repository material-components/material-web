/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCTabScrollerAdapter {
  /**
   * Returns the scroll content element's computed style value of the given css property `propertyName`.
   * We achieve this via `getComputedStyle(...).getPropertyValue(propertyName)`.
   */
  getScrollContentStyleValue(propertyName: string): string;

  /**
   * Sets the scrollLeft value of the scroll area element to the passed value.
   * @param scrollLeft The new scrollLeft value
   */
  setScrollAreaScrollLeft(scrollLeft: number): void;

  /**
   * Returns the scrollLeft value of the scroll area element.
   */
  getScrollAreaScrollLeft(): number;

  /**
   * Returns the offsetWidth of the scroll content element.
   */
  getScrollContentOffsetWidth(): number;

  /**
   * Returns the offsetWitdth of the scroll area element.
   */
  getScrollAreaOffsetWidth(): number;

  /**
   * Returns the bounding client rect of the scroll area element.
   */
  computeScrollAreaClientRect(): DOMRect;

  /**
   * Returns the bounding client rect of the scroll content element.
   */
  computeScrollContentClientRect(): DOMRect;

  /**
   * Returns an Animation object instance corresponding to the animation applied
   * to the scroll content element using the provided list of keyframes.
   */
  animateScrollContent(keyframes: Keyframe[]): Animation;
}
