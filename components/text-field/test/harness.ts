/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Field} from '../../field/lib/field';
import {FieldHarness} from '../../field/test/harness';
import {Harness} from '../../testing/harness';
import {TextField} from '../lib/text-field';

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
