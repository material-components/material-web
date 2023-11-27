/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {SelectValidator} from './select-validator.js';

describe('SelectValidator', () => {
  it('is invalid when required and value is empty', () => {
    const state = {
      required: true,
      value: '',
    };

    const validator = new SelectValidator(() => state);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeTrue();
    expect(validationMessage).withContext('validationMessage').not.toBe('');
  });

  it('is valid when required and value is provided', () => {
    const state = {
      required: true,
      value: 'Foo',
    };

    const validator = new SelectValidator(() => state);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
    expect(validationMessage).withContext('validationMessage').toBe('');
  });

  it('is valid when not required', () => {
    const state = {
      required: false,
      value: '',
    };

    const validator = new SelectValidator(() => state);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
    expect(validationMessage).withContext('validationMessage').toBe('');
  });
});
