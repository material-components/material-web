/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCTabScrollerRTL} from './rtl-scroller.js';
import {MDCTabScrollerAnimation, MDCTabScrollerHorizontalEdges} from './types.js';

export class MDCTabScrollerRTLReverse extends MDCTabScrollerRTL {
  getScrollPositionRTL(translateX: number): number {
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    // Scroll values on most browsers are ints instead of floats so we round
    return Math.round(currentScrollLeft - translateX);
  }

  scrollToRTL(scrollX: number): MDCTabScrollerAnimation {
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    const clampedScrollLeft = this.clampScrollValue(scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: currentScrollLeft - clampedScrollLeft,
    };
  }

  incrementScrollRTL(scrollX: number): MDCTabScrollerAnimation {
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    const clampedScrollLeft =
        this.clampScrollValue(currentScrollLeft + scrollX);
    return {
      finalScrollPosition: clampedScrollLeft,
      scrollDelta: currentScrollLeft - clampedScrollLeft,
    };
  }

  getAnimatingScrollPosition(scrollX: number, translateX: number): number {
    return scrollX + translateX;
  }

  private calculateScrollEdges(): MDCTabScrollerHorizontalEdges {
    const contentWidth = this.adapter.getScrollContentOffsetWidth();
    const rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: contentWidth - rootWidth,
      right: 0,
    };
  }

  private clampScrollValue(scrollX: number): number {
    const edges = this.calculateScrollEdges();
    return Math.min(Math.max(edges.right, scrollX), edges.left);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabScrollerRTLReverse;
