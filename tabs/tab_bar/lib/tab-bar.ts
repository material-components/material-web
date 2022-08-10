/**
 * @requirecss {tabs.tab_bar.lib.shared_styles}
 *
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {BaseElement} from '@material/mwc-base/base-element';
import {deepActiveElementPath} from '@material/mwc-base/utils';
import {html, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

import {PrimaryTab} from '../../tab/lib/primary-tab';
import {SecondaryTab} from '../../tab/lib/secondary-tab';
import {TabInteractionEvent} from '../../tab/lib/types';
import {TabScroller} from '../../tab_scroller/lib/tab-scroller';

import {MDCTabBarAdapter} from './adapter';
import MDCTabBarFoundation from './foundation';
import {TabBarActivatedEvent, TabBarActivatedEventDetail} from './types';

/** @soyCompatible */
export abstract class TabBar extends BaseElement {
  protected mdcFoundation!: MDCTabBarFoundation;

  protected readonly mdcFoundationClass = MDCTabBarFoundation;

  @query('.md3-tab-bar') protected mdcRoot!: HTMLElement;

  @query('.md3-tab-bar__scroller') protected scrollerElement!: TabScroller;

  // tabsSlot should have type HTMLSlotElement, but when TypeScript's
  // emitDecoratorMetadata is enabled, the HTMLSlotElement constructor will
  // be emitted into the runtime, which will cause an "HTMLSlotElement is
  // undefined" error in browsers that don't define it (e.g. IE11).
  @queryAssignedElements({flatten: true}) protected tabsSlot!: HTMLElement[];

  @property({type: Number}) activeIndex = 0;

  protected _previousActiveIndex = -1;

  protected async _handleTabInteraction(e: TabInteractionEvent) {
    await this.updateComplete;
    this.mdcFoundation.handleTabInteraction(e);
  }

  protected async _handleKeydown(e: KeyboardEvent) {
    await this.updateComplete;
    this.mdcFoundation.handleKeyDown(e);
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <div class="${classMap(this.getRootClasses())}"
           role="tablist"
           @keydown="${this._handleKeydown}"
           @tab-interaction="${this._handleTabInteraction}">
        ${this.renderTabScroller()}
      </div>
      `;
  }

  /** @soyTemplate */
  protected renderTabScroller(): TemplateResult {
    return html``;
  }

  /** @soyTemplate */
  protected getRootClasses(): ClassInfo {
    return {
      'md3-tab-bar': true,
    };
  }

  protected abstract getTabs(): PrimaryTab[]|SecondaryTab[];

  protected getTab(index: number) {
    return this.getTabs()[index];
  }

  protected getActiveTabIndex() {
    const tabElements = this.getTabs();
    const activeElementPath = deepActiveElementPath();
    const focusedTabIndex = tabElements.findIndex((tab) => {
      return tab.mdcRoot === activeElementPath[activeElementPath.length - 1];
    });
    return focusedTabIndex;
  }

  protected createAdapter(): MDCTabBarAdapter {
    return {
      scrollTo: (scrollX: number) =>
          this.scrollerElement.scrollToPosition(scrollX),
      incrementScroll: (scrollXIncrement: number) =>
          this.scrollerElement.incrementScrollPosition(scrollXIncrement),
      getScrollPosition: () => this.scrollerElement.getScrollPosition(),
      getScrollContentWidth: () => this.scrollerElement.getScrollContentWidth(),
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      isRTL: () => window.getComputedStyle(this.mdcRoot)
                       .getPropertyValue('direction') === 'rtl',
      setActiveTab: (index: number) => this.mdcFoundation.activateTab(index),
      activateTabAtIndex: (index: number, clientRect: DOMRect) => {
        const tab = this.getTab(index);
        if (tab !== undefined) {
          tab.activate(clientRect);
        }
        this._previousActiveIndex = index;
      },
      deactivateTabAtIndex: (index: number) => {
        const tab = this.getTab(index);
        if (tab !== undefined) {
          tab.deactivate();
        }
      },
      focusTabAtIndex: (index: number) => {
        const tab = this.getTab(index);
        if (tab !== undefined) {
          tab.focus();
        }
      },
      // TODO(sorvell): tab may not be able to synchronously answer
      // `computeIndicatorClientRect` if an update is pending or it has not yet
      // updated. If this is necessary, LitElement may need a `forceUpdate`
      // method.
      getTabIndicatorClientRectAtIndex: (index: number) => {
        const tab = this.getTab(index);
        return tab !== undefined ? tab.computeIndicatorClientRect() :
                                   new DOMRect();
      },
      getTabDimensionsAtIndex: (index: number) => {
        const tab = this.getTab(index);
        if (tab === undefined) {
          return {rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0};
        }

        // In certain shadow DOM environments, the offsetLeft value of the tab
        // is not calculated in relation to the scollerContent element. We
        // examine the tab's offsetParent to determine if this is the case. If
        // so, then we provide tab's computeDimensions method the offsetLeft of
        // the scrollers' contentElement so the proper offsetLeft value can
        // be calculated. See b/242052409 for more info.
        const tabOffsetParent = tab.offsetParent;
        let scrollContentOffsetLeft;
        if (!this.scrollerElement.isScrollerContentElement(tabOffsetParent)) {
          scrollContentOffsetLeft =
              this.scrollerElement.getScrollContentOffsetLeft();
        }
        return tab.computeDimensions(scrollContentOffsetLeft);
      },
      getPreviousActiveTabIndex: () => {
        return this._previousActiveIndex;
      },
      getFocusedTabIndex: () => {
        return this.getActiveTabIndex();
      },
      getIndexOfTabById: (id: string) => {
        const tabElements = this.getTabs();
        for (let i = 0; i < tabElements.length; i++) {
          if (tabElements[i].id === id) {
            return i;
          }
        }
        return -1;
      },
      getTabListLength: () => this.getTabs().length,
      notifyTabActivated: (index: number) => {
        // Synchronize the tabs `activeIndex` to the foundation.
        // This is needed when a tab is changed via a click, for example.
        this.activeIndex = index;
        const event: TabBarActivatedEvent =
            new CustomEvent<TabBarActivatedEventDetail>(
                'tab-bar-activated',
                {detail: {index}, bubbles: true, cancelable: true});
        this.dispatchEvent(event);
      },
    };
  }

  protected override firstUpdated() {
    // NOTE: Delay creating foundation until scroller is fully updated.
    // This is necessary because the foundation/adapter synchronously addresses
    // the scroller element.
  }

  protected override async getUpdateComplete() {
    const result = await super.getUpdateComplete();
    await this.scrollerElement.updateComplete;
    if (this.mdcFoundation === undefined) {
      this.createFoundation();
    }
    return result;
  }

  protected override async updated(changedProperties: PropertyValues) {
    await this.updateComplete;
    // only provoke the foundation if we are out of sync with it, i.e.
    // ignore an foundation generated set.
    // use `activeIndex` directly to avoid staleness if it was set before the
    // first render.
    if (this.activeIndex !== this._previousActiveIndex) {
      this.mdcFoundation.activateTab(this.activeIndex);
    }
  }

  scrollIndexIntoView(index: number) {
    this.mdcFoundation.scrollIntoView(index);
  }

  getTabIdByIndex(index: number): string|undefined {
    const tabs = this.getTabs();
    return tabs[index]?.id;
  }

  getIndexOfTabById(id: string): number {
    const tabs = this.getTabs();
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].id === id) {
        return i;
      }
    }
    return -1;
  }
}
