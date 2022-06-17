/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '@material/web/testing/harness';

import {Switch} from './lib/switch';

/**
 * Test harness for switch elements.
 */
export class SwitchHarness extends Harness<Switch> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector<HTMLElement>('.md3-switch')!;
  }
}
