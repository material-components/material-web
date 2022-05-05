/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FieldHarness} from '../field/harness.js';
import {Field} from '../field/lib/field.js';
import {Harness} from '../testing/harness.js';

import {TextField} from './lib/text-field.js';

/**
 * Test harness for text field elements.
 */
export class TextFieldHarness extends Harness<TextField> {
  readonly field = this.getField();

  override async hoverEnter() {
    await super.hoverEnter();
    await (await this.field).hoverEnter();
  }

  override async hoverLeave() {
    await super.hoverLeave();
    await (await this.field).hoverLeave();
  }

  override async focusWithKeyboard() {
    await super.focusWithKeyboard();
    await (await this.field).focusWithKeyboard();
  }

  override async focusWithPointer() {
    await super.focusWithPointer();
    await (await this.field).focusWithPointer();
  }

  override async blur() {
    await super.blur();
    await (await this.field).blur();
  }

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.md3-text-field__input') as
        HTMLElement;
  }

  protected async getField() {
    await this.element.updateComplete;
    const field = this.element.renderRoot.querySelector(
                      'md-filled-field,md-outlined-field') as Field;
    return new FieldHarness(field);
  }
}
