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

  /** Used to track whether or not a change event should be dispatched. */
  protected valueBeforeChange = '';

  /**
   * Simulates a user typing a value one character at a time. This will fire
   * multiple input events.
   *
   * Use focus/blur to ensure change events are fired.
   *
   * @example
   * await harness.focusWithKeyboard();
   * await harness.inputValue('value'); // input events
   * await harness.blur(); // change event
   *
   * @param value The value to simulating typing.
   */
  async inputValue(value: string) {
    for (const char of value) {
      this.simulateKeypress(await this.getInteractiveElement(), char);
      this.simulateInput(await this.getInteractiveElement(), char);
    }
  }

  /**
   * Simulates a user deleting part of a value with the backspace key.
   * By default, the entire value is deleted. This will fire a single input
   * event.
   *
   * Use focus/blur to ensure change events are fired.
   *
   * @example
   * await harness.focusWithKeyboard();
   * await harness.deleteValue(); // input event
   * await harness.blur(); // change event
   *
   * @param beginIndex The starting index of the value to delete.
   * @param endIndex The ending index of the value to delete.
   */
  async deleteValue(beginIndex?: number, endIndex?: number) {
    this.simulateKeypress(await this.getInteractiveElement(), 'Backspace');
    this.simulateDeletion(
        await this.getInteractiveElement(), beginIndex, endIndex);
  }

  override async reset() {
    this.element.value =
        '';  // TODO(b/443725652): replace with this.element.reset();
    this.valueBeforeChange = '';
    await super.reset();
  }

  override async hoverEnter() {
    await super.hoverEnter();
    await (await this.field).hoverEnter();
  }

  override async hoverLeave() {
    await super.hoverLeave();
    await (await this.field).hoverLeave();
  }

  override async focusWithKeyboard() {
    this.valueBeforeChange = this.element.value;
    await super.focusWithKeyboard();
    await (await this.field).focusWithKeyboard();
  }

  override async focusWithPointer() {
    this.valueBeforeChange = this.element.value;
    await super.focusWithPointer();
    await (await this.field).focusWithPointer();
  }

  override async blur() {
    await super.blur();
    await (await this.field).blur();
    this.simulateChangeIfNeeded(await this.getInteractiveElement());
  }

  protected simulateInput(
      element: HTMLInputElement, charactersToAppend: string,
      init?: InputEventInit) {
    element.value += charactersToAppend;
    if (!init) {
      init = {
        inputType: 'insertText',
        isComposing: false,
        data: charactersToAppend,
      };
    }

    element.dispatchEvent(new InputEvent('input', init));
  }

  protected simulateDeletion(
      element: HTMLInputElement, beginIndex?: number, endIndex?: number,
      init?: InputEventInit) {
    const deletedCharacters = element.value.slice(beginIndex, endIndex);
    element.value = element.value.substring(0, beginIndex ?? 0) +
        element.value.substring(endIndex ?? element.value.length);
    if (!init) {
      init = {
        inputType: 'deleteContentBackward',
        isComposing: false,
        data: deletedCharacters,
      };
    }

    element.dispatchEvent(new InputEvent('input', init));
  }

  protected simulateChangeIfNeeded(element: HTMLInputElement) {
    if (this.valueBeforeChange === element.value) {
      return;
    }

    this.valueBeforeChange = element.value;
    element.dispatchEvent(new Event('change'));
  }

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.md3-text-field__input') as
        HTMLInputElement;
  }

  protected async getField() {
    await this.element.updateComplete;
    const field = this.element.renderRoot.querySelector(
                      '.md3-text-field__field') as Field;
    return new FieldHarness(field);
  }
}
