/**
 * @requirecss {tabs.tab_scroller.lib.tab_scroller_styles}
 *
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import {BaseElement} from '@material/mwc-base/base-element';
import {Easing} from '@material/web/motion/animation';
import {html, TemplateResult} from 'lit';
import {eventOptions, query, state} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';
import {styleMap} from 'lit/directives/style-map';

import {MDCTabScrollerAdapter} from './adapter';
import MDCTabScrollerFoundation from './foundation';

/** @soyCompatible */
export class TabScroller extends BaseElement {
  protected mdcFoundation!: MDCTabScrollerFoundation;

  protected mdcFoundationClass = MDCTabScrollerFoundation;

  @query('.md3-tab-scroller') protected mdcRoot!: HTMLElement;

  @query('.md3-tab-scroller__scroll-area')
  protected scrollAreaElement!: HTMLElement;

  @query('.md3-tab-scroller__scroll-content')
  protected scrollContentElement!: HTMLElement;

  @eventOptions({passive: true})
  protected handleInteraction() {
    this.mdcFoundation.handleInteraction();
  }

  protected handleKeydown(e: KeyboardEvent) {
    // Keydown events should be propagated up to the tab bar element
    // When converted to a wiz controller, however, the default is to stop
    // event propagation in order to avoid unforseen integration bugs with
    // clients. We, thus, separate out the keydown handler so only the keydown
    // event is bubbled.
    this.handleInteraction();
  }

  protected handleAnimationEnd() {
    this.mdcFoundation.handleAnimationEnd();
  }

  @state() protected scrollbarHeight = -1;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    /** @classMap */
    const scrollAreaClasses = {
      'md3-tab-scroller__scroll-area--scroll': this.scrollbarHeight !== -1,
    };

    /** @styleMap */
    const scrollAreaStyle = {
      'margin-bottom':
          this.scrollbarHeight !== -1 ? `${this.scrollbarHeight}px` : '',
    };
    return html`
      <div class="md3-tab-scroller">
        <div class="md3-tab-scroller__scroll-area ${
        classMap(scrollAreaClasses)}"
            @wheel="${this.handleInteraction}"
            @touchstart="${this.handleInteraction}"
            @pointerdown="${this.handleInteraction}"
            @mousedown="${this.handleInteraction}"
            @keydown="${this.handleKeydown}"
            style="${styleMap(scrollAreaStyle)}">
          <div class="md3-tab-scroller__scroll-content"><slot></slot></div>
        </div>
      </div>
      `;
  }

  protected override firstUpdated() {
    super.firstUpdated();
    this.scrollbarHeight = this.computeHorizontalScrollbarHeight();
  }

  protected createAdapter(): MDCTabScrollerAdapter {
    return {
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
      animateScrollContent: (keyframes: Keyframe[]) => {
        const animation = this.scrollContentElement.animate(
            keyframes, {duration: 250, easing: Easing.STANDARD});

        animation.addEventListener('finish', (e: Event) => {
          this.handleAnimationEnd();
        });
        return animation;
      },
    };
  }

  /**
   * Returns the height of the browser's horizontal scrollbars (in px).
   */
  private computeHorizontalScrollbarHeight(): number {
    this.scrollAreaElement.style.overflowX = 'scroll';
    const scrollbarHeight = this.scrollAreaElement.offsetHeight -
        this.scrollAreaElement.clientHeight;
    this.scrollAreaElement.style.overflowX = '';
    return scrollbarHeight;
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
