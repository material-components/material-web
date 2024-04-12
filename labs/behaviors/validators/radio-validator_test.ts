/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {RadioValidator} from './radio-validator.js';

describe('RadioValidator', () => {
  it('is invalid when required and no radios are checked', () => {
    const states = [
      {
        required: true,
        checked: false,
      },
      {
        required: true,
        checked: false,
      },
      {
        required: true,
        checked: false,
      },
    ] as const;

    const validator = new RadioValidator(() => states);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeTrue();
    expect(validationMessage).withContext('validationMessage').not.toBe('');
  });

  it('is invalid when any radio is required and no radios are checked', () => {
    const states = [
      {
        required: false,
        checked: false,
      },
      {
        required: true,
        checked: false,
      },
      {
        required: false,
        checked: false,
      },
    ] as const;

    const validator = new RadioValidator(() => states);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeTrue();
    expect(validationMessage).withContext('validationMessage').not.toBe('');
  });

  it('is valid when required and any radio is checked', () => {
    const states = [
      {
        required: true,
        checked: false,
      },
      {
        required: true,
        checked: true,
      },
      {
        required: true,
        checked: false,
      },
    ] as const;

    const validator = new RadioValidator(() => states);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
    expect(validationMessage).withContext('validationMessage').toBe('');
  });

  it('is valid when required and multiple radios are checked', () => {
    const states = [
      {
        required: true,
        checked: false,
      },
      {
        required: true,
        checked: true,
      },
      {
        required: true,
        checked: true,
      },
    ] as const;

    const validator = new RadioValidator(() => states);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
    expect(validationMessage).withContext('validationMessage').toBe('');
  });

  it('is valid when not required', () => {
    const states = [
      {
        required: false,
        checked: false,
      },
      {
        required: false,
        checked: false,
      },
      {
        required: false,
        checked: false,
      },
    ] as const;

    const validator = new RadioValidator(() => states);
    const {validity, validationMessage} = validator.getValidity();
    expect(validity.valueMissing).withContext('valueMissing').toBeFalse();
    expect(validationMessage).withContext('validationMessage').toBe('');
  });
});
