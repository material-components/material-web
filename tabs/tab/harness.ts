/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '@material/web/testing/harness';
import {Tab} from './lib/tab';

/**
 * Test harness for tab elements.
 */
export class TabHarness extends Harness<Tab> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector<HTMLElement>('.md3-tab')!;
  }
}