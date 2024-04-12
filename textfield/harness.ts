/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {TextField} from './internal/text-field.js';

/**
 * Test harness for text field elements.
 */
export class TextFieldHarness extends Harness<TextField> {
  /** Used to track whether or not a change event should be dispatched. */
  private valueBeforeChange = '';

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
      await this.getInteractiveElement(),
      beginIndex,
      endIndex,
    );
  }

  override async reset() {
    this.element.reset();
    this.valueBeforeChange = this.element.value;
    await super.reset();
  }

  override async blur() {
    await super.blur();
    this.simulateChangeIfNeeded(await this.getInteractiveElement());
  }

  protected override simulatePointerFocus(input: HTMLElement) {
    const textField = this.element;
    if (textField.disabled) {
      return;
    }

    this.valueBeforeChange = textField.value;
    super.simulatePointerFocus(input);
  }

  protected simulateInput(
    element: HTMLInputElement | HTMLTextAreaElement,
    charactersToAppend: string,
    init?: InputEventInit,
  ) {
    element.value += charactersToAppend;
    if (!init) {
      init = {
        inputType: 'insertText',
        composed: true,
        bubbles: true,
        isComposing: false,
        data: charactersToAppend,
      };
    }

    element.dispatchEvent(new InputEvent('input', init));
  }

  protected simulateDeletion(
    element: HTMLInputElement | HTMLTextAreaElement,
    beginIndex?: number,
    endIndex?: number,
    init?: InputEventInit,
  ) {
    const deletedCharacters = element.value.slice(beginIndex, endIndex);
    element.value =
      element.value.substring(0, beginIndex ?? 0) +
      element.value.substring(endIndex ?? element.value.length);
    if (!init) {
      init = {
        inputType: 'deleteContentBackward',
        composed: true,
        bubbles: true,
        isComposing: false,
        data: deletedCharacters,
      };
    }

    element.dispatchEvent(new InputEvent('input', init));
  }

  protected simulateChangeIfNeeded(
    element: HTMLInputElement | HTMLTextAreaElement,
  ) {
    if (this.valueBeforeChange === element.value) {
      return;
    }

    this.valueBeforeChange = element.value;
    element.dispatchEvent(new Event('change'));
  }

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.renderRoot.querySelector('.input') as
      | HTMLInputElement
      | HTMLTextAreaElement;
  }
}
