/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {IconButton} from './internal/icon-button.js';

/**
 * Test harness for icon buttons.
 */
export class IconButtonHarness extends Harness<IconButton> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    if (this.element.href) {
      return this.element.renderRoot.querySelector('a')!;
    }

    return this.element.renderRoot.querySelector('button')!;
  }
}
