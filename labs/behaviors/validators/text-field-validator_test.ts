/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {
  InputState,
  TextAreaState,
  TextFieldValidator,
} from './text-field-validator.js';

// Note: minlength and maxlength validation can NOT be tested programmatically.
// These properties will not trigger constraint validation until a user has
// interacted with the <input> or <textarea> and it marks itself as dirty.
// It's a spec quirk that these two properties behave differently, and
// unfortunately we cannot test them.

describe('TextFieldValidator', () => {
  // These types all have the same "text"-like validation
  describe('type="text", "password", "search", "tel", "url"', () => {
    it('is invalid when required and empty', () => {
      const state: InputState = {
        type: 'text',
        value: '',
        required: true,
        pattern: '',
        min: '',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.valueMissing).withContext('valueMissing').toBeTrue();
      expect(validationMessage).withContext('validationMessage').not.toBe('');
    });

    it('is valid when required and not empty', () => {
      const state: InputState = {
        type: 'text',
        value: 'Value',
        required: true,
        pattern: '',
        min: '',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
      expect(validationMessage).withContext('validationMessage').toBe('');
    });

    it('is valid when not required and empty', () => {
      const state: InputState = {
        type: 'text',
        value: '',
        required: false,
        pattern: '',
        min: '',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
      expect(validationMessage).withContext('validationMessage').toBe('');
    });

    it('does not throw an error when setting minlength and maxlength out of bounds', () => {
      type WritableInputState = {
        -readonly [K in keyof InputState]: InputState[K];
      };

      const state: WritableInputState = {
        type: 'text',
        value: '',
        required: true,
        pattern: '',
        min: '',
        max: '',
        minLength: 5,
        maxLength: 10,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      // Compute initial validity with valid minlength of 5 and maxlength of 10
      validator.getValidity();
      // set to something that is out of bounds of current maxlength="10"
      state.minLength = 20;

      expect(() => {
        validator.getValidity();
      }).not.toThrow();
    });
  });

  describe('type="email"', () => {
    it('is invalid when not matching default email pattern', () => {
      const state: InputState = {
        type: 'email',
        value: 'invalid',
        required: false,
        pattern: '',
        min: '',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.typeMismatch).withContext('typeMismatch').toBeTrue();
      expect(validationMessage).withContext('validationMessage').not.toBe('');
    });

    it('is valid when matching default email pattern', () => {
      const state: InputState = {
        type: 'email',
        value: 'valid@google.com',
        required: false,
        pattern: '',
        min: '',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.typeMismatch).withContext('typeMismatch').toBeFalse();
      expect(validationMessage).withContext('validationMessage').toBe('');
    });
  });

  describe('type="number"', () => {
    it('is invalid when value is less than min', () => {
      const state: InputState = {
        type: 'number',
        value: '1',
        required: false,
        pattern: '',
        min: '5',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.rangeUnderflow).withContext('rangeUnderflow').toBeTrue();
      expect(validationMessage).withContext('validationMessage').not.toBe('');
    });

    it('is invalid when value is greater than max', () => {
      const state: InputState = {
        type: 'number',
        value: '10',
        required: false,
        pattern: '',
        min: '',
        max: '5',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.rangeOverflow).withContext('rangeOverflow').toBeTrue();
      expect(validationMessage).withContext('validationMessage').not.toBe('');
    });

    it('is valid when value is between min and max', () => {
      const state: InputState = {
        type: 'number',
        value: '3',
        required: false,
        pattern: '',
        min: '1',
        max: '5',
        minLength: -1,
        maxLength: -1,
        step: '',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.rangeUnderflow).withContext('rangeUnderflow').toBeFalse();
      expect(validity.rangeOverflow).withContext('rangeOverflow').toBeFalse();
      expect(validationMessage).withContext('validationMessage').toBe('');
    });

    it('is invalid when value does not match step', () => {
      const state: InputState = {
        type: 'number',
        value: '2',
        required: false,
        pattern: '',
        min: '',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '5',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.stepMismatch).withContext('stepMismatch').toBeTrue();
      expect(validationMessage).withContext('validationMessage').not.toBe('');
    });

    it('is valid when value matches step', () => {
      const state: InputState = {
        type: 'number',
        value: '20',
        required: false,
        pattern: '',
        min: '',
        max: '',
        minLength: -1,
        maxLength: -1,
        step: '5',
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.stepMismatch).withContext('stepMismatch').toBeFalse();
      expect(validationMessage).withContext('validationMessage').toBe('');
    });
  });

  describe('type="textarea"', () => {
    it('is invalid when required and empty', () => {
      const state: TextAreaState = {
        type: 'textarea',
        value: '',
        required: true,
        minLength: -1,
        maxLength: -1,
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.valueMissing).withContext('valueMissing').toBeTrue();
      expect(validationMessage).withContext('validationMessage').not.toBe('');
    });

    it('is valid when required and not empty', () => {
      const state: TextAreaState = {
        type: 'textarea',
        value: 'Value',
        required: true,
        minLength: -1,
        maxLength: -1,
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
      expect(validationMessage).withContext('validationMessage').toBe('');
    });

    it('is valid when not required and empty', () => {
      const state: TextAreaState = {
        type: 'textarea',
        value: '',
        required: false,
        minLength: -1,
        maxLength: -1,
      };

      const validator = new TextFieldValidator(() => ({
        state,
        renderedControl: null,
      }));

      const {validity, validationMessage} = validator.getValidity();
      expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
      expect(validationMessage).withContext('validationMessage').toBe('');
    });
  });
});
