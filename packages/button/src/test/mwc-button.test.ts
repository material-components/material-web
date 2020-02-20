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

import {Button} from '@material/mwc-button';
import {html} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../../../../test/src/util/helpers';

const ICON_SELECTOR = '.mdc-button__icon';

const noText = html`<mwc-button></mwc-button>`;

const basic = html`
  <mwc-button>this is a button</mwc-button>
`;

suite('mwc-button', () => {
  let fixt: TestFixture;
  let element: Button;

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(noText);
      element = fixt.root.querySelector('mwc-button') as Button;
    });

    teardown(() => {
      document.body.removeChild(fixt);
    });

    test('initializes as an mwc-button', () => {
      assert.instanceOf(element, Button);
    });

    test(
        'get/set disabled updates the disabled property on the native button element',
        async () => {
          element.disabled = true;
          await element.updateComplete;
          const button = element.shadowRoot!.querySelector('button')!;
          assert.equal(button.hasAttribute('disabled'), true);

          element.disabled = false;
          await element.updateComplete;
          assert.equal(button.hasAttribute('disabled'), false);
        });

    test('setting `icon` adds an icon to the button', async () => {
      if (window.navigator.userAgent.indexOf('Edge') !== -1) {
        // skip test on edge due to polyfill insertion into slot element issue
        return;
      }
      await element.updateComplete;
      let icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.equal(icon, null);

      element.icon = 'check';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.instanceOf(icon, Element);

      element.icon = '';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.equal(icon, null);
    });

    test('sets `aria-label` of the button when `label` is set', async () => {
      element.label = 'Unit Test Button';
      await element.updateComplete;
      const button = element.shadowRoot!.querySelector('#button');
      assert.equal(button!.getAttribute('aria-label'), 'Unit Test Button');
    });
  });

  suite('focus', () => {
    let fixt: TestFixture;
    let element: Button;
    setup(async () => {
      fixt = await fixture(basic);
      element = fixt.root.firstElementChild as Button;
    });

    test('focus fn highlights and blurs', async () => {
      const focusedClass = 'mdc-ripple-upgraded--background-focused';
      const nativeButton =
          element.shadowRoot!.querySelector('#button') as HTMLButtonElement;
      assert.isFalse(nativeButton.classList.contains(focusedClass));
      element.focus();
      await element.requestUpdate();
      await rafPromise();
      assert.isTrue(nativeButton.classList.contains(focusedClass));
      element.blur();
      await element.requestUpdate();
      await rafPromise();
      assert.isFalse(nativeButton.classList.contains(focusedClass));
    });

    teardown(async () => {
      fixt.remove();
    });
  });
});
