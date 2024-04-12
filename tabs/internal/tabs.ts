/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../divider/divider.js';

import {html, isServer, LitElement} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';

import {ANIMATE_INDICATOR, Tab} from './tab.js';

/**
 * @fires change {Event} Fired when the selected tab changes. The target's selected or
 * selectedItem and previousSelected or previousSelectedItem provide information
 * about the selection change. The change event is fired when a user interaction
 * like a space/enter key or click cause a selection change. The tab selection
 * based on these actions can be cancelled by calling preventDefault on the
 * triggering `keydown` or `click` event. --bubbles
 *
 * @example
 * // perform an action if a tab is clicked
 * tabs.addEventListener('change', (event: Event) => {
 *   if (event.target.selected === 2)
 *      takeAction();
 *   }
 * });
 *
 * // prevent a click from triggering tab selection under some condition
 * tabs.addEventListener('click', (event: Event) => {
 *   if (notReady)
 *      event.preventDefault();
 *   }
 * });
 *
 */
export class Tabs extends LitElement {
  /**
   * The tabs of this tab bar.
   */
  @queryAssignedElements({flatten: true, selector: '[md-tab]'})
  readonly tabs!: Tab[];

  /**
   * The currently selected tab, `null` only when there are no tab children.
   *
   * @export
   */
  get activeTab() {
    return this.tabs.find((tab) => tab.active) ?? null;
  }
  set activeTab(tab: Tab | null) {
    // Ignore setting activeTab to null. As long as there are children, one tab
    // must be selected.
    if (tab) {
      this.activateTab(tab);
    }
  }

  /**
   * The index of the currently selected tab.
   *
   * @export
   */
  @property({type: Number, attribute: 'active-tab-index'})
  get activeTabIndex() {
    return this.tabs.findIndex((tab) => tab.active);
  }
  set activeTabIndex(index: number) {
    const activateTabAtIndex = () => {
      const tab = this.tabs[index];
      // Ignore out-of-bound indices.
      if (tab) {
        this.activateTab(tab);
      }
    };

    if (!this.slotElement) {
      // This is needed to support setting the activeTabIndex via a lit property
      // binding.
      //
      // ```ts
      // html`
      //   <md-tabs .activeTabIndex=${1}>
      //     <md-tab>First</md-tab>
      //     <md-tab>Second</md-tab>
      //   </md-tabs>
      // `;
      // ```
      //
      // It's needed since lit's rendering lifecycle is asynchronous, and the
      // `<slot>` element hasn't rendered, so `tabs` is empty.
      this.updateComplete.then(activateTabAtIndex);
      return;
    }

    activateTabAtIndex();
  }

  /**
   * Whether or not to automatically select a tab when it is focused.
   */
  @property({type: Boolean, attribute: 'auto-activate'}) autoActivate = false;

  @query('.tabs') private readonly tabsScrollerElement!: HTMLElement | null;
  @query('slot') private readonly slotElement!: HTMLSlotElement | null;

  private get focusedTab() {
    return this.tabs.find((tab) => tab.matches(':focus-within'));
  }

  private readonly internals =
    // Cast needed for closure
    (this as HTMLElement).attachInternals();

  constructor() {
    super();
    if (!isServer) {
      this.internals.role = 'tablist';
      this.addEventListener('keydown', this.handleKeydown.bind(this));
      this.addEventListener('keyup', this.handleKeyup.bind(this));
      this.addEventListener('focusout', this.handleFocusout.bind(this));
    }
  }

  /**
   * Scrolls the toolbar, if overflowing, to the active tab, or the provided
   * tab.
   *
   * @param tabToScrollTo The tab that should be scrolled to. Defaults to the
   *     active tab.
   * @return A Promise that resolves after the tab has been scrolled to.
   */
  async scrollToTab(tabToScrollTo?: Tab | null) {
    await this.updateComplete;
    const {tabs} = this;
    tabToScrollTo ??= this.activeTab;
    if (
      !tabToScrollTo ||
      !tabs.includes(tabToScrollTo) ||
      !this.tabsScrollerElement
    ) {
      return;
    }

    // wait for tabs to render.
    for (const tab of this.tabs) {
      await tab.updateComplete;
    }

    const offset = tabToScrollTo.offsetLeft;
    const extent = tabToScrollTo.offsetWidth;
    const scroll = this.scrollLeft;
    const hostExtent = this.offsetWidth;
    const scrollMargin = 48;
    const min = offset - scrollMargin;
    const max = offset + extent - hostExtent + scrollMargin;
    const to = Math.min(min, Math.max(max, scroll));
    // When a tab is focused, use 'auto' to use the CSS `scroll-behavior`. The
    // default behavior is smooth scrolling. However, when there is not a tab
    // focused on initialization, use 'instant' to immediately bring the focused
    // tab into view.
    const behavior: ScrollBehavior = !this.focusedTab ? 'instant' : 'auto';
    this.tabsScrollerElement.scrollTo({behavior, top: 0, left: to});
  }

