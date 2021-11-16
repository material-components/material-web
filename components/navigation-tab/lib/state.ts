/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The state of a navigation tab.
 */
export interface MDCNavigationTabState {
  /**
   * Active state of the navigation tab.
   */
  active: boolean;
  /**
   * If true, when inactive label will be hidden.
   */
  hideInactiveLabel: boolean;
}

/**
 * Defines the shape of the adapter expected by the foundation.
 *
 * This adapter is used to delegate state-only updates from the foundation
 * to the component. It does not delegate DOM or rendering logic, such as adding
 * or removing classes.
 */
export interface MDCNavigationTabAdapter {
  /**
   * The state of the component.
   */
  state: MDCNavigationTabState;
  /**
   * Emits an interaction event with the navigation tab's state in the detail.
   */
  emitInteractionEvent(state: MDCNavigationTabState): void;
}
