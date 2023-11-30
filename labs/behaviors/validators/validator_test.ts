/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {Validator} from './validator.js';

describe('Validator', () => {
  interface CustomState {
    value: string;
    required: boolean;
  }

  class CustomValidator extends Validator<CustomState> {
    computeValidity({required, value}: CustomState) {
      const valueMissing = required && !value;
      return {
        validity: {valueMissing},
        validationMessage: valueMissing ? 'Value missing' : '',
      };
    }

    equals(prev: CustomState, next: CustomState) {
      return prev.value === next.value && prev.required === next.required;
    }

    copy({value, required}: CustomState) {
      return {value, required};
    }
  }

  describe('getValidity()', () => {
    // Quick E2E test of our CustomValidator to make sure the logic is hooked up
    it('should return the expected validity', () => {
      const currentState = {
        value: '',
        required: false,
      };

      const validator = new CustomValidator(() => currentState);

      expect(validator.getValidity()).toEqual({
        validity: jasmine.objectContaining({valueMissing: false}),
        validationMessage: '',
      });

      currentState.required = true;
      expect(validator.getValidity()).toEqual({
        validity: jasmine.objectContaining({valueMissing: true}),
        validationMessage: 'Value missing',
      });

      currentState.value = 'Foo';
      expect(validator.getValidity()).toEqual({
        validity: jasmine.objectContaining({valueMissing: false}),
        validationMessage: '',
      });
    });

    it('should compute validity when first called', () => {
      const currentState = {
        value: '',
        required: false,
      };

      const validator = new CustomValidator(() => currentState);
      spyOn(validator, 'computeValidity').and.callThrough();

      validator.getValidity();
      expect(validator.computeValidity)
        .withContext('computeValidity() called')
        .toHaveBeenCalledTimes(1);
    });

    it('should compute and return validity when state changes', () => {
      const currentState = {
        value: '',
        required: false,
      };

      const validator = new CustomValidator(() => currentState);
      // Get initial validity, which always computes
      validator.getValidity();

      spyOn(validator, 'computeValidity').and.callThrough();
      // Change the state, should re-compute
      currentState.value = 'Changed value';
      validator.getValidity();

      expect(validator.computeValidity)
        .withContext('computeValidity() called')
        .toHaveBeenCalledTimes(1);
    });

    it('should not compute and return cached validity when state does not change', () => {
      const currentState = {
        value: '',
        required: false,
      };

      const validator = new CustomValidator(() => currentState);
      // Get initial validity, which always computes
      validator.getValidity();

      spyOn(validator, 'computeValidity').and.callThrough();
      // Don't change state
      validator.getValidity();

      expect(validator.computeValidity)
        .withContext('computeValidity() called')
        .not.toHaveBeenCalled();
    });
  });
});
