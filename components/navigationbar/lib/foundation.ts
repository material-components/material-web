/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCObserverFoundation} from '@material/base/observer-foundation';
import {KEY, normalizeKey} from '@material/dom/keyboard';

import {NavigationTabInteractionEvent} from './constants';
import {MDCNavigationBarAdapter} from './state';

/**
 * `MDCNavigationBarFoundation` provides a state-only foundation for a
 * navigation bar component.
 *
 * State observers and event handler entrypoints update a component's adapter's
 * state with the logic needed for navigation bar to function.
 */
export class MDCNavigationBarFoundation extends
    MDCObserverFoundation<MDCNavigationBarAdapter> {
  constructor(adapter: MDCNavigationBarAdapter) {
    super(adapter);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  /**
   * Initializes the foundation and starts observing state changes.
   */
  override init() {
    this.observe(this.adapter.state, {
      activeIndex: this.onActiveIndexChange,
      hideInactiveLabels: this.onHideInactiveLabelsChange,
      tabs: this.onTabsChange,
    });
  }

  /**
   * Event handler for navigation tab interaction event. The navigation tab
   * that emits the event will be set as the activeIndex.
   */
  handleNavigationTabInteraction({detail}: NavigationTabInteractionEvent) {
    const {state} = detail;
    this.adapter.state.activeIndex = this.adapter.state.tabs.indexOf(state);
  }

  /**
   * Event handler for navigation bar keydown events.
   */
  handleKeydown(event: KeyboardEvent) {
    const key = normalizeKey(event);
    const focusedTabIndex = this.adapter.getFocusedTabIndex();
    const isRTL = this.adapter.isRTL();
    const maxIndex = this.adapter.state.tabs.length - 1;

    if (key === KEY.ENTER || key === KEY.SPACEBAR) {
      this.adapter.state.activeIndex = focusedTabIndex;
      return;
    }

    if (key === KEY.HOME) {
      this.adapter.focusTab(0);
      return;
    }

    if (key === KEY.END) {
      this.adapter.focusTab(maxIndex);
      return;
    }

    const toNextTab = (key === KEY.ARROW_RIGHT && !isRTL) ||
        (key === KEY.ARROW_LEFT && isRTL);
    if (toNextTab && focusedTabIndex === maxIndex) {
      this.adapter.focusTab(0);
      return;
    }
    if (toNextTab) {
      this.adapter.focusTab(focusedTabIndex + 1);
      return;
    }

    const toPreviousTab = (key === KEY.ARROW_LEFT && !isRTL) ||
        (key === KEY.ARROW_RIGHT && isRTL);
    if (toPreviousTab && focusedTabIndex === 0) {
      this.adapter.focusTab(maxIndex);
      return;
    }
    if (toPreviousTab) {
      this.adapter.focusTab(focusedTabIndex - 1);
      return;
    }
  }

  protected onActiveIndexChange() {
    if (!this.adapter.state.tabs[this.adapter.state.activeIndex]) {
      throw new Error('MDCNavigationBar: activeIndex is out of bounds.');
    }

    for (let i = 0; i < this.adapter.state.tabs.length; i++) {
      this.adapter.state.tabs[i].active = i === this.adapter.state.activeIndex;
    }
  }

  protected onHideInactiveLabelsChange() {
    for (const tab of this.adapter.state.tabs) {
      tab.hideInactiveLabel = this.adapter.state.hideInactiveLabels;
    }
  }

  protected onTabsChange() {
    this.onHideInactiveLabelsChange();
    const activeIndex = this.adapter.state.tabs.findIndex((tab) => tab.active);
    if (activeIndex < 0) {
      this.onActiveIndexChange();
    } else {
      this.adapter.state.activeIndex = activeIndex;
    }
  }
}
