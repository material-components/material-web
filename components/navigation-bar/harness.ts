/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness';

import {NavigationBar} from './lib/navigation-bar';

/**
 * Test harness for navigation bars.
 */
export class NavigationBarHarness extends Harness<NavigationBar> {
  /**
   * The index of the tab that should be used for interaction simulation.
   * Defaults to first tab.
   */
  private interactiveTab = 0;

  /**
   * Sets the tab that should be used for interaction simulation.
   */
  setInteractiveTab(tab: number) {
    this.interactiveTab = tab;
  }

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.tabs[this.interactiveTab].renderRoot.querySelector(
               '.md3-navigation-tab') as HTMLElement;
  }
}
