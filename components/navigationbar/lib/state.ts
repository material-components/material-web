/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCNavigationTabState} from 'google3/third_party/javascript/material_web_components/m3/navigationtab/lib/state';

/**
 * The state of a navigation Bar.
 */
export interface MDCNavigationBarState {
  /**
   * Index of the active navigation tab.
   */
  activeIndex: number;
  /**
   * If true, inactive navigation tabs will hide their label.
   */
  hideInactiveLabels: boolean;
  /**
   * An array of the navigation tab states.
   */
  tabs: MDCNavigationTabState[];
}

/**
 * Defines the shape of the adapter expected by the foundation.
 *
 * This adapter is used to delegate state-only updates from the foundation
 * to the component. It does not delegate DOM or rendering logic, such as adding
 * or removing classes.
 */
export interface MDCNavigationBarAdapter {
  /**
   * The state of the component.
   */
  state: MDCNavigationBarState;
  /**
   * Focuses the navigation tab at the given index.
   */
  focusTab(index: number): void;
  /**
   * Returns the index of the focused navigation tab.
   */
  getFocusedTabIndex(): number;
  /**
   * Returns true if the text direction is right-to-left.
   */
  isRTL(): boolean;
}
