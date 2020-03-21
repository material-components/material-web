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

import {Snackbar} from '@material/mwc-snackbar';
import {fake, restore, SinonFakeTimers, useFakeTimers} from 'sinon';

import {rafPromise} from '../../../../test/src/util/helpers';

suite('mwc-snackbar', () => {
  let element: Snackbar;
  let clock: SinonFakeTimers;

  setup(() => {
    element = document.createElement('mwc-snackbar');
    document.body.appendChild(element);
    clock = useFakeTimers({toFake: ['setTimeout']});
  });

  teardown(() => {
    restore();
    element.remove();
  });

  test('initializes as an mwc-snackbar', () => {
    assert.instanceOf(element, Snackbar);
  });

  const findLabelText = () => {
    // Note that label text can either be in the label's textContent, or in its
    // ::before pseudo-element content (set via an attribute), for ARIA reasons.
    const label = element.shadowRoot!.querySelector('.mdc-snackbar__label')!;
    return label.getAttribute('data-mdc-snackbar-label-text') ||
        label.textContent;
  };

  test('set label text after opening', async () => {
    element.labelText = 'foo';
    element.open();
    await element.updateComplete;
    assert.equal(findLabelText(), 'foo');

    element.labelText = 'bar';
    await element.updateComplete;
    assert.equal(findLabelText(), 'bar');

    element.labelText = 'baz';
    await element.updateComplete;
    assert.equal(findLabelText(), 'baz');
  });

  test('`open()` opens snack bar', async () => {
    const handler = fake();
    const openingHandler = fake();
    element.addEventListener('MDCSnackbar:opened', handler);
    element.addEventListener('MDCSnackbar:opening', openingHandler);
    assert.equal(element.isOpen, false);
    element.open();
    await element.updateComplete;
    assert.isTrue(openingHandler.called);
    await rafPromise();
    clock.next();
    clock.next();
    assert.isTrue(element.isOpen);
    assert.isTrue(handler.called);
  });

  test('`close()` closes snack bar', async () => {
    const handler = fake();
    element.addEventListener('MDCSnackbar:closed', handler);
    element.isOpen = true;
    await element.updateComplete;
    element.close();
    clock.runAll();
    assert.isFalse(element.isOpen);
    assert.isTrue(handler.called);
  });

  test('closes when dismissed', async () => {
    const handler = fake();
    element.addEventListener('MDCSnackbar:closed', handler);
    const close = document.createElement('span');
    close.slot = 'dismiss';
    element.appendChild(close);
    element.open();
    await element.updateComplete;
    close.click();
    clock.runAll();
    assert.isFalse(element.isOpen);
    assert.equal(handler.lastCall.args[0].detail.reason, 'dismiss');
  });

  test('closes when actioned', async () => {
    const handler = fake();
    element.addEventListener('MDCSnackbar:closed', handler);
    const action = document.createElement('span');
    action.slot = 'action';
    element.appendChild(action);
    element.open();
    await element.updateComplete;
    action.click();
    clock.runAll();
    assert.isFalse(element.isOpen);
    assert.equal(handler.lastCall.args[0].detail.reason, 'action');
  });

  suite('`closedOnEscape`', () => {
    test('does not close when unset and esc is pressed', async () => {
      element.closeOnEscape = false;
      element.timeoutMs = -1;
      element.isOpen = true;
      await element.updateComplete;
      await rafPromise();
      clock.runAll();
      const bar = element.shadowRoot!.querySelector('.mdc-snackbar')!;
      assert.equal(element.isOpen, true);
      bar.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
      clock.runAll();
      await element.updateComplete;
      assert.equal(element.isOpen, true);
    });

    test('closes when set and esc is pressed', async () => {
      element.closeOnEscape = true;
      element.timeoutMs = -1;
      element.isOpen = true;
      await element.updateComplete;
      await rafPromise();
      clock.runAll();
      const bar = element.shadowRoot!.querySelector('.mdc-snackbar')!;
      assert.equal(element.isOpen, true);
      bar.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
      clock.runAll();
      await element.updateComplete;
      assert.equal(element.isOpen, false);
    });
  });
});
