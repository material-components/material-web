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
export interface MDCTabIndicatorAdapter {
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
   * Returns the client rect of the content element.
   */
  computeContentClientRect(): DOMRect;

  /**
   * Sets a style property of the content element to the passed value
   * @param propName The style property name to set
   * @param value The style property value
   */
  setContentStyleProperty(propName: string, value: string): void;
}
