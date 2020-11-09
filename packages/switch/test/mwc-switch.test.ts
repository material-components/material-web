/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {Switch} from '@material/mwc-switch';
import * as hanbi from 'hanbi';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

interface SwitchProps {
  checked: boolean;
  disabled: boolean;
}

const defaultSwitchElement = html`<mwc-switch></mwc-switch>`;

const switchElement = (propsInit: Partial<SwitchProps>) => {
  return html`
    <mwc-switch
      ?checked=${propsInit.checked === true}
      ?disabled=${propsInit.disabled === true}></mwc-switch>
  `;
};

suite('mwc-switch', () => {
  let fixt: TestFixture;
  let element: Switch;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultSwitchElement);
      element = fixt.root.querySelector('mwc-switch')!;
      await element.updateComplete;
    });

    test('initializes as an mwc-switch', () => {
      assert.instanceOf(element, Switch);
      assert.equal(element.checked, false);
      assert.equal(element.disabled, false);
    });

    test('user input emits `change` event', async () => {
      const callback = hanbi.spy();
      element.addEventListener('change', callback.handler);

      element.click();

      assert.equal(callback.callCount, 1);
    });
  });

  suite('checked', () => {
    setup(async () => {
      fixt = await fixture(switchElement({checked: true}));
      element = fixt.root.querySelector('mwc-switch')!;
      await element.updateComplete;
    });

    test('checks the native input', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      assert(input.checked);

      element.checked = false;
      await element.updateComplete;
      assert(!input.checked);
    });

    test(
        'setting `checked` affects `aria-checked` of native input',
        async () => {
          const input = element.shadowRoot!.querySelector('input')!;
          assert.equal(input.getAttribute('aria-checked'), 'true');

          element.checked = false;
          await element.updateComplete;
          assert.equal(input.getAttribute('aria-checked'), 'false');
        });
  });

  suite('disabled', () => {
    setup(async () => {
      fixt = await fixture(switchElement({disabled: true}));
      element = fixt.root.querySelector('mwc-switch')!;
      await element.updateComplete;
    });

    test('disables the native input', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      assert(input.disabled);

      element.disabled = false;
      await element.updateComplete;
      assert(!input.disabled);
    });
  });
});
