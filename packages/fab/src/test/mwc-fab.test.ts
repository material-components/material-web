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

import {Fab} from '@material/mwc-fab';

const ICON_SELECTOR = '.mdc-fab__icon';
const LABEL_SELECTOR = '.mdc-fab__label';

suite('mwc-fab', () => {
  let element: Fab;
  setup(() => {
    element = document.createElement('mwc-fab');
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-fab', () => {
    assert.instanceOf(element, Fab);
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

  test('setting `icon` adds an icon to the fab', async () => {
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

  test('setting `icon` sets `aria-label` of the button', async () => {
    element.icon = 'check';
    await element.updateComplete;
    const button = element.shadowRoot!.querySelector('button')!;
    assert.equal(button.getAttribute('aria-label'), 'check');
  });

  test(
      'setting `label` sets `aria-label` of the button, overriding `icon`',
      async () => {
        element.icon = 'check';
        await element.updateComplete;
        let button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.getAttribute('aria-label'), 'check');

        element.label = 'label text';
        await element.updateComplete;
        button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.getAttribute('aria-label'), 'label text');

        element.label = '';
        await element.updateComplete;
        button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.getAttribute('aria-label'), 'check');
      });

  test('setting `mini` sets the correct inner class', async () => {
    await element.updateComplete;
    const miniClass = 'mdc-fab--mini';
    const button = element.shadowRoot!.querySelector('.mdc-fab')!;
    assert.isFalse(button.classList.contains(miniClass));
    element.mini = true;
    await element.updateComplete;
    assert.isTrue(button.classList.contains(miniClass));
  });

  test('setting `exited` sets the correct inner class', async () => {
    await element.updateComplete;
    const exitedClass = 'mdc-fab--exited';
    const button = element.shadowRoot!.querySelector('.mdc-fab')!;
    assert.isFalse(button.classList.contains(exitedClass));
    element.exited = true;
    await element.updateComplete;
    assert.isTrue(button.classList.contains(exitedClass));
  });

  test('setting `extended` sets the correct inner class', async () => {
    await element.updateComplete;
    const extendedClass = 'mdc-fab--extended';
    const button = element.shadowRoot!.querySelector('.mdc-fab')!;
    assert.isFalse(button.classList.contains(extendedClass));
    element.extended = true;
    await element.updateComplete;
    assert.isTrue(button.classList.contains(extendedClass));
  });

  test('displays label only if extended', async () => {
    await element.updateComplete;
    let label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
    assert.equal(label, null);
    element.label = 'foo';
    await element.updateComplete;
    label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
    assert.equal(label, null);
    element.extended = true;
    await element.updateComplete;
    label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
    assert.instanceOf(label, Element);
    assert.equal(label!.textContent, 'foo');
  });

  test('`showIconAtEnd` displays icon after label', async () => {
    element.icon = 'check';
    element.label = 'foo';
    element.extended = true;
    element.showIconAtEnd = false;
    await element.updateComplete;

    const root = element.shadowRoot!.querySelector('.mdc-fab')!;
    const LABEL_CLASS = 'mdc-fab__label';
    const ICON_CLASS = 'mdc-fab__icon';

    const children = root.children;

    assert.equal(children.length, 2);
    assert.isTrue(children[0].querySelector(ICON_SELECTOR)!.classList.contains(
        ICON_CLASS));
    assert.isTrue(children[1].classList.contains(LABEL_CLASS));

    element.showIconAtEnd = true;
    await element.updateComplete;

    assert.isTrue(children[1].querySelector(ICON_SELECTOR)!.classList.contains(
        ICON_CLASS));
    assert.isTrue(children[0].classList.contains(LABEL_CLASS));
  });
});
