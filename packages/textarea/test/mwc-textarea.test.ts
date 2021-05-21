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

describe('mwc-textarea:', () => {
  let fixt: TestFixture;

  describe('basic', () => {
    let element: TextArea;
    beforeEach(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textarea')!;
    });

    it('initializes as an mwc-textarea', () => {
      assert.instanceOf(element, TextArea);
    });

    it('setting value sets on textarea', async () => {
      element.value = 'my test value';

      const inputElement = element.shadowRoot!.querySelector('textarea');
      assert(inputElement, 'my test value');
    });

    afterEach(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });
});
