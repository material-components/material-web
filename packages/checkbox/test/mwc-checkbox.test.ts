/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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

suite('mwc-checkbox', () => {
  let fixt: TestFixture;
  let element: Checkbox;
  let internals: CheckboxInternals;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultCheckbox);
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
    });

    test('initializes as an mwc-checkbox', () => {
      assert.instanceOf(element, Checkbox);
      assert.equal(element.checked, false);
      assert.equal(element.indeterminate, false);
      assert.equal(element.disabled, false);
      assert.equal(element.value, '');
    });

    test(
        'element.formElement returns the native checkbox element', async () => {
          await element.updateComplete;
          assert.instanceOf(internals.formElement, HTMLElement);
          assert.equal(internals.formElement.localName, 'input');
        });

    test('user input emits `change` event', async () => {
      const callback = hanbi.spy();
      element.addEventListener('change', callback.handler);
      element.click();
      assert.equal(callback.callCount, 1);
    });

    test('user input updates checked state', async () => {
      element.click();
      await element.updateComplete;
      assert.equal(element.checked, true);
    });

    test('does not animate after being hidden', async () => {
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
      assert.equal(internals.animationClass, '');
    });
  });

  suite('checked', () => {
    setup(async () => {
      fixt = await fixture(checkbox({checked: true}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    test(
        'get/set updates the checked property on the native checkbox element',
        async () => {
          assert.equal(internals.formElement.checked, true);
          element.checked = false;
          await element.updateComplete;
          assert.equal(internals.formElement.checked, false);
        });
  });

  suite('indeterminate', () => {
    setup(async () => {
      fixt = await fixture(checkbox({indeterminate: true}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    test(
        'get/set updates the indeterminate property on the native checkbox element',
        async () => {
          assert.equal(internals.formElement.indeterminate, true);
          assert.equal(
              internals.formElement.getAttribute('aria-checked'), 'mixed');
          element.indeterminate = false;
          await element.updateComplete;
          assert.equal(internals.formElement.indeterminate, false);
        });
  });

  suite('disabled', () => {
    setup(async () => {
      fixt = await fixture(checkbox({disabled: true}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    test(
        'get/set updates the disabled property on the native checkbox element',
        async () => {
          assert.equal(internals.formElement.disabled, true);
          element.disabled = false;
          await element.updateComplete;
          assert.equal(internals.formElement.disabled, false);
        });
  });

  suite('value', () => {
    setup(async () => {
      fixt = await fixture(checkbox({value: 'new value'}));
      element = fixt.root.querySelector('mwc-checkbox')!;
      internals = element as unknown as CheckboxInternals;
      await element.updateComplete;
    });

    test(
        'get/set updates the value of the native checkbox element',
        async () => {
          assert.equal(internals.formElement.value, 'new value');
          element.value = 'new value 2';
          await element.updateComplete;
          assert.equal(internals.formElement.value, 'new value 2');
        });
  });
});
