/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';
import {CheckboxHarness} from '../harness.js';

import {Checkbox} from './checkbox.js';

customElements.define('md-test-checkbox', Checkbox);

declare global {
  interface HTMLElementTagNameMap {
    'md-test-checkbox': Checkbox;
  }
}

describe('checkbox', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-test-checkbox></md-test-checkbox>`,
  ) {
    const element = env.render(template).querySelector('md-test-checkbox');
    if (!element) {
      throw new Error('Could not query rendered <md-test-checkbox>.');
    }

    await env.waitForStability();
    const input = element.renderRoot.querySelector('input');
    if (!input) {
      throw new Error('Could not query rendered <input>.');
    }

    return {
      input,
      harness: new CheckboxHarness(element),
    };
  }

  describe('basic', () => {
    it('initializes as a checkbox', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(Checkbox);
      expect(harness.element.checked).toEqual(false);
      expect(harness.element.indeterminate).toEqual(false);
      expect(harness.element.disabled).toEqual(false);
      expect(harness.element.value).toEqual('on');
    });

    it('user input updates checked state', async () => {
      const {harness} = await setupTest();
      await harness.clickWithMouse();
      await env.waitForStability();
      expect(harness.element.checked).toEqual(true);
    });

    it('should trigger changed event when checkbox is selected', async () => {
      const {harness} = await setupTest();
      const changeHandler = jasmine.createSpy('changeHandler');
      harness.element.addEventListener('change', changeHandler);

      await harness.clickWithMouse();

      expect(harness.element.checked).toBeTrue();
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler).toHaveBeenCalledWith(jasmine.any(Event));
    });

    it('should trigger input event when checkbox is selected', async () => {
      const {harness} = await setupTest();
      const inputHandler = jasmine.createSpy('inputHandler');
      harness.element.addEventListener('input', inputHandler);

      await harness.clickWithMouse();

      expect(harness.element.checked).toBeTrue();
      expect(inputHandler).toHaveBeenCalledTimes(1);
      expect(inputHandler).toHaveBeenCalledWith(jasmine.any(Event));
    });

    it('checkbox state is updated during input event listeners', async () => {
      const {harness} = await setupTest();
      let state = false;
      const inputHandler = jasmine
        .createSpy('inputHandler')
        .and.callFake(() => {
          state = harness.element.checked;
        });

      harness.element.addEventListener('input', inputHandler);

      await harness.clickWithMouse();
      expect(inputHandler).withContext('input listener').toHaveBeenCalled();
      expect(state)
        .withContext('checkbox.checked during input listener')
        .toBeTrue();
    });

    it('checkbox state is updated during change event listeners', async () => {
      const {harness} = await setupTest();
      let state = false;
      const changeHandler = jasmine
        .createSpy('changeHandler')
        .and.callFake(() => {
          state = harness.element.checked;
        });

      harness.element.addEventListener('change', changeHandler);

      await harness.clickWithMouse();
      expect(changeHandler).withContext('change listener').toHaveBeenCalled();
      expect(state)
        .withContext('checkbox.checked during change listener')
        .toBeTrue();
    });
  });

  describe('checked', () => {
    it('get/set updates the checked property on the native checkbox element', async () => {
      const {harness, input} = await setupTest();
      harness.element.checked = true;
      await env.waitForStability();
      expect(input.checked).toEqual(true);
      harness.element.checked = false;
      await env.waitForStability();
      expect(input.checked).toEqual(false);
    });

    it('get/set updates the checked property after user updates checked state', async () => {
      const {harness, input} = await setupTest();

      // Simulate user interaction setting checked to true.
      await harness.clickWithMouse();
      await env.waitForStability();
      expect(input.checked).toEqual(true);
      expect(harness.element.checked).toEqual(true);

      // Set custom element checked to false.
      harness.element.checked = false;
      await env.waitForStability();
      expect(input.checked).toEqual(false);
      expect(harness.element.checked).toEqual(false);

      // Set custom element checked to true.
      harness.element.checked = true;
      await env.waitForStability();
      expect(input.checked).toEqual(true);
      expect(harness.element.checked).toEqual(true);
    });
  });

  describe('indeterminate', () => {
    it('get/set updates the indeterminate property on the native checkbox element', async () => {
      const {harness, input} = await setupTest();
      harness.element.indeterminate = true;
      await env.waitForStability();

      expect(input.indeterminate).toEqual(true);
      expect(input.getAttribute('aria-checked')).toEqual('mixed');

      harness.element.indeterminate = false;
      await env.waitForStability();

      expect(input.indeterminate).toEqual(false);
      expect(input.getAttribute('aria-checked')).not.toEqual('mixed');
    });
  });

  describe('disabled', () => {
    it('get/set updates the disabled property on the native checkbox element', async () => {
      const {harness, input} = await setupTest();
      harness.element.disabled = true;
      await env.waitForStability();

      expect(input.disabled).toEqual(true);
      harness.element.disabled = false;
      await env.waitForStability();
      expect(input.disabled).toEqual(false);
    });
  });

  describe('form submission', () => {
    async function setupFormTest(propsInit: Partial<Checkbox> = {}) {
      return await setupTest(html` <form>
        <md-test-checkbox
          .checked=${propsInit.checked === true}
          .disabled=${propsInit.disabled === true}
          .name=${propsInit.name ?? ''}
          .value=${propsInit.value ?? ''}></md-test-checkbox>
      </form>`);
    }

    it('does not submit if not checked', async () => {
      const {harness} = await setupFormTest({name: 'foo'});
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toBeNull();
    });

    it('does not submit if disabled', async () => {
      const {harness} = await setupFormTest({
        name: 'foo',
        checked: true,
        disabled: true,
      });
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toBeNull();
    });

    it('does not submit if name is not provided', async () => {
      const {harness} = await setupFormTest({checked: true});
      const formData = await harness.submitForm();
      const keys = Array.from(formData.keys());
      expect(keys.length).toEqual(0);
    });

    it('submits under correct conditions', async () => {
      const {harness} = await setupFormTest({
        name: 'foo',
        checked: true,
        value: 'bar',
      });
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toEqual('bar');
    });
  });

  describe('label activation', () => {
    async function setupLabelTest() {
      const test = await setupTest(html`
        <label>
          <md-test-checkbox></md-test-checkbox>
        </label>
      `);
      const label = (
        test.harness.element.getRootNode() as HTMLElement
      ).querySelector<HTMLLabelElement>('label')!;
      return {...test, label};
    }

    it('toggles when label is clicked', async () => {
      const {
        harness: {element},
        label,
      } = await setupLabelTest();
      label.click();
      await env.waitForStability();
      expect(element.checked).toBeTrue();
      label.click();
      await env.waitForStability();
      expect(element.checked).toBeFalse();
    });
  });

  describe('validation', () => {
    it('should set valueMissing when required and not selected', async () => {
      const {harness} = await setupTest();
      harness.element.required = true;

      expect(harness.element.validity.valueMissing)
        .withContext('checkbox.validity.valueMissing')
        .toBeTrue();
    });

    it('should not set valueMissing when required and checked', async () => {
      const {harness} = await setupTest();
      harness.element.required = true;
      harness.element.checked = true;

      expect(harness.element.validity.valueMissing)
        .withContext('checkbox.validity.valueMissing')
        .toBeFalse();
    });

    it('should set valueMissing when required and indeterminate', async () => {
      const {harness} = await setupTest();
      harness.element.required = true;
      harness.element.indeterminate = true;

      expect(harness.element.validity.valueMissing)
        .withContext('checkbox.validity.valueMissing')
        .toBeTrue();
    });
  });
});
