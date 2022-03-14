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
export interface MDCTabAdapter {
  /**
   * Adds the given className to the root element.
   * @param className The className to add
   */
  addClass(className: string): void;

  /**
   * Removes the given className from the root element.
   * @param className The className to remove
   */
  removeClass(className: string): void;

  /**
   * Returns whether the root element has the given className.
   * @param className The className to remove
   */
  hasClass(className: string): boolean;

  /**
   * Activates the indicator element.
   * @param previousIndicatorClientRect The client rect of the previously
   *   activated indicator.
   */
  activateIndicator(previousIndicatorClientRect?: DOMRect): void;

  /** Deactivates the indicator. */
  deactivateIndicator(): void;

  /**
   * Emits the MDCTab:interacted event for use by parent components
   */
  notifyInteracted(): void;

  /**
   * Returns the offsetLeft value of the root element.
   */
  getOffsetLeft(): number;

  /**
   * Returns the offsetWidth value of the root element.
   */
  getOffsetWidth(): number;

  /**
   * Returns the offsetLeft of the content element.
   */
  getContentOffsetLeft(): number;

  /**
   * Returns the offsetWidth of the content element.
   */
  getContentOffsetWidth(): number;

  /**
   * Applies focus to the root element
   */
  focus(): void;
}
