/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../../testing/harness.js';

import {NavigationTab} from './internal/navigation-tab.js';

/**
 * Test harness for navigation tab elements.
 */
export class NavigationTabHarness extends Harness<NavigationTab> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector(
      '.md3-navigation-tab',
    ) as HTMLElement;
  }
}
