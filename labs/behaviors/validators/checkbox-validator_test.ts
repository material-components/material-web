/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {CheckboxValidator} from './checkbox-validator.js';

describe('CheckboxValidator', () => {
  it('is invalid when required and not checked', () => {
    const state = {
      required: true,
      checked: false,
    };

    const validator = new CheckboxValidator(() => state);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeTrue();
    expect(validationMessage).withContext('validationMessage').not.toBe('');
  });

  it('is valid when required and checked', () => {
    const state = {
      required: true,
      checked: true,
    };

    const validator = new CheckboxValidator(() => state);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
    expect(validationMessage).withContext('validationMessage').toBe('');
  });

  it('is valid when not required', () => {
    const state = {
      required: false,
      checked: false,
    };

    const validator = new CheckboxValidator(() => state);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
    expect(validationMessage).withContext('validationMessage').toBe('');
  });
});
