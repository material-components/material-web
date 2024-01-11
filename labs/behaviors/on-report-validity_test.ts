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
        expect(control[onReportValidity]).toHaveBeenCalledWith(null);
      });
    });

    describe('for invalid controls', () => {
      it('should be called with event when reportValidity() is called and it is invalid', () => {
        const control = new TestOnReportValidity();
        control[onReportValidity] = jasmine.createSpy('onReportValidity');

        control.required = true;
        control.reportValidity();
        expect(control[onReportValidity]).toHaveBeenCalledWith(
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

    describe('with forms', () => {
      describe('for valid controls', () => {
        it('should be called with null when form.reportValidity() is called and it is valid', () => {
          const control = new TestOnReportValidity();
          control[onReportValidity] = jasmine.createSpy('onReportValidity');
          const form = document.createElement('form');
          form.appendChild(control);

          form.reportValidity();
          expect(control[onReportValidity]).toHaveBeenCalledWith(null);
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
          expect(control[onReportValidity]).toHaveBeenCalledWith(null);
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
          expect(control[onReportValidity]).toHaveBeenCalledWith(
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
          expect(control[onReportValidity]).toHaveBeenCalledWith(
            jasmine.any(Event),
          );
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
