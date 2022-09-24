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

import {MDCResizeObserver, MDCResizeObserverCallback} from './types.js';

export interface MDCLinearProgressAdapter {
  addClass(className: string): void;
  /**
   * If available, creates a `ResizeObserver` object, invokes the `#observe`
   * method on the root element. This is used for an optional performance gains
   * for the indeterminate animation on modern browsers.
   *
   * @param callback The callback to apply to the constructor of the
   *    `ResizeObserver`
   * @return Returns a `ResizeObserver` that has had `observe` called on the
   *    root element with the given callback. `null` if `ResizeObserver` is not
   *    implemented or polyfilled.
   */
  attachResizeObserver(callback: MDCResizeObserverCallback): MDCResizeObserver
      |null;
  forceLayout(): void;
  setBufferBarStyle(styleProperty: string, value: string): void;
  setPrimaryBarStyle(styleProperty: string, value: string): void;
  /**
   * Sets the inline style on the root element.
   * @param styleProperty The style property to set.
   * @param value The value the style property should be set to.
   */
  setStyle(styleProperty: string, value: string): void;
  /**
   * @return The width of the root element.
   */
  getWidth(): number;
  hasClass(className: string): boolean;
  removeClass(className: string): void;
  removeAttribute(name: string): void;
  setAttribute(name: string, value: string): void;
}
