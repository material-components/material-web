/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import {TextField} from '@material/mwc-textfield';
import {cssClasses} from '@material/textfield/constants';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../util/helpers'


const basic = html`
  <mwc-textfield></mwc-textfield>
`;

const required = html`
  <mwc-textfield label="I am required" required></mwc-textfield>
`;

const isUiInvalid =
    (element: TextField) => {
      return !!element.shadowRoot!.querySelector(`.${cssClasses.INVALID}`);
    }

suite('mwc-textfield:' , () => {
  let element: TextField;
  let fixt: TestFixture;

  suite('basic', () => {

    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textfield')!;
    });

    test('initializes as an mwc-textfield', () => {
      assert.instanceOf(element, TextField);
    });

    test('setting value sets on input', async () => {
      element.value = 'my test value';

      const inputElement = element.shadowRoot!.querySelector('input');
      assert(inputElement, 'my test value');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('validation', () => {
    suiteSetup(async () => {
      fixt = await fixture(required);
      element = fixt.root.querySelector('mwc-textfield')!;
      await element.updateComplete;
    });

    test('required invalidates on blur', async () => {
      expect(isUiInvalid(element)).to.be.false;
      element.focus();
      element.blur();
      expect(isUiInvalid(element)).to.be.true;
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });
});
