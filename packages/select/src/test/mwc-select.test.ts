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
// taze: chai from //third_party/javascript/chai:closure_chai

import '@material/mwc-list/mwc-list-item';

import {ListItem} from '@material/mwc-list/mwc-list-item';
import {Select} from '@material/mwc-select';
import {html} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../../../../test/src/util/helpers';

interface WithSelectedText {
  selectedText: string;
}

const basic = (outlined = false) => html`
  <mwc-select ?outlined=${outlined}>
    <mwc-list-item selected></mwc-list-item>
    <mwc-list-item value="a">Apple</mwc-list-item>
    <mwc-list-item value="b">Banana</mwc-list-item>
    <mwc-list-item value="c">Cucumber</mwc-list-item>
  </mwc-select>
`;

const validationRequired = (outlined = false) => html`
  <mwc-select
      ?outlined=${outlined}
      label="I am required"
      required>
    <mwc-list-item selected></mwc-list-item>
    <mwc-list-item value="a">Apple</mwc-list-item>
    <mwc-list-item value="b">Banana</mwc-list-item>
    <mwc-list-item value="c">Cucumber</mwc-list-item>
  </mwc-select>
`;

const reqInitialVal = (outlined = false) => html`
  <mwc-select
      ?outlined=${outlined}
      label="I am required"
      required
      validateOnInitialRender>
    <mwc-list-item selected></mwc-list-item>
    <mwc-list-item value="a">Apple</mwc-list-item>
    <mwc-list-item value="b">Banana</mwc-list-item>
    <mwc-list-item value="c">Cucumber</mwc-list-item>
  </mwc-select>
`;

const itemsTemplate = html`
  <mwc-list-item></mwc-list-item>
  <mwc-list-item value="a">Apple</mwc-list-item>
  <mwc-list-item value="b">Banana</mwc-list-item>
  <mwc-list-item value="c" selected>Cucumber</mwc-list-item>`;

const lazy = (template = html``) => html`
  <mwc-select>
    ${template}
  </mwc-select>
`;

const isUiInvalid = (element: Select) => {
  return !!element.shadowRoot!.querySelector('.mdc-select--invalid');
};

