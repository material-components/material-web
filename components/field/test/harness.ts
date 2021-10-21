/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../../testing/harness';
import {Field} from '../lib/field';

/**
 * Test harness for field elements.
 */
export class FieldHarness extends Harness<Field> {
  override async focusWithKeyboard() {
    this.element.focused = true;
  }

  override async focusWithPointer() {
    await this.hoverEnter();
    this.element.focused = true;
  }

  override async blur() {
    await this.hoverLeave();
    this.element.focused = false;
  }

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.mdc-field') as HTMLElement;
  }
}
