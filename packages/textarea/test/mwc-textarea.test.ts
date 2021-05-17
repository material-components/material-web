/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
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
