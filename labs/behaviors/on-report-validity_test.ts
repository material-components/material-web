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
import {mixinFocusable} from './focusable.js';
import {getFormValue, mixinFormAssociated} from './form-associated.js';
import {mixinOnReportValidity, onReportValidity} from './on-report-validity.js';
import {CheckboxValidator} from './validators/checkbox-validator.js';

describe('mixinOnReportValidity()', () => {
  const baseClass = mixinFocusable(
    mixinOnReportValidity(
      mixinConstraintValidation(
        mixinFormAssociated(mixinElementInternals(LitElement)),
      ),
    ),
  );

  @customElement('test-on-report-validity')
  class TestOnReportValidity extends baseClass {
    @property({type: Boolean}) checked = false;
    @property({type: Boolean}) required = false;

    override render() {
      return html`<div id="root"></div>`;
    }

    [createValidator]() {
      return new CheckboxValidator(() => this);
    }

    [getValidityAnchor]() {
      return this.shadowRoot?.querySelector<HTMLElement>('#root') ?? null;
    }

    [getFormValue]() {
      return String(this.checked);
    }
  }

  describe('[onReportValidity]', () => {
    describe('for valid controls', () => {
      it('should be called with null when reportValidity() is called and it is valid', () => {
        const control = new TestOnReportValidity();
        control[onReportValidity] = jasmine.createSpy('onReportValidity');

        control.reportValidity();
        expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
      });
    });

    describe('for invalid controls', () => {
      it('should be called with event when reportValidity() is called and it is invalid', () => {
        const control = new TestOnReportValidity();
        control[onReportValidity] = jasmine.createSpy('onReportValidity');

        control.required = true;
        control.reportValidity();
        expect(control[onReportValidity]).toHaveBeenCalledOnceWith(
          jasmine.any(Event),
        );
      });

      it('should NOT be called when reportValidity() is called and invalid but default prevented', () => {
        const control = new TestOnReportValidity();
        control[onReportValidity] = jasmine.createSpy('onReportValidity');

        control.required = true;
        control.addEventListener('invalid', (event) => {
          event.preventDefault();
        });

        control.reportValidity();
        expect(control[onReportValidity]).not.toHaveBeenCalled();
      });
    });

    describe('for invalid to valid controls', () => {
      it('should be called with null when reportValidity() is called after fixing invalid', () => {
        const control = new TestOnReportValidity();
        const onReportValiditySpy = jasmine.createSpy('onReportValidity');
        control[onReportValidity] = onReportValiditySpy;
        control.required = true;
        control.reportValidity();
        onReportValiditySpy.calls.reset();

        // Fix invalid
        control.checked = true;
        control.reportValidity();

        expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
      });
    });

    describe('with forms', () => {
      describe('for valid controls', () => {
        it('should be called with null when form.reportValidity() is called and it is valid', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);

          form.reportValidity();
          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
        });

        it('should be called with null when form.requestSubmit() is called and it is valid', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading
              event.preventDefault();
            },
            {capture: true},
          );

          document.body.appendChild(form);
          form.requestSubmit();
          form.remove();
          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
        });

        it('should be called with null when form submits declaratively and it is valid', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading
              event.preventDefault();
            },
            {capture: true},
          );

          const submitButton = document.createElement('button');
          form.appendChild(submitButton);
          document.body.appendChild(form);
          submitButton.click();
          form.remove();
          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
        });

        it('should be called with null when form submits declaratively and it is valid, but another sibling is invalid', () => {
          // This is a known limitation. If a form is using an MWC control and
          // declaratively submits it with a native `<button>` or `<input>`, then
          // error styles will not clear if the form fails to submit.
          // The workaround is to call `form.reportValidity()` when clicking the
          // native `<button type="submit">` or pressing enter in an `<input>`.
          //
          // Leaving this test here for documentation and a possible future fix.
          expect().nothing();
        });
      });

      describe('for valid to invalid controls', () => {
        it('should be called with event when form.reportValidity() is called and it is invalid', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);

          control.required = true;
          form.reportValidity();
          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(
            jasmine.any(Event),
          );
        });

        it('should NOT be called when form.reportValidity() is called and invalid but default prevented', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);

          control.required = true;
          control.addEventListener('invalid', (event) => {
            event.preventDefault();
          });

          form.reportValidity();
          expect(control[onReportValidity]).not.toHaveBeenCalled();
        });

        it('should be called with event when form.requestSubmit() is called and it is invalid', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading. This shouldn't
              // happen, but we add it just in case the control fails and reports
              // as valid and the form tries to submit.
              event.preventDefault();
            },
            {capture: true},
          );

          document.body.appendChild(form);
          control.required = true;
          form.requestSubmit();
          form.remove();
          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(
            jasmine.any(Event),
          );
        });

        it('should NOT be called when form.requestSubmit() is called and invalid but default prevented', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading. This shouldn't
              // happen, but we add it just in case the control fails and reports
              // as valid and the form tries to submit.
              event.preventDefault();
            },
            {capture: true},
          );

          control.required = true;
          control.addEventListener('invalid', (event) => {
            event.preventDefault();
          });

          document.body.appendChild(form);
          form.requestSubmit();
          form.remove();
          expect(control[onReportValidity]).not.toHaveBeenCalled();
        });

        it('should be called with event when form submits declaratively and it is invalid', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading. This shouldn't
              // happen, but we add it just in case the control fails and reports
              // as valid and the form tries to submit.
              event.preventDefault();
            },
            {capture: true},
          );

          control.required = true;
          const submitButton = document.createElement('button');
          form.appendChild(submitButton);
          document.body.appendChild(form);
          submitButton.click();
          form.remove();
          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(
            jasmine.any(Event),
          );
        });

        it('should NOT be called when form submits declaratively and invalid but default prevented', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading. This shouldn't
              // happen, but we add it just in case the control fails and reports
              // as valid and the form tries to submit.
              event.preventDefault();
            },
            {capture: true},
          );

          control.required = true;
          control.addEventListener('invalid', (event) => {
            event.preventDefault();
          });

          document.body.appendChild(form);
          form.requestSubmit();
          form.remove();
          expect(control[onReportValidity]).not.toHaveBeenCalled();
        });
      });

      describe('invalid to valid', () => {
        it('should be called with null when form.reportValidity() is called after fixing invalid', () => {
          const control = new TestOnReportValidity();
          const onReportValiditySpy = jasmine.createSpy('onReportValidity');
          control[onReportValidity] = onReportValiditySpy;
          const form = document.createElement('form');
          form.appendChild(control);
          document.body.appendChild(form);

          control.required = true;
          form.reportValidity();
          onReportValiditySpy.calls.reset();

          // Fix invalid
          control.checked = true;

          form.reportValidity();
          form.remove();

          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
        });

        it('should be called with null when form.requestSubmit() is called after fixing invalid', () => {
          const control = new TestOnReportValidity();
          const onReportValiditySpy = jasmine.createSpy('onReportValidity');
          control[onReportValidity] = onReportValiditySpy;
          const form = document.createElement('form');
          form.appendChild(control);
          document.body.appendChild(form);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading.
              event.preventDefault();
            },
            {capture: true},
          );

          control.required = true;
          form.reportValidity();
          onReportValiditySpy.calls.reset();

          // Fix invalid
          control.checked = true;

          // Submit imperatively
          form.requestSubmit();
          form.remove();

          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
        });

        it('should be called with null when form.requestSubmit() is called after fixing invalid, but another sibling is invalid', () => {
          const control = new TestOnReportValidity();
          const onReportValiditySpy = jasmine.createSpy('onReportValidity');
          control[onReportValidity] = onReportValiditySpy;
          const form = document.createElement('form');
          form.appendChild(control);

          const invalidSibling = document.createElement('input');
          invalidSibling.required = true;
          form.appendChild(invalidSibling);

          document.body.appendChild(form);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading.
              event.preventDefault();
            },
            {capture: true},
          );

          control.required = true;
          form.reportValidity();
          onReportValiditySpy.calls.reset();

          // Fix invalid
          control.checked = true;

          // Submit imperatively
          form.requestSubmit();
          form.remove();

          expect(invalidSibling.validity.valid)
            .withContext('sibling is invalid')
            .toBeFalse();
          expect(control[onReportValidity]).toHaveBeenCalledWith(null);
        });

        it('should be called with null when form submits declaratively after fixing invalid', () => {
          const control = new TestOnReportValidity();
          const onReportValiditySpy = jasmine.createSpy('onReportValidity');
          control[onReportValidity] = onReportValiditySpy;
          const form = document.createElement('form');
          form.appendChild(control);
          const submitButton = document.createElement('button');
          form.appendChild(submitButton);
          document.body.appendChild(form);
          form.addEventListener(
            'submit',
            (event) => {
              // Prevent the test page from actually reloading.
              event.preventDefault();
            },
            {capture: true},
          );

          control.required = true;
          form.reportValidity();
          onReportValiditySpy.calls.reset();

          // Fix invalid
          control.checked = true;

          // Submit declaratively
          submitButton.click();
          form.remove();

          expect(control[onReportValidity]).toHaveBeenCalledOnceWith(null);
        });

        it('should be called with null when form submits declaratively after fixing invalid, but another sibling is invalid', () => {
          // See above "This is a known limitation" for explanation.
          expect().nothing();
        });
      });

      it('should clean up when form is unassociated and not call when non-parent form.reportValidity() is called', () => {
        const control = new TestOnReportValidity();
        control[onReportValidity] = jasmine.createSpy('onReportValidity');
        const form = document.createElement('form');
        form.appendChild(control);

        form.reportValidity();
        expect(control[onReportValidity])
          .withContext('onReportValidity is called once while attached to form')
          .toHaveBeenCalledTimes(1);

        form.removeChild(control);
        form.reportValidity();
        expect(control[onReportValidity])
          .withContext('onReportValidity is not called a second time')
          .toHaveBeenCalledTimes(1);
      });
    });
  });
});
