/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCTabScrollerRTL} from './rtl-scroller';
import {MDCTabScrollerAnimation, MDCTabScrollerHorizontalEdges} from './types';

export class MDCTabScrollerRTLDefault extends MDCTabScrollerRTL {
  getScrollPositionRTL(): number {
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    const {right} = this.calculateScrollEdges();
    // Scroll values on most browsers are ints instead of floats so we round
    return Math.round(right - currentScrollLeft);
  }

  scrollToRTL(scrollX: number): MDCTabScrollerAnimation {
    const edges = this.calculateScrollEdges();
    const currentScrollLeft = this.adapter.getScrollAreaScrollLeft();
    const clampedScrollLeft = this.clampScrollValue(edges.right - scrollX);
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

  getAnimatingScrollPosition(scrollX: number): number {
    return scrollX;
  }

  private calculateScrollEdges(): MDCTabScrollerHorizontalEdges {
    const contentWidth = this.adapter.getScrollContentOffsetWidth();
    const rootWidth = this.adapter.getScrollAreaOffsetWidth();
    return {
      left: 0,
      right: contentWidth - rootWidth,
    };
  }

  private clampScrollValue(scrollX: number): number {
    const edges = this.calculateScrollEdges();
    return Math.min(Math.max(edges.left, scrollX), edges.right);
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabScrollerRTLDefault;
