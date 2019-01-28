/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {BaseElement, html, query, customElement, Adapter, Foundation, eventOptions} from '@material/mwc-base/base-element';
import MDCTabScrollerFoundation from '@material/tab-scroller/foundation.js';
import * as util from '@material/tab-scroller/util.js';
import {style} from './mwc-tab-scroller-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-scroller': TabScroller;
  }
}

export interface TabScrollerFoundation extends Foundation {
  handleInteraction(e: Event): void;
  handleTransitionEnd(e: Event): void;
  scrollTo(scrollX: number): void;
  incrementScroll(scrollX: number): void;
  getScrollPosition(): number;
}

export declare var TabScrollerFoundation: {
  prototype: TabScrollerFoundation;
  new(adapter: Adapter): TabScrollerFoundation;
}

@customElement('mwc-tab-scroller' as any)
export class TabScroller extends BaseElement {

  protected mdcFoundation!: MDCTabScrollerFoundation;

  protected mdcFoundationClass: typeof TabScrollerFoundation = MDCTabScrollerFoundation;

  @query('.mdc-tab-scroller')
  protected mdcRoot!: HTMLElement;

  @query('.mdc-tab-scroller__scroll-area')
  protected scrollAreaElement!: HTMLElement;

  @query('.mdc-tab-scroller__scroll-content')
  protected scrollContentElement!: HTMLElement;

  @eventOptions({passive: true} as EventListenerOptions)
  private _handleInteraction(e: Event) {
    this.mdcFoundation.handleInteraction(e);
  }

  private _handleTransitionEnd(e: Event) {
    this.mdcFoundation.handleTransitionEnd(e);
  }

  private _scrollbarHeight = -1;

  static styles = style;

  render() {
    return html`
      <div class="mdc-tab-scroller">
        <div class="mdc-tab-scroller__scroll-area"
            @wheel="${this._handleInteraction}"
            @touchstart="${this._handleInteraction}"
            @pointerdown="${this._handleInteraction}"
            @mousedown="${this._handleInteraction}"
            @keydown="${this._handleInteraction}"
            @transitionend="${this._handleTransitionEnd}">
          <div class="mdc-tab-scroller__scroll-content"><slot></slot></div>
        </div>
      </div>
      `;
  }

  createAdapter() {
    return {
      ...super.createAdapter(),
      eventTargetMatchesSelector: (evtTarget: EventTarget, selector: string) => {
        const MATCHES = util.getMatchesProperty(HTMLElement.prototype);
        return evtTarget[MATCHES](selector);
      },
      addScrollAreaClass: (className: string) => this.scrollAreaElement.classList.add(className),
      setScrollAreaStyleProperty: (prop: string, value: string) =>
          this.scrollAreaElement.style.setProperty(prop, value),
      setScrollContentStyleProperty: (prop: string, value: string) =>
          this.scrollContentElement.style.setProperty(prop, value),
      getScrollContentStyleValue: (propName: string) =>
          window.getComputedStyle(this.scrollContentElement).getPropertyValue(propName),
      setScrollAreaScrollLeft: (scrollX: number) => this.scrollAreaElement.scrollLeft = scrollX,
      getScrollAreaScrollLeft: () => this.scrollAreaElement.scrollLeft,
      getScrollContentOffsetWidth: () => this.scrollContentElement.offsetWidth,
      getScrollAreaOffsetWidth: () => this.scrollAreaElement.offsetWidth,
      computeScrollAreaClientRect: () => this.scrollAreaElement.getBoundingClientRect(),
      computeScrollContentClientRect: () => this.scrollContentElement.getBoundingClientRect(),
      computeHorizontalScrollbarHeight: () => {
        if (this._scrollbarHeight === -1) {
          this.scrollAreaElement.style.overflowX = 'scroll';
          this._scrollbarHeight = this.scrollAreaElement.offsetHeight - this.scrollAreaElement.clientHeight;;
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
   * @param {number} scrollXIncrement The pixel value by which to increment the scroll value
   */
  incrementScrollPosition(scrollXIncrement: Number) {
    this.mdcFoundation.incrementScroll(scrollXIncrement);
  }

  /**
   * Scrolls to the given pixel position
   * @param {number} scrollX The pixel value to scroll to
   */
  scrollToPosition(scrollX: Number) {
    this.mdcFoundation.scrollTo(scrollX);
  }

}