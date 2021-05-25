/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Checkbox} from '@material/mwc-checkbox';
import * as hanbi from 'hanbi';
import {html} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../../../test/src/util/helpers';

interface CheckboxInternals {
  formElement: HTMLInputElement;
  animationClass: string;
}

interface CheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  value: string;
  reduceTouchTarget: boolean;
}

const defaultCheckbox = html`<mwc-checkbox></mwc-checkbox>`;

const checkbox = (propsInit: Partial<CheckboxProps>) => {
  return html`
    <mwc-checkbox
      ?checked=${propsInit.checked === true}
      ?indeterminate=${propsInit.indeterminate === true}
      ?disabled=${propsInit.disabled === true}
      value=${propsInit.value ?? ''}
      ?reduceTouchTarget=${propsInit.reduceTouchTarget === true}>
    </mwc-checkbox>
  `;
};

describe('mwc-checkbox', () => {
  let fixt: TestFixture;
  let element: Checkbox;
  let internals: CheckboxInternals;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultCheckbox);
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
    });

    it('initializes as an mwc-checkbox', () => {
      expect(element).toBeInstanceOf(Checkbox);
      expect(element.checked).toEqual(false);
      expect(element.indeterminate).toEqual(false);
      expect(element.disabled).toEqual(false);
      expect(element.value).toEqual('');
    });

    it('element.formElement returns the native checkbox element', async () => {
      await element.updateComplete;
      expect(internals.formElement).toBeInstanceOf(HTMLElement);
      expect(internals.formElement.localName).toEqual('input');
    });

    it('user input emits `change` event', async () => {
      const callback = hanbi.spy();
      element.addEventListener('change', callback.handler);
      element.click();
      expect(callback.callCount).toEqual(1);
    });

    it('user input updates checked state', async () => {
      element.click();
      await element.updateComplete;
      expect(element.checked).toEqual(true);
    });

    it('change event has updated values for `checked`', () => {
      let changeChecked: boolean|undefined = undefined;
      element.addEventListener('change', () => {
        changeChecked = element.checked;
      });
      element.click();
      expect(changeChecked).toBeTruthy();
    });

    it('does not animate after being hidden', async () => {
      element.checked = true;
      const animatedElement =
          element.shadowRoot!.querySelector('.mdc-checkbox__background')!;
      await new Promise((resolve) => {
        animatedElement.addEventListener('animationend', resolve);
      });
      await element.updateComplete;
      element.style.display = 'hidden';
      await rafPromise();
      element.style.display = '';
      await rafPromise();
      expect(internals.animationClass).toEqual('');
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({checked: true}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the checked property on the native checkbox element',
       async () => {
         expect(internals.formElement.checked).toEqual(true);
         element.checked = false;
         await element.updateComplete;
         expect(internals.formElement.checked).toEqual(false);
       });
  });

  describe('indeterminate', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({indeterminate: true}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the indeterminate property on the native checkbox element',
       async () => {
         expect(internals.formElement.indeterminate).toEqual(true);
         expect(internals.formElement.getAttribute('aria-checked'))
             .toEqual('mixed');
         element.indeterminate = false;
         await element.updateComplete;
         expect(internals.formElement.indeterminate).toEqual(false);
       });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({disabled: true}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the disabled property on the native checkbox element',
       async () => {
         expect(internals.formElement.disabled).toEqual(true);
         element.disabled = false;
         await element.updateComplete;
         expect(internals.formElement.disabled).toEqual(false);
       });
  });

  describe('value', () => {
    beforeEach(async () => {
      fixt = await fixture(checkbox({value: 'new value'}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    it('get/set updates the value of the native checkbox element', async () => {
      expect(internals.formElement.value).toEqual('new value');
      element.value = 'new value 2';
      await element.updateComplete;
      expect(internals.formElement.value).toEqual('new value 2');
    });
  });
});
