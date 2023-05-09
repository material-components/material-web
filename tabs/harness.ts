/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ElementWithHarness, Harness} from '../testing/harness.js';

import {Tab} from './lib/tab.js';
import {Tabs} from './lib/tabs.js';

/**
 * Test harness for Tab.
 */
export class TabHarness extends Harness<Tab> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.querySelector<HTMLButtonElement|HTMLLinkElement>(
        '.button')!;
  }

  async isIndicatorShowing() {
    await this.element.updateComplete;
    const opacity = getComputedStyle(this.element.indicator)['opacity'];
    return opacity === '1';
  }
}

/**
 * Test harness for Tabs.
 */
export class TabsHarness extends Harness<Tabs> {
  get harnessedItems() {
    // Test access to protected property
    // tslint:disable-next-line:no-dict-access-on-struct-type
    return (this.element['items'] as Array<ElementWithHarness<Tab>>)
        .map(item => {
          return (item.harness ?? new TabHarness(item)) as TabHarness;
        });
  }
}
