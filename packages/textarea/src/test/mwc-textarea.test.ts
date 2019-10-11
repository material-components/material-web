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

import {fixture, TestFixture} from '../../../../test/src/util/helpers';

interface TextareaInternals {
  createFoundation: () => void;
}

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

  suite('helper and char counter rendering', () => {
    let fixt: TestFixture;

    setup(async () => {
      fixt = await fixture(basic);
    });

    test(
        'createFoundation called an appropriate amount of times & render interactions',
        async () => {
          const element = fixt.root.querySelector('mwc-textarea')!;
          const internals = element as unknown as TextareaInternals;
          element.helperPersistent = true;

          const oldCreateFoundation =
              internals.createFoundation.bind(element) as () => void;
          let numTimesCreateFoundationCalled = 0;

          internals.createFoundation = () => {
            numTimesCreateFoundationCalled = numTimesCreateFoundationCalled + 1;
            oldCreateFoundation();
          };

          const charCounters = element.shadowRoot!.querySelectorAll(
              '.mdc-text-field-character-counter');

          assert.strictEqual(charCounters.length, 1, 'only one char counter');

          const charCounter = charCounters[0] as HTMLElement;
          const helperText = element.shadowRoot!.querySelector(
                                 '.mdc-text-field-helper-text') as HTMLElement;


          assert.strictEqual(
              charCounter.offsetWidth, 0, 'char counter initially hidden');
          assert.strictEqual(
              helperText.offsetWidth, 0, 'helper line initially hidden');

          element.helper = 'my helper';
          await element.requestUpdate();

          assert.strictEqual(
              numTimesCreateFoundationCalled,
              0,
              'foundation not recreated due to helper change');
          assert.strictEqual(
              charCounter.offsetWidth,
              0,
              'char counter hidden when only helper defined');
          assert.isTrue(
              helperText.offsetWidth > 0, 'helper text shown when defined');

          element.helper = '';
          await element.requestUpdate();

          assert.strictEqual(
              numTimesCreateFoundationCalled,
              0,
              'foundation not recreated due to helper change');
          assert.strictEqual(
              charCounter.offsetWidth,
              0,
              'char counter does not render on helper change');
          assert.strictEqual(
              helperText.offsetWidth,
              0,
              'helper line hides when reset to empty');

          element.maxLength = 10;
          await element.requestUpdate();

          assert.strictEqual(
              numTimesCreateFoundationCalled,
              1,
              'foundation created when maxlength changed from -1');
          assert.strictEqual(
              charCounter.offsetWidth,
              0,
              'char counter does not render without charCounter set');
          assert.strictEqual(
              helperText.offsetWidth,
              0,
              'helper line does not render on maxLength change');

          numTimesCreateFoundationCalled = 0;
          element.maxLength = -1;
          await element.requestUpdate();

          assert.strictEqual(
              numTimesCreateFoundationCalled,
              1,
              'foundation created when maxlength changed to -1');

          numTimesCreateFoundationCalled = 0;
          element.charCounter = true;
          await element.requestUpdate();

          assert.strictEqual(
              numTimesCreateFoundationCalled,
              0,
              'foundation not updated when charCounter changed');
          assert.strictEqual(
              charCounter.offsetWidth,
              0,
              'char counter does not render without maxLength set');
          assert.strictEqual(
              helperText.offsetWidth,
              0,
              'helper line does not render on charCounter change');

          element.maxLength = 20;
          await element.requestUpdate();

          assert.strictEqual(
              numTimesCreateFoundationCalled,
              1,
              'foundation created when maxlength changed from -1');
          assert.isTrue(
              charCounter.offsetWidth > 0,
              'char counter renders when both charCounter and maxLength set');

          numTimesCreateFoundationCalled = 0;
          element.maxLength = 15;
          await element.requestUpdate();

          assert.strictEqual(
              numTimesCreateFoundationCalled,
              0,
              'foundation not recreated when maxLength not changed to or from -1');
          assert.isTrue(
              charCounter.offsetWidth > 0,
              'char counter still visible on maxLength change');
        });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });
});