  protected override render() {
    return html`
      <div class="tabs">
        <slot
          @slotchange=${this.handleSlotChange}
          @click=${this.handleTabClick}></slot>
      </div>
      <md-divider part="divider"></md-divider>
    `;
  }

  private async handleTabClick(event: Event) {
    const tab = event.target;
    // Allow event to bubble
    await 0;
    if (event.defaultPrevented || !isTab(tab) || tab.active) {
      return;
    }

    this.activateTab(tab);
  }

  private activateTab(activeTab: Tab) {
    const {tabs} = this;
    const previousTab = this.activeTab;
    if (!tabs.includes(activeTab) || previousTab === activeTab) {
      // Ignore setting activeTab to a tab element that is not a child.
      return;
    }

    for (const tab of tabs) {
      tab.active = tab === activeTab;
    }

    if (previousTab) {
      // Don't dispatch a change event if activating a tab when no previous tabs
      // were selected, such as when md-tabs auto-selects the first tab.
      const defaultPrevented = !this.dispatchEvent(
        new Event('change', {bubbles: true, cancelable: true}),
      );
      if (defaultPrevented) {
        for (const tab of tabs) {
          tab.active = tab === previousTab;
        }
        return;
      }

      activeTab[ANIMATE_INDICATOR](previousTab);
    }

    this.updateFocusableTab(activeTab);
    this.scrollToTab(activeTab);
  }

  private updateFocusableTab(focusableTab: Tab) {
    for (const tab of this.tabs) {
      tab.tabIndex = tab === focusableTab ? 0 : -1;
    }
  }

  // focus item on keydown and optionally select it
  private async handleKeydown(event: KeyboardEvent) {
    // Allow event to bubble.
    await 0;
    const isLeft = event.key === 'ArrowLeft';
    const isRight = event.key === 'ArrowRight';
    const isHome = event.key === 'Home';
    const isEnd = event.key === 'End';
    // Ignore non-navigation keys
    if (event.defaultPrevented || (!isLeft && !isRight && !isHome && !isEnd)) {
      return;
    }

    const {tabs} = this;
    // Don't try to select another tab if there aren't any.
    if (tabs.length < 2) {
      return;
    }

    // Prevent default interactions, such as scrolling.
    event.preventDefault();

    let indexToFocus: number;
    if (isHome || isEnd) {
      indexToFocus = isHome ? 0 : tabs.length - 1;
    } else {
      // Check if moving forwards or backwards
      const isRtl = getComputedStyle(this).direction === 'rtl';
      const forwards = isRtl ? isLeft : isRight;
      const {focusedTab} = this;
      if (!focusedTab) {
        // If there is not already a tab focused, select the first or last tab
        // based on the direction we're traveling.
        indexToFocus = forwards ? 0 : tabs.length - 1;
      } else {
        const focusedIndex = this.tabs.indexOf(focusedTab);
        indexToFocus = forwards ? focusedIndex + 1 : focusedIndex - 1;
        if (indexToFocus >= tabs.length) {
          // Return to start if moving past the last item.
          indexToFocus = 0;
        } else if (indexToFocus < 0) {
          // Go to end if moving before the first item.
          indexToFocus = tabs.length - 1;
        }
      }
    }

    const tabToFocus = tabs[indexToFocus];
    tabToFocus.focus();
    if (this.autoActivate) {
      this.activateTab(tabToFocus);
    } else {
      this.updateFocusableTab(tabToFocus);
    }
  }

  // scroll to item on keyup.
  private handleKeyup() {
    this.scrollToTab(this.focusedTab ?? this.activeTab);
  }

  private handleFocusout() {
    // restore focus to selected item when blurring the tab bar.
    if (this.matches(':focus-within')) {
      return;
    }

    const {activeTab} = this;
    if (activeTab) {
      this.updateFocusableTab(activeTab);
    }
  }

  private handleSlotChange() {
    const firstTab = this.tabs[0];
    if (!this.activeTab && firstTab) {
      // If the active tab was removed, auto-select the first one. There should
      // always be a selected tab while the bar has children.
      this.activateTab(firstTab);
    }

    // When children shift, ensure the active tab is visible. For example, if
    // many children are added before the active tab, it'd be pushed off screen.
    // This ensures it stays visible.
    this.scrollToTab(this.activeTab);
  }
}

function isTab(element: unknown): element is Tab {
  return element instanceof HTMLElement && element.hasAttribute('md-tab');
}
