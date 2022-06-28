/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCTabScrollerAdapter} from './adapter';
import {MDCTabScrollerAnimation} from './types';

export abstract class MDCTabScrollerRTL {
  constructor(protected readonly adapter: MDCTabScrollerAdapter) {}

  abstract getScrollPositionRTL(translateX: number): number;

  abstract scrollToRTL(scrollX: number): MDCTabScrollerAnimation;

  abstract incrementScrollRTL(scrollX: number): MDCTabScrollerAnimation;

  /**
   * @param scrollX The current scrollX position
   * @param translateX The current translateX position
   */
  abstract getAnimatingScrollPosition(scrollX: number, translateX: number): number;
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabScrollerRTL;
