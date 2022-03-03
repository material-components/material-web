/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness';

import {Field} from './lib/field';

/**
 * Test harness for field elements.
 */
export class FieldHarness extends Harness<Field> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.md3-field') as HTMLElement;
  }
}
