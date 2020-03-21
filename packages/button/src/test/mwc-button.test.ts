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

    test(
        'setting `trailingIcon` displays `icon` in a trailing position',
        async () => {
          element.icon = 'check';
          element.trailingIcon = true;
          await element.updateComplete;
          const leadingIcon = element.shadowRoot!.querySelector(
              `.leading-icon ${ICON_SELECTOR}`);
          const trailingIcon = element.shadowRoot!.querySelector(
              `.trailing-icon ${ICON_SELECTOR}`);
          assert.equal(leadingIcon, null);
          assert.instanceOf(trailingIcon, Element);
        });

    test('sets `aria-label` of the button when `label` is set', async () => {
      element.label = 'Unit Test Button';
      await element.updateComplete;
      const button = element.shadowRoot!.querySelector('#button');
      assert.equal(button!.getAttribute('aria-label'), 'Unit Test Button');
    });

    test('sets `aria-label` of the button when `icon` is set', async () => {
      element.icon = 'check';
      await element.updateComplete;
      const button = element.shadowRoot!.querySelector('#button');
      assert.equal(button!.getAttribute('aria-label'), 'check');
    });

    test('raised sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const raisedClass = 'mdc-button--raised';
      assert.isFalse(button.classList.contains(raisedClass));
      element.raised = true;
      await element.updateComplete;
      assert.isTrue(button.classList.contains(raisedClass));
    });

    test('unelevated sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const unelevatedClass = 'mdc-button--unelevated';
      assert.isFalse(button.classList.contains(unelevatedClass));
      element.unelevated = true;
      await element.updateComplete;
      assert.isTrue(button.classList.contains(unelevatedClass));
    });

    test('outlined sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const outlinedClass = 'mdc-button--outlined';
      assert.isFalse(button.classList.contains(outlinedClass));
      element.outlined = true;
      await element.updateComplete;
      assert.isTrue(button.classList.contains(outlinedClass));
    });

    test('dense sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const denseClass = 'mdc-button--dense';
      assert.isFalse(button.classList.contains(denseClass));
      element.dense = true;
      await element.updateComplete;
      assert.isTrue(button.classList.contains(denseClass));
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
          element.shadowRoot!.querySelector<HTMLButtonElement>('#button')!;
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
