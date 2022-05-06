/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCTabDimensions} from '../../tab/lib/types.js';

/**
 * Defines the shape of the adapter expected by the foundation.
 * Implement this adapter for your framework of choice to delegate updates to
 * the component in your framework of choice. See architecture documentation
 * for more details.
 * https://github.com/material-components/material-components-web/blob/master/docs/code/architecture.md
 */
export interface MDCTabBarAdapter {
  /**
   * Scrolls to the given position
   * @param scrollX The position to scroll to
   */
  scrollTo(scrollX: number): void;

  /**
   * Increments the current scroll position by the given amount
   * @param scrollXIncrement The amount to increment scroll
   */
  incrementScroll(scrollXIncrement: number): void;

  /**
   * Returns the current scroll position
   */
  getScrollPosition(): number;

  /**
   * Returns the width of the scroll content
   */
  getScrollContentWidth(): number;

  /**
   * Returns the root element's offsetWidth
   */
  getOffsetWidth(): number;

  /**
   * Returns if the Tab Bar language direction is RTL
   */
  isRTL(): boolean;

  /**
   * Sets the tab at the given index to be activated
   * @param index The index of the tab to activate
   */
  setActiveTab(index: number): void;

  /**
   * Activates the tab at the given index with the given client rect
   * @param index The index of the tab to activate
   * @param clientRect The client rect of the previously active Tab Indicator
   */
  activateTabAtIndex(index: number, clientRect?: DOMRect): void;

  /**
   * Deactivates the tab at the given index
   * @param index The index of the tab to deactivate
   */
  deactivateTabAtIndex(index: number): void;

  /**
   * Focuses the tab at the given index
   * @param index The index of the tab to focus
   */
  focusTabAtIndex(index: number): void;

  /**
   * Returns the client rect of the tab's indicator
   * @param index The index of the tab
   */
  getTabIndicatorClientRectAtIndex(index: number): DOMRect;

  /**
   * Returns the tab dimensions of the tab at the given index
   * @param index The index of the tab
   */
  getTabDimensionsAtIndex(index: number): MDCTabDimensions;

  /**
   * Returns the length of the tab list
   */
  getTabListLength(): number;

  /**
   * Returns the index of the previously active tab
   */
  getPreviousActiveTabIndex(): number;

  /**
   * Returns the index of the focused tab
   */
  getFocusedTabIndex(): number;

  /**
   * Returns the index of the given tab
   * @param id The ID of the tab whose index to determine
   */
  getIndexOfTabById(id: string): number;

  /**
   * Emits the MDCTabBar:activated event
   * @param index The index of the activated tab
   */
  notifyTabActivated(index: number): void;
}
