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
import {BaseElement, html, property, observer, query, customElement} from '@material/mwc-base/base-element.js';
import {Tab} from '@material/mwc-tab';
import {TabScroller} from '@material/mwc-tab-scroller';

// Make TypeScript not remove the imports.
import '@material/mwc-tab';
import '@material/mwc-tab-scroller';

import MDCTabBarFoundation from '@material/tab-bar/foundation';
import {style} from './mwc-tab-bar-css';
import { MDCTabBarAdapter } from '@material/tab-bar/adapter';
import { MDCTabInteractionEvent } from '@material/tab/types';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-bar': TabBar;
  }
}

@customElement('mwc-tab-bar' as any)
export class TabBar extends BaseElement {

  protected mdcFoundation!: MDCTabBarFoundation;

  protected readonly mdcFoundationClass = MDCTabBarFoundation;

  @query('.mdc-tab-bar')
  protected mdcRoot!: HTMLElement

  @query('mwc-tab-scroller')
  protected scrollerElement!: TabScroller

  @query('slot')
  protected tabsSlot!: HTMLSlotElement

  @observer(async function(this: TabBar, value: number) {
    await this.updateComplete;
    // only provoke the foundation if we are out of sync with it, i.e.
    // ignore an foundation generated set.
    if (value !== this._previousActiveIndex) {
      this.mdcFoundation.activateTab(value);
    }
  })
  @property({type: Number})
  activeIndex = 0;

  private _previousActiveIndex = -1;

  private _handleTabInteraction(e: MDCTabInteractionEvent) {
    this.mdcFoundation.handleTabInteraction(e);
  }

  private _handleKeydown(e: KeyboardEvent) {
    this.mdcFoundation.handleKeyDown(e);
  }

  static styles = style;

  // TODO(sorvell): can scroller be optional for perf?
  render() {
    return html`
      <div class="mdc-tab-bar" role="tablist"
          @MDCTab:interacted="${this._handleTabInteraction}"
          @keydown="${this._handleKeydown}">
        <mwc-tab-scroller><slot></slot></mwc-tab-scroller>
      </div>
      `;
  }

  // TODO(sorvell): probably want to memoize this and use a `slotChange` event
  private _getTabs() {
    return this.tabsSlot.assignedNodes({flatten: true}).filter((e: Node) => e instanceof Tab) as Tab[];
  }

  private _getTab(index) {
    return this._getTabs()[index];
  }

  createAdapter(): MDCTabBarAdapter {
    return {
      scrollTo: (scrollX: number) => this.scrollerElement.scrollToPosition(scrollX),
      incrementScroll: (scrollXIncrement: number) => this.scrollerElement.incrementScrollPosition(scrollXIncrement),
      getScrollPosition: () => this.scrollerElement.getScrollPosition(),
      getScrollContentWidth: () => this.scrollerElement.getScrollContentWidth(),
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      isRTL: () => window.getComputedStyle(this.mdcRoot).getPropertyValue('direction') === 'rtl',
      setActiveTab: (index: number) => this.mdcFoundation.activateTab(index),
      activateTabAtIndex: (index: number, clientRect: ClientRect) => {
        const tab = this._getTab(index);
        if (tab !== undefined) {
          tab.activate(clientRect);
        }
        this._previousActiveIndex = index;
      },
      deactivateTabAtIndex: (index: number) => {
        const tab = this._getTab(index);
        if (tab !== undefined) {
          tab.deactivate()
        }
      },
      focusTabAtIndex: (index: number) => {
        const tab = this._getTab(index);
        if (tab !== undefined) {
          tab.focus();
        }
      },
      // TODO(sorvell): tab may not be able to synchronously answer `computeIndicatorClientRect`
      // if an update is pending or it has not yet updated. If this is necessary,
      // LitElement may need a `forceUpdate` method.
      getTabIndicatorClientRectAtIndex: (index: number) => {
        const tab = this._getTab(index);
        return tab !== undefined ? tab.computeIndicatorClientRect() : new DOMRect();
      },
      getTabDimensionsAtIndex: (index: number) => {
        const tab = this._getTab(index);
        return tab !== undefined ? tab.computeDimensions() :
            {rootLeft: 0, rootRight: 0, contentLeft: 0, contentRight: 0};
      },
      getPreviousActiveTabIndex: () => {
        return this._previousActiveIndex;
      },
      getFocusedTabIndex: () => {
        const tabElements = this._getTabs();
        const activeElement = (this as any).getRootNode().activeElement;
        return tabElements.indexOf(activeElement);
      },
      getIndexOfTabById: (id: string) => {
        const tabElements = this._getTabs();
        for (let i = 0; i < tabElements.length; i++) {
          if (tabElements[i].id === id) {
            return i;
          }
        }
        return -1;
      },
      getTabListLength: () => this._getTabs().length,
      notifyTabActivated: (index: number) => {
        // Synchronize the tabs `activeIndex` to the foundation.
        // This is needed when a tab is changed via a click, for example.
        this.activeIndex = index;
        this.dispatchEvent(
          new CustomEvent(MDCTabBarFoundation.strings.TAB_ACTIVATED_EVENT,
            {detail: {index}, bubbles: true, cancelable: true}))
      }
    };
  }

  // NOTE: Delay creating foundation until scroller is fully updated.
  // This is necessary because the foundation/adapter synchronously addresses
  // the scroller element.
  firstUpdated() {}
  get updateComplete() {
    return super.updateComplete
      .then(() => this.scrollerElement.updateComplete)
      .then(() => {
        if (this.mdcFoundation === undefined) {
          this.createFoundation();
        }
      });
  }

  scrollIndexIntoView(index: number) {
    this.mdcFoundation.scrollIntoView(index);
  }

}