/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {NavigationTabHarness} from '../navigationtab/harness.js';
import {Harness} from '../testing/harness.js';

import {NavigationBar} from './lib/navigation-bar.js';

/**
 * Test harness for navigation bars.
 */
export class NavigationBarHarness extends Harness<NavigationBar> {
  readonly tab = this.getTab();

  /**
   * Returns the active tab to be used for interaction simulation.
   */
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return (await this.tab).getInteractiveElement();
  }

  protected async getTab() {
    await this.element.updateComplete;
    const tab = this.element.tabs[this.element.activeIndex];
    return new NavigationTabHarness(tab);
  }
}
