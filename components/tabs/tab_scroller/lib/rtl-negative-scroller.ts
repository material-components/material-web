/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCTabScrollerRTL} from './rtl-scroller';
import {MDCTabScrollerAnimation, MDCTabScrollerHorizontalEdges} from './types';

export class MDCTabScrollerRTLNegative extends MDCTabScrollerRTL {
  getScrollPositionRTL(translateX: number): number {
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    return Math.round(translateX - currentScrollLeft);
  }

  scrollToRTL(scrollX: number): MDCTabScrollerAnimation {
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    const clampedScrollLeft = this.clampScrollValue(-scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft,
    };
  }

  incrementScrollRTL(scrollX: number): MDCTabScrollerAnimation {
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    const clampedScrollLeft =
        this.clampScrollValue(currentScrollLeft - scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: clampedScrollLeft - currentScrollLeft,
    };
  }

  getAnimatingScrollPosition(scrollX: number, translateX: number): number {
    return scrollX - translateX;
  }

  private calculateScrollEdges(): MDCTabScrollerHorizontalEdges {
    const contentWidth = this.adapter.getScrollContentOffsetWidth();
    const rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: rootWidth - contentWidth,
      right: 0,
    };
  }

  private clampScrollValue(scrollX: number): number {
    const edges = this.calculateScrollEdges();
    return Math.max(Math.min(edges.right, scrollX), edges.left);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabScrollerRTLNegative;