suite('mwc-select:', () => {
  let fixt: TestFixture;

  suite('basic', () => {
    let element: Select;
    setup(async () => {
      fixt = await fixture(basic());

      element = fixt.root.querySelector('mwc-select')!;
    });

    test('initializes as an mwc-select', () => {
      assert.instanceOf(element, Select);
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
    suite('standard', () => {
      test('required invalidates on blur', async () => {
        fixt = await fixture(validationRequired());
        const element = fixt.root.querySelector('mwc-select')!;

        assert.isFalse(isUiInvalid(element), 'ui initially valid');
        element.focus();
        await element.updateComplete;
        assert.isFalse(isUiInvalid(element), 'no validation on focus');
        element.blur();
        await element.updateComplete;
        assert.isTrue(isUiInvalid(element), 'invalid after blur');
      });

      test('validity & checkValidity do not trigger ui', async () => {
        fixt = await fixture(validationRequired());
        const element = fixt.root.querySelector('mwc-select')!;
        assert.isFalse(isUiInvalid(element), 'ui initially valid');

        let invalidCalled = false;
        element.addEventListener('invalid', () => invalidCalled = true);

        const validity = element.validity;

        assert.isTrue(validity.valueMissing, 'validation fails - required');
        assert.isFalse(validity.valid, 'element is invalid');
        assert.isFalse(
            invalidCalled, 'invalid event not fired because of .validity');
        assert.isFalse(
            isUiInvalid(element), 'ui is not invalid because of .validity');

        const checkValidity = element.checkValidity();

        assert.isFalse(
            checkValidity, 'check validity returns false when invalid');
        assert.isTrue(invalidCalled, 'invalid event called');
        assert.isFalse(isUiInvalid(element), 'ui is invalid');
      });

      test('setCustomValidity', async () => {
        fixt = await fixture(basic());
        const element = fixt.root.querySelector('mwc-select')!;

        // deflake shady dom (IE)
        await rafPromise();
        await element.layout();

        assert.isFalse(isUiInvalid(element), 'ui initially valid');
        assert.equal(element.validationMessage, '');

        const validationMsgProp = 'set on prop';
        element.validationMessage = validationMsgProp;
        assert.isFalse(
            isUiInvalid(element),
            'ui not false due to setting validationMessage');
        assert.equal(
            element.validationMessage,
            validationMsgProp,
            'setting validationMessage works');

        const validationMsgFn = 'set by setCustomValidity';
        element.setCustomValidity(validationMsgFn);

        assert.equal(
            element.validationMessage,
            validationMsgFn,
            'validationMessage prop is set with setCustomValidity');

        const validity = element.validity;
        assert.isTrue(
            validity.customError, 'customError is reason for valitity failure');
        assert.isFalse(validity.valid, 'element is not valid');
      });

      test('validity transform', async () => {
        fixt = await fixture(basic());
        const element = fixt.root.querySelector('mwc-select')! as Select;

        assert.isTrue(element.checkValidity(), 'element is initially valid');

        const transformFn =
            (value: string, vState: ValidityState): Partial<ValidityState> => {
              if (value === 'a') {
                return {
                  valid: true,
                };
              } else if (vState.valid) {
                const isOutOfRange = value === 'c';
                if (isOutOfRange) {
                  return {
                    valid: false,
                    rangeOverflow: true,
                  };
                }
              }

              return {};
            };

        element.validityTransform = transformFn;

        let validity = element.validity;
        assert.isTrue(validity.valid, 'unhandled case is valid');
        assert.isTrue(
            element.checkValidity(),
            'checkValidity is true for unhandled case');

        element.select(1);
        await element.updateComplete;
        validity = element.validity;
        assert.isTrue(validity.valid, 'explicitly handled value is true');
        assert.isTrue(
            element.reportValidity(),
            'checkValidity is true for explicit case');

        assert.isFalse(
            isUiInvalid(element), 'reportValidity makes ui valid when valid');

        element.select(3);
        await element.updateComplete;
        validity = element.validity;

        assert.isFalse(validity.valid, 'explicitly false case returns false');
        assert.isTrue(
            validity.rangeOverflow, 'explicit reason for invalid set');
        assert.isFalse(
            element.reportValidity(),
            'checkValidity is true for explicitly invalid case');

        assert.isTrue(
            isUiInvalid(element),
            'reportValidity makes ui invalid when invalid');

        element.select(2);
        await element.updateComplete;
        validity = element.validity;

        assert.isTrue(validity.valid, 'validity can be set back to true');
        assert.isFalse(
            validity.rangeOverflow, 'explicit reason for invalid unset');
        assert.isTrue(
            element.reportValidity(),
            'checkValidity is set back true for valid case');

        assert.isFalse(isUiInvalid(element), 'ui can be made valid again');
      });

      test('initial validation', async () => {
        fixt = await fixture(reqInitialVal());
        let element = fixt.root.querySelector('mwc-select')!;
        await element.updateComplete;
        assert.isTrue(isUiInvalid(element), 'initial render is invalid');

        fixt.remove();

        fixt = await fixture(validationRequired());
        element = fixt.root.querySelector('mwc-select')!;
        await element.updateComplete;
        assert.isFalse(isUiInvalid(element), 'without flag is valid');
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    suite('outlined', () => {
      test('required invalidates on blur', async () => {
        fixt = await fixture(validationRequired(true));
        const element = fixt.root.querySelector('mwc-select')!;

        assert.isFalse(isUiInvalid(element), 'ui initially valid');
        element.focus();
        await element.updateComplete;
        assert.isFalse(isUiInvalid(element), 'no validation on focus');
        element.blur();
        await element.updateComplete;
        assert.isTrue(isUiInvalid(element), 'invalid after blur');
      });

      test('validity & checkValidity do not trigger ui', async () => {
        fixt = await fixture(validationRequired(true));
        const element = fixt.root.querySelector('mwc-select')!;
        assert.isFalse(isUiInvalid(element), 'ui initially valid');

        let invalidCalled = false;
        element.addEventListener('invalid', () => invalidCalled = true);

        const validity = element.validity;

        assert.isTrue(validity.valueMissing, 'validation fails - required');
        assert.isFalse(validity.valid, 'element is invalid');
        assert.isFalse(
            invalidCalled, 'invalid event not fired because of .validity');
        assert.isFalse(
            isUiInvalid(element), 'ui is not invalid because of .validity');

        const checkValidity = element.checkValidity();

        assert.isFalse(
            checkValidity, 'check validity returns false when invalid');
        assert.isTrue(invalidCalled, 'invalid event called');
        assert.isFalse(isUiInvalid(element), 'ui is invalid');
      });

      test('setCustomValidity', async () => {
        fixt = await fixture(basic(true));
        const element = fixt.root.querySelector('mwc-select')!;
        await element.updateComplete;

        assert.isFalse(isUiInvalid(element));
        assert.equal(element.validationMessage, '');

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
        fixt = await fixture(basic(true));
        const element = fixt.root.querySelector('mwc-select')! as Select;

        // deflake shady dom (IE)
        await rafPromise();
        await element.layout();

        assert.isTrue(element.checkValidity(), 'element is initially valid');

        const transformFn =
            (value: string, vState: ValidityState): Partial<ValidityState> => {
              if (value === 'a') {
                return {
                  valid: true,
                };
              } else if (vState.valid) {
                const isOutOfRange = value === 'c';
                if (isOutOfRange) {
                  return {
                    valid: false,
                    rangeOverflow: true,
                  };
                }
              }

              return {};
            };

        element.validityTransform = transformFn;

        let validity = element.validity;
        assert.isTrue(validity.valid, 'unhandled case is valid');
        assert.isTrue(
            element.checkValidity(),
            'checkValidity is true for unhandled case');

        element.select(1);
        await element.updateComplete;
        validity = element.validity;
        assert.isTrue(validity.valid, 'explicitly handled value is true');
        assert.isTrue(
            element.reportValidity(),
            'checkValidity is true for explicit case');

        assert.isFalse(
            isUiInvalid(element), 'reportValidity makes ui valid when valid');

        element.select(3);
        await element.updateComplete;
        validity = element.validity;

        assert.isFalse(validity.valid, 'explicitly false case returns false');
        assert.isTrue(
            validity.rangeOverflow, 'explicit reason for invalid set');
        assert.isFalse(
            element.reportValidity(),
            'checkValidity is true for explicitly invalid case');

        assert.isTrue(
            isUiInvalid(element),
            'reportValidity makes ui invalid when invalid');

        element.select(2);
        await element.updateComplete;
        validity = element.validity;

        assert.isTrue(validity.valid, 'validity can be set back to true');
        assert.isFalse(
            validity.rangeOverflow, 'explicit reason for invalid unset');
        assert.isTrue(
            element.reportValidity(),
            'checkValidity is set back true for valid case');

        assert.isFalse(isUiInvalid(element), 'ui can be made valid again');
      });

      test('initial validation', async () => {
        fixt = await fixture(reqInitialVal(true));
        let element = fixt.root.querySelector('mwc-select')!;
        await element.updateComplete;

        // deflake shady dom (IE)
        await rafPromise();
        await element.layout();

        assert.isTrue(isUiInvalid(element), 'initial render is invalid');

        fixt.remove();

        fixt = await fixture(validationRequired(true));
        element = fixt.root.querySelector('mwc-select')!;
        await element.updateComplete;
        assert.isFalse(isUiInvalid(element), 'without flag is valid');
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });
  });


  suite('selection', () => {
    let element: Select;
    let changeCalls = 0;
    const changeListener = () => {
      changeCalls++;
    };

    setup(async () => {
      fixt = await fixture(basic());

      element = fixt.root.querySelector('mwc-select')!;
      element.addEventListener('change', changeListener);

      await element.updateComplete;
    });

    test('selection via index', async () => {
      // deflake shady dom (IE)
      await rafPromise();
      await element.layout();

      assert.equal(changeCalls, 0, 'change evt not called on startup');
      assert.equal(element.value, '', 'initial value is blank');
      assert.equal(
          (element as unknown as WithSelectedText).selectedText,
          '',
          'selectedText is blank');
      assert.isTrue(!!element.selected, 'there is a selected element');

      const firstElement = element.querySelector('mwc-list-item')!;
      assert.isTrue(firstElement.selected, 'the element has selected prop');

      element.select(1);
      await element.updateComplete;
      assert.equal(changeCalls, 1, 'change event called once on selection');
      changeCalls = 0;

      assert.equal(element.value, 'a', 'select method updates value');
      assert.isTrue(
          (element as unknown as WithSelectedText).selectedText === 'Apple',
          'selectedText is updated');
      assert.isTrue(
          !!element.selected, 'there is a selected element after select');

      const aElement = element.querySelector('[value="a"]') as ListItem;
      assert.isFalse(firstElement.selected, 'the previous has be deselected');
      assert.isTrue(aElement.selected, 'the element has selected prop');
      assert.isTrue(
          aElement === element.selected,
          'element with selected prop is the same as selected on mwc-select');
    });

    test('selection via element', async () => {
      assert.equal(changeCalls, 0, 'change evt not called on startup');
      assert.equal(element.value, '', 'initial value is blank');
      assert.isTrue(
          (element as unknown as WithSelectedText).selectedText === '',
          'selectedText is blank');
      assert.isTrue(!!element.selected, 'there is a selected element');

      const firstElement = element.querySelector('mwc-list-item')!;
      assert.isTrue(firstElement.selected, 'the element has selected prop');

      const aElement = element.querySelector('[value="a"]') as ListItem;
      aElement.selected = true;
      await aElement.updateComplete;
      await element.updateComplete;
      assert.equal(changeCalls, 1, 'change event called once on selection');
      changeCalls = 0;

      assert.equal(element.value, 'a', 'select method updates value');
      assert.isTrue(
          (element as unknown as WithSelectedText).selectedText === 'Apple',
          'selectedText is updated');
      assert.isTrue(
          !!element.selected, 'there is a selected element after select');

      assert.isFalse(firstElement.selected, 'the previous has be deselected');
      assert.isTrue(aElement.selected, 'the element has selected prop');
      assert.isTrue(
          aElement === element.selected,
          'element with selected prop is the same as selected on mwc-select');
    });

    test('lazy selection', async () => {
      fixt.remove();
      fixt = await fixture(lazy());
      element = fixt.root.querySelector('mwc-select')!;

      // deflake shady dom (IE)
      await rafPromise();
      await element.layout();

      assert.equal(element.index, -1, 'unselected index when no children');

      fixt.template = lazy(itemsTemplate);
      await fixt.updateComplete;
      await element.updateComplete;

      assert.equal(element.index, 3, 'index updates when lazily slotted');
      assert.equal(element.value, 'c', 'value updates when lazily slotted');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }

      element.removeEventListener('change', changeListener);
      changeCalls = 0;
    });
  });
});
