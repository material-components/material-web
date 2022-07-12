/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '@material/web/testing/harness';

import {NavigationTab} from './lib/navigation-tab';

/**
 * Test harness for navigation tab elements.
 */
export class NavigationTabHarness extends Harness<NavigationTab> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.md3-navigation-tab') as
        HTMLElement;
  }
}
