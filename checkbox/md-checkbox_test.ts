/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {fixture, TestFixture} from '@material/web/compat/testing/helpers';  // TODO(b/235474830): remove the use of fixtures
import {MdFocusRing} from '@material/web/focus/focus-ring';
import {html} from 'lit';

import {MdCheckbox} from './checkbox';
import {CheckboxHarness} from './harness';

interface CheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  value: string;
  name: string;
  reduceTouchTarget: boolean;
}

const defaultCheckbox = html`<md-checkbox></md-checkbox>`;

const checkbox = (propsInit: Partial<CheckboxProps>) => {
  return html`
    <md-checkbox
      ?checked=${propsInit.checked === true}
      ?indeterminate=${propsInit.indeterminate === true}
      ?disabled=${propsInit.disabled === true}
      value=${propsInit.value ?? ''}
      ?reduceTouchTarget=${propsInit.reduceTouchTarget === true}>
    </md-checkbox>
  `;
};

describe('md-checkbox', () => {
  let fixt: TestFixture;
  let element: MdCheckbox;
  let harness: CheckboxHarness;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultCheckbox);
      element = fixt.root.querySelector('md-checkbox')!;
      harness = new CheckboxHarness(element);
    });

    it('initializes as an md-checkbox', () => {
      expect(element).toBeInstanceOf(MdCheckbox);
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

    it('triggers a `pressbegin` event', async () => {
      const pressBeginSpy = jasmine.createSpy('pressBeginHandler');
      element.addEventListener('pressbegin', pressBeginSpy);

      await harness.clickWithMouse();
      await element.updateComplete;

      expect(pressBeginSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
      expect(pressBeginSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        detail: {positionEvent: jasmine.anything()},
      }));
    });

    it('triggers a `pressend` event', async () => {
      const pressEndSpy = jasmine.createSpy('pressEndHandler');
      element.addEventListener('pressend', pressEndSpy);

      await harness.clickWithMouse();
      await element.updateComplete;

      expect(pressEndSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
      expect(pressEndSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        detail: {cancelled: false},
      }));
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({checked: true}));
      element = fixt.root.querySelector('md-checkbox')!;
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
      fixt = await fixture(checkbox({indeterminate: true}));
      element = fixt.root.querySelector('md-checkbox')!;
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
      fixt = await fixture(checkbox({disabled: true}));
      element = fixt.root.querySelector('md-checkbox')!;
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
      fixt = await fixture(checkbox({value: 'new value'}));
      element = fixt.root.querySelector('md-checkbox')!;
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
      fixt = await fixture(defaultCheckbox);
      element = fixt.root.querySelector('md-checkbox')!;
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
