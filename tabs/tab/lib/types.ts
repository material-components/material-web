/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * MDCTabDimensions provides details about the left and right edges of the Tab
 * root element and the Tab content element. These values are used to determine
 * the visual position of the Tab with respect it's parent container.
 */
export interface MDCTabDimensions {
  rootLeft: number;
  rootRight: number;
  contentLeft: number;
  contentRight: number;
}

export interface TabInteractionEventDetail {
  tabId: string;
}

export type TabInteractionEvent = CustomEvent<TabInteractionEventDetail>;

export interface IndicatorOptions {
  indicatorIcon: string;
  isFadingIndicator: boolean;
  isActive: boolean;
}