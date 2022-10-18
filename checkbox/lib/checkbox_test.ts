/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {MdFocusRing} from '../../focus/focus-ring.js';
import {Environment} from '../../testing/environment.js';
import {CheckboxHarness} from '../harness.js';

import {Checkbox} from './checkbox.js';

@customElement('md-test-checkbox')
class TestCheckbox extends Checkbox {
}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-checkbox': TestCheckbox;
  }
}

describe('checkbox', () => {
  const env = new Environment();

  async function setupTest() {
    const element = env.render(html`<md-test-checkbox></md-test-checkbox>`)
                        .querySelector('md-test-checkbox');
    if (!element) {
      throw new Error('Could not query rendered <md-test-checkbox>.');
    }

    await env.waitForStability();
    const input = element.renderRoot.querySelector('input');
    if (!input) {
      throw new Error('Could not query rendered <input>.');
    }

    const focusRing =
        element.renderRoot.querySelector<MdFocusRing>('md-focus-ring');
    if (!focusRing) {
      throw new Error('Could not query rendered <md-focus-ring>.');
    }

    return {
      input,
      focusRing,
      harness: new CheckboxHarness(element),
    };
  }

  describe('basic', () => {
    it('initializes as an checkbox', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(TestCheckbox);
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

    it('should trigger an event with event detail including checked status',
       async () => {
         const {harness} = await setupTest();
         const pressEndSpy = jasmine.createSpy('pressEndHandler');
         harness.element.addEventListener('action', pressEndSpy);

         await harness.clickWithMouse();
         await env.waitForStability();

         expect(pressEndSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
         expect(pressEndSpy).toHaveBeenCalledWith(jasmine.objectContaining({
           detail: jasmine.objectContaining({checked: true}),
         }));
       });
  });

  describe('checked', () => {
    it('get/set updates the checked property on the native checkbox element',
       async () => {
         const {harness, input} = await setupTest();
         harness.element.checked = true;
         await env.waitForStability();
         expect(input.checked).toEqual(true);
         harness.element.checked = false;
         await env.waitForStability();
         expect(input.checked).toEqual(false);
       });
  });

  describe('indeterminate', () => {
    it('get/set updates the indeterminate property on the native checkbox element',
       async () => {
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
    it('get/set updates the disabled property on the native checkbox element',
       async () => {
         const {harness, input} = await setupTest();
         harness.element.disabled = true;
         await env.waitForStability();

         expect(input.disabled).toEqual(true);
         harness.element.disabled = false;
         await env.waitForStability();
         expect(input.disabled).toEqual(false);
       });
  });

  describe('value', () => {
    it('get/set updates the value of the native checkbox element', async () => {
      const {harness, input} = await setupTest();
      harness.element.value = 'new value';
      await env.waitForStability();

      expect(input.value).toEqual('new value');
      harness.element.value = 'new value 2';
      await env.waitForStability();
      expect(input.value).toEqual('new value 2');
    });
  });

  describe('focus ring', () => {
    it('hidden on non-keyboard focus', async () => {
      const {harness, focusRing} = await setupTest();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });

    it('visible on keyboard focus and hides on blur', async () => {
      const {harness, focusRing} = await setupTest();
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.blur();
      expect(focusRing.visible).toBeFalse();
    });

    it('hidden after pointer interaction', async () => {
      const {harness, focusRing} = await setupTest();
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });
  });
});
