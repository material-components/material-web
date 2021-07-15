/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {TextArea} from '@material/mwc-textarea';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

const basic = html`
  <mwc-textarea></mwc-textarea>
`;

const withLabel = html`
  <mwc-textarea label="a label"></mwc-textarea>
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
      expect(element).toBeInstanceOf(TextArea);
    });

    it('setting value sets on textarea', async () => {
      element.value = 'my test value';
      await element.updateComplete;

      const inputElement = element.shadowRoot!.querySelector('textarea');
      expect(inputElement!.value).toEqual('my test value');
    });

    it('textarea does not have aria-labelledby set', async () => {
      await element.updateComplete;
      const textarea = element.shadowRoot!.querySelector('textarea')!;
      expect(textarea.getAttribute('aria-labelledby')).toBeNull();
    });

    afterEach(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  describe('label', () => {
    let element: TextArea;
    beforeEach(async () => {
      fixt = await fixture(withLabel);

      element = fixt.root.querySelector('mwc-textarea')!;
    });

    it('textarea has aria-labelledby set', async () => {
      await element.updateComplete;
      const textarea = element.shadowRoot!.querySelector('textarea')!;
      expect(textarea.getAttribute('aria-labelledby')).toBe('label');
    });

    afterEach(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });
});
