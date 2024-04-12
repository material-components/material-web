/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ElementWithHarness, Harness} from '../testing/harness.js';

import {Tab} from './internal/tab.js';
import {Tabs} from './internal/tabs.js';

/**
 * Test harness for Tab.
 */
export class TabHarness extends Harness<Tab> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element as HTMLElement;
  }

  private async completeIndicatorAnimation() {
    await this.element.updateComplete;
    const indicator = this.element.renderRoot.querySelector('.indicator')!;
    const animations = indicator.getAnimations();
    for (const animation of animations) {
      animation.finish();
    }
  }

  async isIndicatorShowing() {
    await this.completeIndicatorAnimation();
    const indicator = this.element.renderRoot.querySelector('.indicator')!;
    const opacity = getComputedStyle(indicator)['opacity'];
    return opacity === '1';
  }
}

/**
 * Test harness for Tabs.
 */
export class TabsHarness extends Harness<Tabs> {
  // Note, Tabs interactive element is the interactive element of the
  // selected tab.
  override async getInteractiveElement() {
    await this.element.updateComplete;
    if (!this.element.activeTab) {
      return this.element as HTMLElement;
    }

    const selectedItemHarness =
      ((this.element.activeTab as ElementWithHarness<Tab>)
        .harness as TabHarness) ?? new TabHarness(this.element.activeTab);
    return await selectedItemHarness.getInteractiveElement();
  }

  get harnessedItems() {
    return (this.element.tabs as Array<ElementWithHarness<Tab>>).map((item) => {
      return (item.harness ?? new TabHarness(item)) as TabHarness;
    });
  }
}
