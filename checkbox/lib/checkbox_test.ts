/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {fixture, TestFixture} from '@material/web/compat/testing/helpers';  // TODO(b/235474830): remove the use of fixtures
import {MdFocusRing} from '@material/web/focus/focus-ring';
import {html} from 'lit';
import {customElement} from 'lit/decorators';

import {CheckboxHarness} from '../harness';

import {Checkbox} from './checkbox';

@customElement('md-test-checkbox')
class TestCheckbox extends Checkbox {
}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-checkbox': TestCheckbox;
  }
}

describe('checkbox', () => {
  let fixt: TestFixture;
  let element: TestCheckbox;
  let harness: CheckboxHarness;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(html`<md-test-checkbox></md-test-checkbox>`);
      element = fixt.root.querySelector('md-test-checkbox')!;
      harness = new CheckboxHarness(element);
    });

    it('initializes as an checkbox', () => {
      expect(element).toBeInstanceOf(TestCheckbox);
      expect(element.checked).toEqual(false);
      expect(element.indeterminate).toEqual(false);
      expect(element.disabled).toEqual(false);
      expect(element.value).toEqual('on');
    });

    it('user input updates checked state', async () => {
      await harness.clickWithMouse();
      await element.updateComplete;
      expect(element.checked).toEqual(true);
    });

    it('should trigger changed event when checkbox is selected', async () => {
      const changeHandler = jasmine.createSpy('changeHandler');
      fixt.root.addEventListener('change', changeHandler);

      await harness.clickWithMouse();

      expect(element.checked).toBeTrue();
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler).toHaveBeenCalledWith(jasmine.any(Event));
    });

    it('should trigger an event with event detail including checked status',
       async () => {
         const pressEndSpy = jasmine.createSpy('pressEndHandler');
         element.addEventListener('action', pressEndSpy);

         await harness.clickWithMouse();
         await element.updateComplete;

         expect(pressEndSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
         expect(pressEndSpy).toHaveBeenCalledWith(jasmine.objectContaining({
           detail: jasmine.objectContaining({checked: true}),
         }));
       });
  });

  describe('checked', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-checkbox
          ?checked=${true}>
        </md-test-checkbox>
      `);
      element = fixt.root.querySelector('md-test-checkbox')!;
      harness = new CheckboxHarness(element);
      await element.updateComplete;
    });

    it('get/set updates the checked property on the native checkbox element',
       async () => {
         expect((await harness.getInteractiveElement()).checked).toEqual(true);
         element.checked = false;
         await element.updateComplete;
         expect((await harness.getInteractiveElement()).checked).toEqual(false);
       });
  });

  describe('indeterminate', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-checkbox
          ?indeterminate=${true}>
        </md-test-checkbox>
      `);
      element = fixt.root.querySelector('md-test-checkbox')!;
      harness = new CheckboxHarness(element);
      await element.updateComplete;
    });

    it('get/set updates the indeterminate property on the native checkbox element',
       async () => {
         const input = await harness.getInteractiveElement();

         expect(input.indeterminate).toEqual(true);
         expect(input.getAttribute('aria-checked')).toEqual('mixed');

         element.indeterminate = false;
         await element.updateComplete;

         expect(input.indeterminate).toEqual(false);
         expect(input.getAttribute('aria-checked')).not.toEqual('mixed');
       });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-checkbox
          ?disabled=${true}>
        </md-test-checkbox>
      `);
      element = fixt.root.querySelector('md-test-checkbox')!;
      harness = new CheckboxHarness(element);
      await element.updateComplete;
    });

    it('get/set updates the disabled property on the native checkbox element',
       async () => {
         const input = await harness.getInteractiveElement();

         expect(input.disabled).toEqual(true);
         element.disabled = false;
         await element.updateComplete;
         expect(input.disabled).toEqual(false);
       });
  });

  describe('value', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-checkbox
          value="new value">
        </md-test-checkbox>
      `);
      element = fixt.root.querySelector('md-test-checkbox')!;
      harness = new CheckboxHarness(element);
      await element.updateComplete;
    });

    it('get/set updates the value of the native checkbox element', async () => {
      const input = await harness.getInteractiveElement();

      expect(input.value).toEqual('new value');
      element.value = 'new value 2';
      await element.updateComplete;
      expect(input.value).toEqual('new value 2');
    });
  });

  describe('focus ring', () => {
    let focusRing: MdFocusRing;

    beforeEach(async () => {
      fixt = await fixture(html`<md-test-checkbox></md-test-checkbox>`);
      element = fixt.root.querySelector('md-test-checkbox')!;
      focusRing = element.shadowRoot!.querySelector('md-focus-ring')!;
      harness = new CheckboxHarness(element);
    });

    it('hidden on non-keyboard focus', async () => {
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });

    it('visible on keyboard focus and hides on blur', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.blur();
      expect(focusRing.visible).toBeFalse();
    });

    it('hidden after pointer interaction', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });
  });
});
