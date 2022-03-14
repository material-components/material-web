/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {matches} from '@material/dom/ponyfill';
import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {html} from 'lit';
import {eventOptions, query} from 'lit/decorators.js';

import {MDCTabScrollerAdapter} from './adapter';
import MDCTabScrollerFoundation from './foundation';

export class TabScroller extends BaseElement {
  protected mdcFoundation!: MDCTabScrollerFoundation;

  protected mdcFoundationClass = MDCTabScrollerFoundation;

  @query('.md3-tab-scroller') protected mdcRoot!: HTMLElement;

  @query('.md3-tab-scroller__scroll-area')
  protected scrollAreaElement!: HTMLElement;

  @query('.md3-tab-scroller__scroll-content')
  protected scrollContentElement!: HTMLElement;

  @eventOptions({passive: true})
  protected _handleInteraction() {
    this.mdcFoundation.handleInteraction();
  }

  protected _handleTransitionEnd(e: Event) {
    this.mdcFoundation.handleTransitionEnd(e);
  }

  protected _scrollbarHeight = -1;

  protected override render() {
    return html`
      <div class="md3-tab-scroller">
        <div class="md3-tab-scroller__scroll-area"
            @wheel="${this._handleInteraction}"
            @touchstart="${this._handleInteraction}"
            @pointerdown="${this._handleInteraction}"
            @mousedown="${this._handleInteraction}"
            @keydown="${this._handleInteraction}"
            @transitionend="${this._handleTransitionEnd}">
          <div class="md3-tab-scroller__scroll-content"><slot></slot></div>
        </div>
      </div>
      `;
  }

  protected createAdapter(): MDCTabScrollerAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      eventTargetMatchesSelector: (evtTarget: EventTarget, selector: string) =>
          matches(evtTarget as Element, selector),
      addScrollAreaClass: (className: string) =>
          this.scrollAreaElement.classList.add(className),
      setScrollAreaStyleProperty: (prop: string, value: string) =>
          this.scrollAreaElement.style.setProperty(prop, value),
      setScrollContentStyleProperty: (prop: string, value: string) =>
          this.scrollContentElement.style.setProperty(prop, value),
      getScrollContentStyleValue: (propName: string) =>
          window.getComputedStyle(this.scrollContentElement)
              .getPropertyValue(propName),
      setScrollAreaScrollLeft: (scrollX: number) =>
          this.scrollAreaElement.scrollLeft = scrollX,
      getScrollAreaScrollLeft: () => this.scrollAreaElement.scrollLeft,
      getScrollContentOffsetWidth: () => this.scrollContentElement.offsetWidth,
      getScrollAreaOffsetWidth: () => this.scrollAreaElement.offsetWidth,
      computeScrollAreaClientRect: () =>
          this.scrollAreaElement.getBoundingClientRect(),
      computeScrollContentClientRect: () =>
          this.scrollContentElement.getBoundingClientRect(),
      computeHorizontalScrollbarHeight: () => {
        if (this._scrollbarHeight === -1) {
          this.scrollAreaElement.style.overflowX = 'scroll';
          this._scrollbarHeight = this.scrollAreaElement.offsetHeight -
              this.scrollAreaElement.clientHeight;
          this.scrollAreaElement.style.overflowX = '';
        }
        return this._scrollbarHeight;
      },
    };
  }

  /**
   * Returns the current visual scroll position
   * @return {number}
   */
  getScrollPosition() {
    return this.mdcFoundation.getScrollPosition();
  }

  /**
   * Returns the width of the scroll content
   * @return {number}
   */
  getScrollContentWidth() {
    return this.scrollContentElement.offsetWidth;
  }

  /**
   * Increments the scroll value by the given amount
   * @param {number} scrollXIncrement The pixel value by which to increment the
   *     scroll value
   */
  incrementScrollPosition(scrollXIncrement: number) {
    this.mdcFoundation.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param {number} scrollX The pixel value to scroll to
   */
  scrollToPosition(scrollX: number) {
    this.mdcFoundation.scrollTo(scrollX);
  }
}
