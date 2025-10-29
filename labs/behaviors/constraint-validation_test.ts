/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from './constraint-validation.js';
import {mixinElementInternals} from './element-internals.js';
import {getFormValue, mixinFormAssociated} from './form-associated.js';
import {CheckboxValidator} from './validators/checkbox-validator.js';
import {Validator} from './validators/validator.js';
import {SelectState} from './validators/select-validator.js';

describe('mixinConstraintValidation()', () => {
  const baseClass = mixinConstraintValidation(
    mixinFormAssociated(mixinElementInternals(LitElement)),
  );

  @customElement('test-constraint-validation')
  class TestConstraintValidation extends baseClass {
    @property({type: Boolean}) checked = false;
    @property({type: Boolean}) required = false;

    override render() {
      return html`<div id="root"></div>`;
    }

    override [createValidator]() {
      return new CheckboxValidator(() => this);
    }

    override [getValidityAnchor]() {
      return this.shadowRoot?.querySelector<HTMLElement>('#root') ?? null;
    }

    override [getFormValue]() {
      return String(this.checked);
    }
  }

  /**
   * A validator that set customError flag to true
   */
  class CustomErrorValidator extends Validator<SelectState> {
    private control?: HTMLInputElement;

    protected override computeValidity(state: SelectState) {
      if (!this.control) {
        this.control = document.createElement('input');
      }
      this.control.setCustomValidity('validator custom error');
      return {
        validity: this.control.validity,
        validationMessage: this.control.validationMessage,
      };
    }

    protected override equals(prev: SelectState, next: SelectState) {
      return prev.value === next.value
    }

    protected override copy({ value, required }: SelectState) {
      return { value, required };
    }
  }

  @customElement('test-custom-error-constraint-validation')
  class TestCustomErrorConstraintValidation extends baseClass {
    @property() value = '';
    @property({ type: Boolean }) required = false;
    override render() {
      return html`<div id="root"></div>`;
    }
    [createValidator]() {
      return new CustomErrorValidator(() => this);
    }

    [getValidityAnchor]() {
      return this.shadowRoot?.querySelector<HTMLElement>('#root') ?? null;
    }

    [getFormValue]() {
      return String(this.value);
    }
  }

  describe('validity', () => {
    it('should return a ValidityState value', () => {
      const control = new TestConstraintValidation();
      expect(control.validity).toBeInstanceOf(ValidityState);
    });

    it('should update synchronously when validation properties change', () => {
      const control = new TestConstraintValidation();

      expect(control.validity.valid)
        .withContext('validity.valid before changing required')
        .toBeTrue();
      control.required = true;
      expect(control.validity.valid)
        .withContext('validity.valid after changing required')
        .toBeFalse();
    });
  });

  describe('validationMessage', () => {
    it('should be an empty string when valid', () => {
      const control = new TestConstraintValidation();
      expect(control.validationMessage).toBe('');
    });

    it('should have an error message when invalid', () => {
      const control = new TestConstraintValidation();
      control.required = true;
      expect(control.validationMessage).not.toBe('');
    });
  });

  describe('willValidate', () => {
    it('should validate by default', () => {
      const control = new TestConstraintValidation();
      expect(control.willValidate).withContext('willValidate').toBeTrue();
    });

    it('should not validate when a disabled attribute is present', () => {
      const control = new TestConstraintValidation();
      control.toggleAttribute('disabled', true);
      expect(control.willValidate).withContext('willValidate').toBeFalse();
    });

    it('should not validate when a readonly attribute is present', () => {
      const control = new TestConstraintValidation();
      control.toggleAttribute('readonly', true);
      expect(control.willValidate).withContext('willValidate').toBeFalse();
    });
  });

  describe('checkValidity()', () => {
    it('should return true when element is valid', () => {
      const control = new TestConstraintValidation();
      expect(control.checkValidity())
        .withContext('checkValidity() return')
        .toBeTrue();
    });

    it('should return false when element is invalid', () => {
      const control = new TestConstraintValidation();
      control.required = true;
      expect(control.checkValidity())
        .withContext('checkValidity() return')
        .toBeFalse();
    });

    it('should dispatch invalid event when invalid', () => {
      const control = new TestConstraintValidation();
      control.required = true;
      const invalidListener = jasmine.createSpy('invalidListener');
      control.addEventListener('invalid', invalidListener);
      control.checkValidity();
      expect(invalidListener).toHaveBeenCalledWith(jasmine.any(Event));
    });
  });

  describe('reportValidity()', () => {
    it('should return true when element is valid', () => {
      const control = new TestConstraintValidation();
      expect(control.reportValidity())
        .withContext('reportValidity() return')
        .toBeTrue();
    });

    it('should return false when element is invalid', () => {
      const control = new TestConstraintValidation();
      control.required = true;
      expect(control.reportValidity())
        .withContext('reportValidity() return')
        .toBeFalse();
    });

    it('should dispatch invalid event when invalid', () => {
      const control = new TestConstraintValidation();
      control.required = true;
      const invalidListener = jasmine.createSpy('invalidListener');
      control.addEventListener('invalid', invalidListener);
      control.reportValidity();
      expect(invalidListener).toHaveBeenCalledWith(jasmine.any(Event));
    });
  });

  describe('setCustomValidity()', () => {
    it('should set customError to true when given a non-empty string', () => {
      const control = new TestConstraintValidation();
      control.setCustomValidity('Error');
      expect(control.validity.customError)
        .withContext('validity.customError')
        .toBeTrue();
    });

    it('should set customError to false when set to an empty string', () => {
      const control = new TestConstraintValidation();
      control.setCustomValidity('');
      expect(control.validity.customError)
        .withContext('validity.customError')
        .toBeFalse();
    });

    it('should report custom validation message over other validation messages', () => {
      const control = new TestConstraintValidation();
      control.required = true;
      control.setCustomValidity('Error');
      expect(control.validationMessage)
        .withContext('validationMessage')
        .toBe('Error');
    });
  });

  describe('customError', () => {
    it('should set customError to true when validator has customError', () => {
      const control = new TestCustomErrorConstraintValidation();
      expect(control.validity.customError)
        .withContext('validity.customError')
        .toBeTrue();
    });
    it('should dispatch invalid event when validator has customError', () => {
      const control = new TestCustomErrorConstraintValidation();
      const invalidListener = jasmine.createSpy('invalidListener');
      control.addEventListener('invalid', invalidListener);
      control.reportValidity();
      expect(invalidListener).toHaveBeenCalledWith(jasmine.any(Event));
    });
    it('should report custom validation message over other validation messages', () => {
      const control = new TestCustomErrorConstraintValidation();
      expect(control.validationMessage)
        .withContext('validationMessage')
        .toBe('validator custom error');
    });
  })
});
