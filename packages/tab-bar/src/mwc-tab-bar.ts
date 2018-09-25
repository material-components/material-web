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
import {BaseElement, html, property, observer, query, customElement, Adapter, Foundation} from '@material/mwc-base/base-element';
import {Tab} from '@material/mwc-tab/mwc-tab.js';
import {TabScroller} from '@material/mwc-tab-scroller/mwc-tab-scroller.js';
import MDCTabBarFoundation from '@material/tab-bar/foundation.js';
import {style} from './mwc-tab-bar-css';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-bar': TabBar;
  }
}

export interface TabBarFoundation extends Foundation {
  scrollIntoView(index: number): void;
  activateTab(index: number): void;
  handleTabInteraction(e: Event): void;
  handleKeyDown(e: Event): void;
}

export declare var TabBarFoundation: {
  prototype: TabBarFoundation;
  new(adapter: Adapter): TabBarFoundation;
}

@customElement('mwc-tab-bar' as any)
export class TabBar extends BaseElement {

  protected mdcFoundation!: MDCTabBarFoundation;

  protected readonly mdcFoundationClass: typeof TabBarFoundation = MDCTabBarFoundation;

  @query('.mdc-tab-bar')
  mdcRoot!: HTMLElement

  @query('mwc-tab-scroller')
  protected scrollerElement!: TabScroller

  @query('slot')
  protected tabsSlot!: HTMLSlotElement

  @observer(function(this: TabBar, value: number) {
    this.mdcFoundation.activateTab(value);
  })
  @property({type: Number})
  activeIndex = 0;

  private _handleTabInteraction = (e) => this.mdcFoundation.handleTabInteraction(e);

  private _handleKeydown = (e) => this.mdcFoundation.handleKeyDown(e);

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <div class="mdc-tab-bar" role="tablist"
          @MDCTab:interacted="${this._handleTabInteraction}"
          @keydown="${this._handleKeydown}">
        <mwc-tab-scroller><slot></slot></mwc-tab-scroller>
      </div>
      `;
  }

  // TODO(sorvell): probably want to memoize this and use a `slotChange` event
  private _getTabs(): Array<Tab> {
    return this.tabsSlot.assignedNodes({flatten: true}).filter((e: Node) => e instanceof Tab) as Array<Tab>;
  }

  createAdapter() {
    return {
      ...super.createAdapter(),
      scrollTo: (scrollX) => this.scrollerElement.scrollTo(scrollX),
      incrementScroll: (scrollXIncrement) => this.scrollerElement.incrementScrollPosition(scrollXIncrement),
      getScrollPosition: () => this.scrollerElement.getScrollPosition(),
      getScrollContentWidth: () => this.scrollerElement.getScrollContentWidth(),
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      isRTL: () => window.getComputedStyle(this.mdcRoot).getPropertyValue('direction') === 'rtl',
      setActiveTab: (index) => this.mdcFoundation.activateTab(index),
      activateTabAtIndex: (index, clientRect) => {
        const tab = this._getTabs()[index];
        if (tab !== undefined) {
          tab.activate(clientRect);
        }
      },
      deactivateTabAtIndex: (index) => {
        const tab = this._getTabs()[index];
        if (tab !== undefined) {
          tab.deactivate()
        }
      },
      focusTabAtIndex: (index) => {
        const tab = this._getTabs()[index];
        if (tab !== undefined) {
          tab.focus();
        }
      },
      getTabIndicatorClientRectAtIndex: (index) => {
        const tab = this._getTabs()[index];
        return tab !== undefined ? tab.computeIndicatorClientRect() : new DOMRect();
      },
      getTabDimensionsAtIndex: (index) => {
        const tab = this._getTabs()[index];
        return tab !== undefined ? tab.computeDimensions() :
            {rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0};
      },
      getPreviousActiveTabIndex: () => {
        const tabs = this._getTabs();
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].active) {
            return i;
          }
        }
        return -1;
      },
      getFocusedTabIndex: () => {
        const tabElements = this._getTabs();
        const activeElement = (this as any).getRootNode().activeElement;
        return tabElements.indexOf(activeElement);
      },
      getIndexOfTab: (tabToFind) => this._getTabs().indexOf(tabToFind),
      getTabListLength: () => this._getTabs().length,
      notifyTabActivated: (index) => this.dispatchEvent(
          new CustomEvent(MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT,
          {detail: {index}, bubbles: true, cancelable: true}))
    };
  }

  createFoundation() {
    super.createFoundation();
    // TODO(sorvell): seems dubious that you can specify activeIndex OR active on a tab...
    const tabs = this._getTabs();
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].active) {
        this.activeIndex = i;
        break;
      }
    }
  }

  scrollIndexIntoView(index: Number) {
    this.mdcFoundation.scrollIntoView(index);
  }

}