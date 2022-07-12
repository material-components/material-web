/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '@material/web/testing/harness';

import {Radio} from './lib/radio';

/**
 * Test harness for radio.
 */
export class RadioHarness extends Harness<Radio> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('input') as HTMLInputElement;
  }
}
