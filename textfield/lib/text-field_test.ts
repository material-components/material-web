/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../field/filled-field.js';

import {html, render} from 'lit';
import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';

import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';
import {TextFieldHarness} from '../harness.js';

import {TextField} from './text-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-text-field': TestTextField;
  }
}

@customElement('md-test-text-field')
class TestTextField extends TextField {
  protected override readonly fieldTag = literal`md-filled-field`;

  getHasError() {
    return this.renderRoot.querySelector('input')?.getAttribute(
               'aria-invalid') === 'true';
  }

  getSupportingTextValue() {
    return this.renderRoot.querySelector<HTMLElement>('#support')?.innerText ||
        '';
  }

  didErrorAnnounce() {
    return this.renderRoot.querySelector('#support')?.getAttribute('role') ===
        'alert';
  }
}

describe('TextField', () => {
  const env = new Environment();

  async function setupTest(
      template = html`<md-test-text-field></md-test-text-field>`) {
    // Variant type does not matter for shared tests
    const element = env.render(template).querySelector('md-test-text-field');
    if (!element) {
      throw new Error('Could not query rendered <md-test-text-field>.');
    }

    await env.waitForStability();
    const input = element.renderRoot.querySelector('input');
    if (!input) {
      throw new Error('Could not query rendered <input>.');
    }

    return {
      input,
      testElement: element,
      harness: new TextFieldHarness(element),
    };
  }

  describe('focusing the input', () => {
    it('should call focus the input on click', async () => {
      const {harness, input} = await setupTest();

      await harness.clickWithMouse();

      expect(input.matches(':focus')).withContext('is input:focus').toBeTrue();
    });

    it('should focus the input when elements inside text field are clicked',
       async () => {
         const {harness, input} = await setupTest();
         // Add a trailing icon button to click on
         render(html`<button slot="trailingicon">X</button>`, harness.element);
         const button = harness.element.querySelector('button');

         expect(button).toBeDefined();
         const buttonHarness = new Harness(button!);
         await buttonHarness.clickWithMouse();

         expect(input.matches(':focus'))
             .withContext('is input:focus')
             .toBeTrue();
       });

    it('should not focus the input when disabled', async () => {
      const {harness, input} = await setupTest();
      harness.element.disabled = true;

      harness.element.focus();

      expect(input.matches(':focus'))
          .withContext('not input:focus')
          .toBeFalse();
    });

    it('focus() should focus input', async () => {
      const {harness, input} = await setupTest();

      harness.element.focus();

      expect(input.matches(':focus')).withContext('is input:focus').toBeTrue();
    });

    it('blur() should blur input', async () => {
      const {harness, input} = await setupTest();

      harness.element.focus();
      harness.element.blur();

      expect(input.matches(':focus'))
          .withContext('not input:focus')
          .toBeFalse();
    });
  });

  describe('input events', () => {
    it('should update the text field value', async () => {
      const {harness} = await setupTest();

      await harness.inputValue('Value');

      expect(harness.element.value).toEqual('Value');
    });

    it('should redispatch input events', async () => {
      const {harness, input} = await setupTest();
      const inputHandler = jasmine.createSpy('inputHandler');
      harness.element.addEventListener('input', inputHandler);

      const event = new InputEvent('input');
      input.dispatchEvent(event);

      expect(inputHandler).toHaveBeenCalledWith(event);
    });
  });

  describe('resetting the input', () => {
    it('should set value back to default value', async () => {
      const {harness} = await setupTest();
      harness.element.setAttribute('value', 'Default');
      await env.waitForStability();

      expect(harness.element.value).toBe('Default');
      await harness.deleteValue();
      await harness.inputValue('Value');
      expect(harness.element.value).toBe('Value');
      harness.element.reset();

      expect(harness.element.value).toBe('Default');
    });

    it('should set value to empty string if there is no default', async () => {
      const {harness} = await setupTest();

      await harness.inputValue('Value');
      harness.element.reset();

      expect(harness.element.value).toBe('');
    });
  });

  describe('default value', () => {
    it('should update `value` before user input', async () => {
      const {harness} = await setupTest();

      harness.element.setAttribute('value', 'Default');
      await env.waitForStability();

      expect(harness.element.value).toBe('Default');
    });

    it('should update `value` multiple times', async () => {
      const {harness} = await setupTest();

      harness.element.setAttribute('value', 'First default');
      await env.waitForStability();
      harness.element.setAttribute('value', 'Second default');
      await env.waitForStability();

      expect(harness.element.value).toBe('Second default');
    });

    it('should NOT update `value` after user input', async () => {
      const {harness} = await setupTest();

      harness.element.setAttribute('value', 'First default');
      await env.waitForStability();
      await harness.deleteValue();
      await harness.inputValue('Value');

      harness.element.setAttribute('value', 'Second default');
      await env.waitForStability();

      expect(harness.element.value).toBe('Value');
    });

    it('should render `value` instead of default value attribute when `value` changes',
       async () => {
         const {harness, input} = await setupTest();

         harness.element.setAttribute('value', 'Default');
         await env.waitForStability();
         expect(input.value).toBe('Default');

         harness.element.value = 'Value';
         await env.waitForStability();
         expect(input.value).toBe('Value');

         harness.element.value = '';
         await env.waitForStability();
         expect(input.value).toBe('');
         expect(harness.element.getAttribute('value')).toBe('Default');
       });
  });

  describe('valueAsDate', () => {
    it('should get input.valueAsDate', async () => {
      const {testElement, input} = await setupTest();
      const spy = spyOnProperty(input, 'valueAsDate', 'get').and.callThrough();

      expect(testElement.valueAsDate).toBe(null);

      expect(spy).toHaveBeenCalled();
    });

    it('should set input.valueAsDate', async () => {
      const {testElement, input} = await setupTest();
      testElement.type = 'date';
      await env.waitForStability();
      const spy = spyOnProperty(input, 'valueAsDate', 'set').and.callThrough();

      const value = new Date();
      testElement.valueAsDate = value;

      expect(spy).toHaveBeenCalledWith(value);
    });

    it('should set value to string version of date', async () => {
      const {testElement} = await setupTest();
      testElement.type = 'date';
      await env.waitForStability();

      const expectedValue = '2022-01-01';
      testElement.valueAsDate = new Date(expectedValue);

      expect(testElement.value).toBe(expectedValue);
    });
  });

  describe('valueAsNumber', () => {
    it('should get input.valueAsNumber', async () => {
      const {testElement, input} = await setupTest();
      const spy =
          spyOnProperty(input, 'valueAsNumber', 'get').and.callThrough();

      expect(testElement.valueAsNumber).toEqual(NaN);

      expect(spy).toHaveBeenCalled();
    });

    it('should set input.valueAsNumber', async () => {
      const {testElement, input} = await setupTest();
      testElement.type = 'number';
      await env.waitForStability();
      const spy =
          spyOnProperty(input, 'valueAsNumber', 'set').and.callThrough();

      testElement.valueAsNumber = 100;

      expect(spy).toHaveBeenCalledWith(100);
    });

    it('should set value to string version of number', async () => {
      const {testElement} = await setupTest();
      testElement.type = 'number';
      await env.waitForStability();

      testElement.valueAsNumber = 100;

      expect(testElement.value).toBe('100');
    });
  });

  describe('native validation', () => {
    it('should expose input validity', async () => {
      const {testElement, input} = await setupTest();
      const spy = spyOnProperty(input, 'validity', 'get').and.callThrough();

      expect(testElement.validity).toEqual(jasmine.any(Object));
      expect(spy).toHaveBeenCalled();
    });

    it('should expose input validationMessage', async () => {
      const {testElement, input} = await setupTest();
      const spy =
          spyOnProperty(input, 'validationMessage', 'get').and.callThrough();

      expect(testElement.validationMessage).toEqual(jasmine.any(String));
      expect(spy).toHaveBeenCalled();
    });

    it('should expose input willValidate', async () => {
      const {testElement, input} = await setupTest();
      const spy = spyOnProperty(input, 'willValidate', 'get').and.callThrough();

      expect(testElement.willValidate).toEqual(jasmine.any(Boolean));
      expect(spy).toHaveBeenCalled();
    });

    describe('checkValidity()', () => {
      it('should return true if the text field is valid', async () => {
        const {testElement} = await setupTest();

        expect(testElement.checkValidity()).toBeTrue();
      });

      it('should return false if the text field is invalid', async () => {
        const {testElement} = await setupTest();
        testElement.required = true;

        expect(testElement.checkValidity()).toBeFalse();
      });

      it('should not dispatch an invalid event when valid', async () => {
        const {testElement} = await setupTest();
        const invalidHandler = jasmine.createSpy('invalidHandler');
        testElement.addEventListener('invalid', invalidHandler);

        testElement.checkValidity();

        expect(invalidHandler).not.toHaveBeenCalled();
      });

      it('should dispatch an invalid event when invalid', async () => {
        const {testElement} = await setupTest();
        const invalidHandler = jasmine.createSpy('invalidHandler');
        testElement.addEventListener('invalid', invalidHandler);
        testElement.required = true;

        testElement.checkValidity();

        expect(invalidHandler).toHaveBeenCalled();
      });
    });

    describe('reportValidity()', () => {
      it('should return true when valid and set error to false', async () => {
        const {testElement} = await setupTest();

        const valid = testElement.reportValidity();

        expect(valid).withContext('valid').toBeTrue();
        expect(testElement.getHasError())
            .withContext('testElement.getHasError()')
            .toBeFalse();
      });

      it('should return false when invalid and set error to true', async () => {
        const {testElement} = await setupTest();
        testElement.required = true;

        const valid = testElement.reportValidity();

        expect(valid).withContext('valid').toBeFalse();
        expect(testElement.getHasError())
            .withContext('testElement.getHasError()')
            .toBeTrue();
      });

      it('should update supporting text to validationMessage', async () => {
        const {testElement} = await setupTest();
        const errorMessage = 'Error message';
        testElement.setCustomValidity(errorMessage);

        testElement.reportValidity();

        expect(testElement.validationMessage).toEqual(errorMessage);
        expect(testElement.getSupportingTextValue()).toEqual(errorMessage);
      });

      it('should not update error or supporting text if invalid event is canceled',
         async () => {
           const {testElement} = await setupTest();
           testElement.addEventListener('invalid', e => {
             e.preventDefault();
           });
           const errorMessage = 'Error message';
           testElement.setCustomValidity(errorMessage);

           const valid = testElement.reportValidity();

           expect(valid).withContext('valid').toBeFalse();
           expect(testElement.getHasError())
               .withContext('testElement.getHasError()')
               .toBeFalse();
           expect(testElement.getSupportingTextValue()).toEqual('');
         });

      it('should be overridden by error and errorText', async () => {
        const {testElement} = await setupTest();
        testElement.error = true;
        const errorMessage = 'Error message';
        testElement.errorText = errorMessage;

        const valid = testElement.reportValidity();
        expect(valid).withContext('native validity should be valid').toBeTrue();
        expect(testElement.getHasError())
            .withContext('testElement.getHasError()')
            .toBeTrue();
        expect(testElement.getSupportingTextValue()).toEqual(errorMessage);
      });
    });

    describe('setCustomValidity()', () => {
      it('should call input.setCustomValidity()', async () => {
        const {testElement, input} = await setupTest();
        spyOn(input, 'setCustomValidity').and.callThrough();

        const errorMessage = 'Error message';
        testElement.setCustomValidity(errorMessage);

        expect(input.setCustomValidity).toHaveBeenCalledWith(errorMessage);
      });
    });

    describe('minLength and maxLength', () => {
      it('should set attribute on input', async () => {
        const {testElement, input} = await setupTest();
        testElement.minLength = 2;
        testElement.maxLength = 5;
        await env.waitForStability();

        expect(input.getAttribute('minLength'))
            .withContext('minLength')
            .toEqual('2');
        expect(input.getAttribute('maxLength'))
            .withContext('maxLength')
            .toEqual('5');
      });

      it('should not set attribute if value is -1', async () => {
        const {testElement, input} = await setupTest();
        testElement.minLength = 2;
        testElement.maxLength = 5;
        await env.waitForStability();

        expect(input.hasAttribute('minlength'))
            .withContext('should have minlength')
            .toBeTrue();
        expect(input.hasAttribute('maxlength'))
            .withContext('should have maxlength')
            .toBeTrue();

        testElement.minLength = -1;
        testElement.maxLength = -1;
        await env.waitForStability();

        expect(input.hasAttribute('minlength'))
            .withContext('should not have minlength')
            .toBeFalse();
        expect(input.hasAttribute('maxlength'))
            .withContext('should not have maxlength')
            .toBeFalse();
      });
    });

    describe('min, max, and step', () => {
      it('should set attribute on input', async () => {
        const {testElement, input} = await setupTest();
        testElement.type = 'number';
        testElement.min = '2';
        testElement.max = '5';
        testElement.step = '1';
        await env.waitForStability();

        expect(input.getAttribute('min')).withContext('min').toEqual('2');
        expect(input.getAttribute('max')).withContext('max').toEqual('5');
        expect(input.getAttribute('step')).withContext('step').toEqual('1');
      });

      it('should not set attribute if value is empty', async () => {
        const {testElement, input} = await setupTest();
        testElement.type = 'number';
        testElement.min = '2';
        testElement.max = '5';
        testElement.step = '1';
        await env.waitForStability();

        expect(input.hasAttribute('min'))
            .withContext('should have min')
            .toBeTrue();
        expect(input.hasAttribute('max'))
            .withContext('should have max')
            .toBeTrue();
        expect(input.hasAttribute('step'))
            .withContext('should have step')
            .toBeTrue();

        testElement.min = '';
        testElement.max = '';
        testElement.step = '';
        await env.waitForStability();

        expect(input.hasAttribute('min'))
            .withContext('should not have min')
            .toBeFalse();
        expect(input.hasAttribute('max'))
            .withContext('should not have max')
            .toBeFalse();
        expect(input.hasAttribute('step'))
            .withContext('should not have step')
            .toBeFalse();
      });
    });

    describe('pattern', () => {
      it('should set attribute on input', async () => {
        const {testElement, input} = await setupTest();
        testElement.pattern = 'foo';
        await env.waitForStability();

        expect(input.getAttribute('pattern'))
            .withContext('pattern')
            .toEqual('foo');
      });

      it('should not set attribute if value is empty', async () => {
        const {testElement, input} = await setupTest();
        testElement.pattern = 'foo';
        await env.waitForStability();

        expect(input.hasAttribute('pattern'))
            .withContext('should have pattern')
            .toBeTrue();

        testElement.pattern = '';
        await env.waitForStability();

        expect(input.hasAttribute('pattern'))
            .withContext('should not have pattern')
            .toBeFalse();
      });
    });
  });

  describe('stepUp()', () => {
    it('should increment the value by `step`', async () => {
      const {testElement} = await setupTest();
      testElement.type = 'number';
      testElement.valueAsNumber = 10;
      testElement.step = '5';

      testElement.stepUp();

      expect(testElement.valueAsNumber).toEqual(15);
    });
  });

  describe('stepDown()', () => {
    it('should decrement the value by `step`', async () => {
      const {testElement} = await setupTest();
      testElement.type = 'number';
      testElement.valueAsNumber = 10;
      testElement.step = '5';

      testElement.stepDown();

      expect(testElement.valueAsNumber).toEqual(5);
    });
  });

  describe('error announcement', () => {
    it('should announce errors when both error and errorText are set',
       async () => {
         const {testElement} = await setupTest();
         testElement.error = true;
         testElement.errorText = 'Error message';
         await env.waitForStability();

         expect(testElement.didErrorAnnounce())
             .withContext('testElement.didErrorAnnounce()')
             .toBeTrue();
       });

    it('should announce native errors', async () => {
      const {testElement} = await setupTest();
      testElement.required = true;
      testElement.reportValidity();
      await env.waitForStability();

      expect(testElement.didErrorAnnounce())
          .withContext('testElement.didErrorAnnounce()')
          .toBeTrue();
    });

    it('should not announce supporting text', async () => {
      const {testElement} = await setupTest();
      testElement.error = true;
      testElement.supportingText = 'Not an error';
      await env.waitForStability();

      expect(testElement.didErrorAnnounce())
          .withContext('testElement.didErrorAnnounce()')
          .toBeFalse();
    });

    it('should re-announce when reportValidity() is called', async () => {
      const {testElement} = await setupTest();
      testElement.error = true;
      testElement.errorText = 'Error message';

      testElement.reportValidity();
      await env.waitForStability();
      // After lit update, but before re-render refresh
      expect(testElement.didErrorAnnounce())
          .withContext('didErrorAnnounce() before refresh')
          .toBeFalse();

      // After the second lit update render refresh
      await env.waitForStability();
      expect(testElement.didErrorAnnounce())
          .withContext('didErrorAnnounce() after refresh')
          .toBeTrue();
    });
  });

  describe('form submission', () => {
    async function setupFormTest(propsInit: Partial<TestTextField> = {}) {
      const template = html`
        <form>
          <md-test-text-field
            ?disabled=${propsInit.disabled === true}
            .name=${propsInit.name ?? ''}
            .value=${propsInit.value ?? ''}>
          </md-test-text-field>
        </form>`;
      return setupTest(template);
    }

    it('does not submit if disabled', async () => {
      const {harness} = await setupFormTest({name: 'foo', disabled: true});
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toBeNull();
    });

    it('does not submit if name is not provided', async () => {
      const {harness} = await setupFormTest();
      const formData = await harness.submitForm();
      const keys = Array.from(formData.keys());
      expect(keys.length).toEqual(0);
    });

    it('submits under correct conditions', async () => {
      const {harness} = await setupFormTest({name: 'foo', value: 'bar'});
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toEqual('bar');
    });
  });
});
