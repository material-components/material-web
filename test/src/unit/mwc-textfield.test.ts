/**
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

import {TextField} from '@material/mwc-textfield';
import {cssClasses} from '@material/textfield/constants';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../util/helpers'
import { FloatingLabel } from '@material/mwc-floating-label';


const basic = html`
  <mwc-textfield></mwc-textfield>
`;

const validationRequired = html`
  <mwc-textfield label="I am required" required></mwc-textfield>
`;

const validationPattern = html`
  <mwc-textfield pattern="[0-9]+" value="dogs"></mwc-textfield>
`;

const reqInitialVal = html`
  <mwc-textfield
      label="I am required"
      required
      validateOnInitialRender>
  </mwc-textfield>
`;

const makeOutlined = (isHidden: boolean) => html`
  <style>
    .hidden {
      display: none;
    }
  </style>
  <mwc-textfield
      outlined
      label="label"
      class="${isHidden ? 'hidden' : ''}"
      value="some value to notch label">
  </mwc-textfield>
`;

const isUiInvalid =
    (element: TextField) => {
      return !!element.shadowRoot!.querySelector(`.${cssClasses.INVALID}`);
    }

suite('mwc-textfield:', () => {
  let fixt: TestFixture;

  suite('basic', () => {
    let element: TextField;
    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textfield')!;
    });

    test('initializes as an mwc-textfield', () => {
      assert.instanceOf(element, TextField);
    });

    test('setting value sets on input', async () => {
      element.value = 'my test value';

      const inputElement = element.shadowRoot!.querySelector('input');
      assert(inputElement, 'my test value');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('validation', () => {
    test('required invalidates on blur', async () => {
      fixt = await fixture(validationRequired);
      const element = fixt.root.querySelector('mwc-textfield')!;

      expect(isUiInvalid(element)).to.be.false;
      element.focus();
      element.blur();
      expect(isUiInvalid(element)).to.be.true;
    });

    test('validity & checkValidity do not trigger ui', async () => {
      fixt = await fixture(validationPattern);
      const element = fixt.root.querySelector('mwc-textfield')!;

      assert.isFalse(isUiInvalid(element));

      let invalidCalled = false;
      element.addEventListener('invalid', () => invalidCalled = true);

      const validity = element.validity;

      assert.isTrue(validity.patternMismatch);
      assert.isFalse(validity.valid);
      assert.isFalse(invalidCalled);
      assert.isFalse(isUiInvalid(element));

      const checkValidity = element.checkValidity();

      assert.isFalse(checkValidity);
      assert.isTrue(invalidCalled);
      assert.isFalse(isUiInvalid(element));
    });

    test('setCustomValidity', async () => {
      fixt = await fixture(basic);
      const element = fixt.root.querySelector('mwc-textfield')!;

      assert.isFalse(isUiInvalid(element));
      assert.isEmpty(element.validationMessage);

      const validationMsgProp = 'set on prop';
      element.validationMessage = validationMsgProp;
      assert.isFalse(isUiInvalid(element));
      assert.equal(element.validationMessage, validationMsgProp);

      const validationMsgFn = 'set by setCustomValidity';
      element.setCustomValidity(validationMsgFn);

      assert.equal(element.validationMessage, validationMsgFn);

      const validity = element.validity;
      assert.isTrue(validity.customError);
      assert.isFalse(validity.valid);
    });

    test('validity transform', async () => {
      fixt = await fixture(validationPattern);
      const element = fixt.root.querySelector('mwc-textfield')!;

      assert.isFalse(element.checkValidity());

      const transformFn =
          (value: string, vState: ValidityState): Partial<ValidityState> => {
            if (value.indexOf('dogs') !== -1) {
              return {
                valid: true,
              }
            } else if (vState.valid) {
              const numberifiedValue = Number(value);
              if (numberifiedValue > 5) {
                return {
                  valid: false, rangeOverflow: true,
                }
              }
            }

            return {};
          };

      element.validityTransform = transformFn;

      let validity = element.validity;
      // true because dogs
      assert.isTrue(validity.valid);
      assert.isTrue(validity.patternMismatch);
      assert.isTrue(element.checkValidity());

      element.value = '6';
      await element.updateComplete;
      validity = element.validity;
      // false because > 5
      assert.isFalse(validity.valid);
      assert.isTrue(validity.rangeOverflow);
      assert.isFalse(element.reportValidity());

      assert.isTrue(isUiInvalid(element));

      element.value = '1';
      await element.updateComplete;
      validity = element.validity;
      // true because < 5
      assert.isTrue(validity.valid);
      assert.isFalse(validity.patternMismatch);
      assert.isFalse(validity.rangeOverflow);
      assert.isTrue(element.reportValidity());

      assert.isFalse(isUiInvalid(element));
    });

    test('initial validation', async () => {
      fixt = await fixture(reqInitialVal);
      let element = fixt.root.querySelector('mwc-textfield')!;
      assert.isTrue(isUiInvalid(element));

      fixt.remove();

      fixt = await fixture(validationRequired);
      element = fixt.root.querySelector('mwc-textfield')!;
      assert.isFalse(isUiInvalid(element));
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });


  suite('select', () => {
    let element: TextField;

    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textfield')!;
    });

    test('selects the input text', () => {
      const input = element.shadowRoot!.querySelector('input')!;

      input.value = 'foobar';

      element.select();

      assert.equal(input.selectionStart, 0);
      assert.equal(input.selectionEnd, 6);
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('setSelectionRange', () => {
    let element: TextField;

    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-textfield')!;
    });

    test('sets correct selection', async () => {
      const input = element.shadowRoot!.querySelector('input')!;

      element.value = 'one two three';
      await element.updateComplete;

      element.setSelectionRange(4, 6);

      assert.equal(input.selectionStart, 4);
      assert.equal(input.selectionEnd, 6);
      assert.equal(element.selectionStart, 4);
      assert.equal(element.selectionEnd, 6);
    });
  });

  suite('notch', () => {
    let fixt: TestFixture;
    test('notch is correct size', async () => {
      fixt = await fixture(makeOutlined(true));
      const element = fixt.root.querySelector('mwc-textfield')!;

      const notchedOutline = element.shadowRoot!.querySelector('mwc-notched-outline')!;
      const floatingLabel = element.shadowRoot!.querySelector('label') as FloatingLabel;

      await element.requestUpdate();

      let outlineWidth = notchedOutline.width;
      assert.isTrue(notchedOutline.open);

      assert.strictEqual(outlineWidth, 0);

      element.classList.remove('hidden');
      await element.requestUpdate();

      outlineWidth = notchedOutline.width;
      let labelWidth = floatingLabel.floatingLabelFoundation.getWidth();
      assert.strictEqual(outlineWidth, 0);
      assert.isTrue(labelWidth > 0);

      await element.layout();
      await element.updateComplete;

      outlineWidth = notchedOutline.width;
      labelWidth = floatingLabel.floatingLabelFoundation.getWidth();
      assert.isTrue(outlineWidth >= labelWidth);

      fixt.remove();
    });

    test('notch changes size with label change', async () => {
      fixt = await fixture(makeOutlined(false));
      const element = fixt.root.querySelector('mwc-textfield')!;

      const notchedOutline = element.shadowRoot!.querySelector('mwc-notched-outline')!;
      const floatingLabel = element.shadowRoot!.querySelector('label') as FloatingLabel;

      await element.requestUpdate();

      let outlineWidth = notchedOutline.width;
      let labelWidth = floatingLabel.floatingLabelFoundation.getWidth();
      assert.isTrue(notchedOutline.open);
      assert.isTrue(outlineWidth >= labelWidth);

      element.label = 'this is some other label';

      // wait for this label to finish updating
      await element.updateComplete;
      // wait for internal event listener to trigger layout method
      await element.requestUpdate();

      outlineWidth = notchedOutline.width;
      labelWidth = floatingLabel.floatingLabelFoundation.getWidth();
      assert.isTrue(outlineWidth >= labelWidth);

      fixt.remove();
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });
});
