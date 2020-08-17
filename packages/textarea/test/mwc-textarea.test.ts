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

import {TextArea} from '@material/mwc-textarea';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

const basic = html`
  <mwc-textarea></mwc-textarea>
`;

suite('mwc-textarea:', () => {
  let fixt: TestFixture;

  suite('basic', () => {
    let element: TextArea;
    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textarea')!;
    });

    test('initializes as an mwc-textarea', () => {
      assert.instanceOf(element, TextArea);
    });

    test('setting value sets on textarea', async () => {
      element.value = 'my test value';

      const inputElement = element.shadowRoot!.querySelector('textarea');
      assert(inputElement, 'my test value');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });
});
