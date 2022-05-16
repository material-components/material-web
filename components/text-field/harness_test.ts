/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';
import './filled-text-field.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {Harness} from '../testing/harness.js';

import {TextFieldHarness} from './harness.js';

describe('TextFieldHarness', () => {
  const env = new Environment();

  function setupTest() {
    const root =
        env.render(html`<md-filled-text-field></md-filled-text-field>`);
    const instance = root.querySelector('md-filled-text-field');
    if (!instance) {
      throw new Error('Failed to query md-filled-text-field.');
    }

    return new TextFieldHarness(instance);
  }

  describe('inputValue()', () => {
    it('should emit key events for each character typed', async () => {
      // Setup.
      const harness = setupTest();
      const keydownHandler = jasmine.createSpy('keydownHandler');
      harness.element.addEventListener('keydown', keydownHandler);
      // Test case.
      await harness.inputValue('abc');
      // Assertion.
      expect(keydownHandler).toHaveBeenCalledTimes(3);
      expect(keydownHandler).toHaveBeenCalledWith(jasmine.any(KeyboardEvent));
      expect(keydownHandler.calls.allArgs()).toEqual([
        [jasmine.objectContaining({key: 'a'})],
        [jasmine.objectContaining({key: 'b'})],
        [jasmine.objectContaining({key: 'c'})],
      ]);
    });

    it('should emit input events for each character typed', async () => {
      // Setup.
      const harness = setupTest();
      const inputHandler = jasmine.createSpy('inputHandler');
      harness.element.addEventListener('input', inputHandler);
      // Test case.
      await harness.inputValue('abc');
      // Assertion.
      expect(inputHandler).toHaveBeenCalledTimes(3);
      expect(inputHandler).toHaveBeenCalledWith(jasmine.any(InputEvent));
    });
  });

  describe('deleteValue()', () => {
    it('should press the Backspace key', async () => {
      // Setup.
      const harness = setupTest();
      const keydownHandler = jasmine.createSpy('keydownHandler');
      harness.element.addEventListener('keydown', keydownHandler);
      harness.element.value = 'Value';
      // Test case.
      await harness.deleteValue();
      // Assertion.
      expect(keydownHandler).toHaveBeenCalledTimes(1);
      expect(keydownHandler).toHaveBeenCalledWith(jasmine.any(KeyboardEvent));
      expect(keydownHandler).toHaveBeenCalledWith(jasmine.objectContaining({
        key: 'Backspace'
      }));
    });

    it('should delete the entire value by default', async () => {
      // Setup.
      const harness = setupTest();
      harness.element.value = 'Value';
      // Test case.
      await harness.deleteValue();
      // Assertion.
      expect(harness.element.value).toBe('');
    });

    it('should allow deleting part of the value', async () => {
      // Setup.
      const harness = setupTest();
      harness.element.value = 'Value';
      // Test case.
      await harness.deleteValue(1, 4);
      // Assertion.
      expect(harness.element.value).toBe('Ve');
    });
  });

  describe('reset()', () => {
    it('should set the value to an empty string', async () => {
      // Setup.
      const harness = setupTest();
      harness.element.value = 'Value';
      // Test case.
      await harness.reset();
      // Assertion.
      expect(harness.element.value).toBe('');
    });

    it('should call super.reset()', async () => {
      // Setup.
      const harness = setupTest();
      spyOn(Harness.prototype, 'reset');
      // Test case.
      await harness.reset();
      // Assertion.
      expect(Harness.prototype.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('field harness', () => {
    it('should call hoverEnter() on the field harness', async () => {
      // Setup.
      const harness = setupTest();
      const field = await harness.field;
      spyOn(field, 'hoverEnter').and.callThrough();
      // Test case.
      await harness.hoverEnter();
      // Assertion.
      expect(field.hoverEnter).toHaveBeenCalledTimes(1);
    });

    it('should call hoverLeave() on the field harness', async () => {
      // Setup.
      const harness = setupTest();
      const field = await harness.field;
      spyOn(field, 'hoverLeave').and.callThrough();
      // Test case.
      await harness.hoverLeave();
      // Assertion.
      expect(field.hoverLeave).toHaveBeenCalledTimes(1);
    });

    it('should call focusWithKeyboard() on the field harness', async () => {
      // Setup.
      const harness = setupTest();
      const field = await harness.field;
      spyOn(field, 'focusWithKeyboard').and.callThrough();
      // Test case.
      await harness.focusWithKeyboard();
      // Assertion.
      expect(field.focusWithKeyboard).toHaveBeenCalledTimes(1);
    });

    it('should call focusWithPointer() on the field harness', async () => {
      // Setup.
      const harness = setupTest();
      const field = await harness.field;
      spyOn(field, 'focusWithPointer').and.callThrough();
      // Test case.
      await harness.focusWithPointer();
      // Assertion.
      expect(field.focusWithPointer).toHaveBeenCalledTimes(1);
    });

    it('should call blur() on the field harness', async () => {
      // Setup.
      const harness = setupTest();
      const field = await harness.field;
      spyOn(field, 'blur').and.callThrough();
      // Test case.
      await harness.blur();
      // Assertion.
      expect(field.blur).toHaveBeenCalledTimes(1);
    });
  });

  describe('simulating change events', () => {
    it('should dispatch change if value changes after focus and blur',
       async () => {
         // Setup.
         const harness = setupTest();
         const changeHandler = jasmine.createSpy('changeHandler');
         harness.element.addEventListener('change', changeHandler);
         // Test case.
         await harness.focusWithKeyboard();
         await harness.inputValue('value');
         await harness.blur();
         // Assertion.
         expect(changeHandler).toHaveBeenCalledTimes(1);
       });

    it('should not dispatch change if value does not change', async () => {
      // Setup.
      const harness = setupTest();
      const changeHandler = jasmine.createSpy('changeHandler');
      harness.element.value = 'value';
      harness.element.addEventListener('change', changeHandler);
      // Test case.
      await harness.focusWithKeyboard();
      await harness.blur();
      // Assertion.
      expect(changeHandler).not.toHaveBeenCalled();
    });

    it('should not dispatch change if reset', async () => {
      // Setup.
      const harness = setupTest();
      const changeHandler = jasmine.createSpy('changeHandler');
      await harness.focusWithKeyboard();
      await harness.inputValue('value');
      harness.element.addEventListener('change', changeHandler);
      // Test case.
      await harness.reset();
      await harness.blur();
      // Assertion.
      expect(changeHandler).not.toHaveBeenCalled();
    });
  });
});
