/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Field} from './internal/field.js';

/**
 * Test harness for field elements.
 */
export class FieldHarness extends Harness<Field> {
  override async focusWithKeyboard(init: KeyboardEventInit = {}) {
    this.element.focused = true;
    await super.focusWithKeyboard(init);
  }

  override async focusWithPointer() {
    this.element.focused = true;
    await super.focusWithPointer();
  }

  override async blur() {
    this.element.focused = false;
    await super.blur();
  }

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return (this.element.querySelector(':not([slot])') ||
      this.element.renderRoot.querySelector('.field')) as HTMLElement;
  }
}
