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
import {html, TemplateResult} from 'lit-html';
import {fake, restore, SinonFakeTimers, useFakeTimers} from 'sinon';

import {fixture, rafPromise, TestFixture} from '../../../../test/src/util/helpers';

interface SnackBarProps {
  timeoutMs: number;
  closeOnEscape: boolean;
  labelText: string;
  actionElement: TemplateResult;
  dismissElement: TemplateResult;
}

const snackBar = (propsInit?: Partial<SnackBarProps>) => {
  if (!propsInit) {
    return html`<mwc-snackbar></mwc-snackbar>`;
  }
  return html`
    <mwc-snackbar
      .timeoutMs=${propsInit.timeoutMs ?? -1}
      ?closeOnEscape=${propsInit.closeOnEscape === true}
      .labelText=${propsInit.labelText ?? ''}>
      ${propsInit.actionElement ?? html``}
      ${propsInit.dismissElement ?? html``}
    </mwc-snackbar>
  `;
};

const findLabelText = (element: Element) => {
  // Note that label text can either be in the label's textContent, or in its
  // ::before pseudo-element content (set via an attribute), for ARIA reasons.
  const label = element.shadowRoot!.querySelector('.mdc-snackbar__label')!;
  return label.getAttribute('data-mdc-snackbar-label-text') ||
      label.textContent;
};

suite('mwc-snackbar', () => {
  let fixt: TestFixture;
  let element: Snackbar;
  let clock: SinonFakeTimers;

  setup(() => {
    clock = useFakeTimers({toFake: ['setTimeout']});
  });

  teardown(() => {
    restore();
    element.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(snackBar());
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    test('initializes as an mwc-snackbar', () => {
      assert.instanceOf(element, Snackbar);
      assert.isFalse(element.isOpen);
      assert.equal(element.timeoutMs, 5000);
      assert.isFalse(element.closeOnEscape);
      assert.equal(element.labelText, '');
      assert.isFalse(element.stacked);
      assert.isFalse(element.leading);
    });
  });

  suite('open/close', () => {
    setup(async () => {
      fixt = await fixture(snackBar({timeoutMs: -1}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
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
      clock.runAll();
      assert.isTrue(element.isOpen);
      assert.isTrue(handler.called);
    });

    test('`close()` closes snack bar', async () => {
      const handler = fake();
      element.addEventListener('MDCSnackbar:closed', handler);
      element.open();
      await element.updateComplete;
      await rafPromise();
      clock.runAll();
      element.close();
      clock.runAll();
      assert.isFalse(element.isOpen);
      assert.isTrue(handler.called);
    });
  });

  suite('labelText', () => {
    setup(async () => {
      fixt = await fixture(snackBar({labelText: 'foo'}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    test('set label text after opening', async () => {
      element.open();
      await element.updateComplete;
      assert.equal(findLabelText(element), 'foo');

      element.labelText = 'bar';
      await element.updateComplete;
      assert.equal(findLabelText(element), 'bar');

      element.labelText = 'baz';
      await element.updateComplete;
      assert.equal(findLabelText(element), 'baz');
    });
  });

  suite('dismiss', () => {
    setup(async () => {
      fixt = await fixture(
          snackBar({dismissElement: html`<span slot="dismiss">test</span>`}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    test('closes when dismissed', async () => {
      const close = element.querySelector<HTMLElement>('[slot="dismiss"]')!;
      const handler = fake();
      element.addEventListener('MDCSnackbar:closed', handler);
      element.open();
      await element.updateComplete;
      close.click();
      clock.runAll();
      assert.isFalse(element.isOpen);
      assert.equal(handler.lastCall.args[0].detail.reason, 'dismiss');
    });
  });

  suite('action', () => {
    setup(async () => {
      fixt = await fixture(
          snackBar({actionElement: html`<span slot="action">test</span>`}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    test('closes when actioned', async () => {
      const action = element.querySelector<HTMLElement>('[slot="action"]')!;
      const handler = fake();
      element.addEventListener('MDCSnackbar:closed', handler);
      element.open();
      await element.updateComplete;
      action.click();
      clock.runAll();
      assert.isFalse(element.isOpen);
      assert.equal(handler.lastCall.args[0].detail.reason, 'action');
    });
  });

  suite('`closeOnEscape`', () => {
    setup(async () => {
      fixt = await fixture(snackBar({closeOnEscape: true}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    test('does not close when unset and esc is pressed', async () => {
      element.closeOnEscape = false;
      element.open();
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
      element.open();
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
