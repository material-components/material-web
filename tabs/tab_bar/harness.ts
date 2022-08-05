/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '@material/web/testing/harness';
import {TabHarness} from 'google3/third_party/javascript/material/web/tabs/tab/harness';

import {Tab} from '../tab/lib/tab';

import {TabBar} from './lib/tab-bar';

/**
 * Test hanress for tab bars.
 */
export class TabBarHarness extends Harness<TabBar> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector<HTMLElement>('.md3-tab-bar')!;
  }

  /**
   * Returns list of TabHarnesses that correspond with the tabs contained by
   * this tab bar component.
   */
  getItems() {
    const tabSlot = this.element.renderRoot.querySelector('slot');
    const tabs = tabSlot ? tabSlot.assignedElements({flatten: true}) : [];
    return tabs.map((tab: Node) => new TabHarness(tab as Tab));
  }
}