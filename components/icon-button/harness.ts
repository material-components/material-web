/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {IconButton} from './lib/icon-button.js';
import {IconButtonToggle} from './lib/icon-button-toggle.js';

/**
 * Test harness for icon buttons.
 */
export class IconButtonHarness extends Harness<IconButton|IconButtonToggle> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.md3-icon-button') as
        HTMLElement;
  }
}
