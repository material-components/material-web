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

import '@material/mwc-formfield';
import '@material/mwc-checkbox';
import '@material/mwc-radio';
import '@material/mwc-switch';


import {Checkbox} from '@material/mwc-checkbox';
import {Formfield} from '@material/mwc-formfield';
import {Radio} from '@material/mwc-radio';
import {Switch} from '@material/mwc-switch';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

const defaultEl = html`<mwc-formfield></mwc-formfield>`;

const defaultFormfieldProps = {
  alignEnd: false,
  spaceBetween: false,
  label: '',
  content: html``,
};

type FormfieldProps = typeof defaultFormfieldProps;

const formfield = (propsInit: Partial<FormfieldProps>) => {
  const props: FormfieldProps = {...defaultFormfieldProps, ...propsInit};

  return html`
    <mwc-formfield
        .alignEnd=${props.alignEnd}
        .spaceBetween=${props.spaceBetween}
        .label=${props.label}>
      ${props.content}
    </mwc-formfield>
  `;
};

suite('mwc-formfield', () => {
  let fixt: TestFixture;
  let element: Formfield;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultEl);
      element = fixt.root.querySelector('mwc-formfield')!;
    });

    test('initializes as an mwc-formfield', () => {
      assert.instanceOf(element, Formfield);
      assert.isFalse(element.alignEnd);
      assert.isFalse(element.spaceBetween);
      assert.equal(element.label, '');
    });
  });

  suite('with checkbox', () => {
    let control: Checkbox;

    suite('prop label', () => {
      setup(async () => {
        fixt = await fixture(formfield(
            {label: 'label', content: html`<mwc-checkbox></mwc-checkbox>`}));
        element = fixt.root.querySelector('mwc-formfield')!;
        await element.updateComplete;
        control = fixt.root.querySelector('mwc-checkbox')!;
        await control.updateComplete;
      });

      test('sets the aria-label on the control', async () => {
        const internalInput = control.shadowRoot!.querySelector('input')!;
        assert.equal(internalInput.getAttribute('aria-label'), 'label');
      });

      test('label click propagates click and focus to control', async () => {
        const labelEl = element.shadowRoot!.querySelector('label')!;
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        assert.isFalse(control.checked);
        assert.equal(fixt.shadowRoot!.activeElement, null);
        assert.equal(numClicks, 0);

        labelEl.click();

        await element.updateComplete;
        await control.updateComplete;

        assert.isTrue(control.checked);
        assert.equal(fixt.shadowRoot!.activeElement, control);
        assert.equal(numClicks, 1);
      });

      test('formfield will not double click control', async () => {
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        assert.isFalse(control.checked);
        assert.equal(numClicks, 0);

        control.click();

        await element.updateComplete;
        await control.updateComplete;

        assert.equal(numClicks, 1);
        assert.isTrue(control.checked);
      });
    });
  });

  suite('with switch', () => {
    let control: Switch;

    suite('prop label', () => {
      setup(async () => {
        fixt = await fixture(formfield(
            {label: 'label', content: html`<mwc-switch></mwc-switch>`}));
        element = fixt.root.querySelector('mwc-formfield')!;
        await element.updateComplete;
        control = fixt.root.querySelector('mwc-switch')!;
        await control.updateComplete;
      });

      test('sets the aria-label on the control', async () => {
        const internalInput = control.shadowRoot!.querySelector('input')!;
        assert.equal(internalInput.getAttribute('aria-label'), 'label');
      });

      test('label click propagates click and focus to control', async () => {
        const labelEl = element.shadowRoot!.querySelector('label')!;
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        assert.isFalse(control.checked);
        assert.equal(fixt.shadowRoot!.activeElement, null);
        assert.equal(numClicks, 0);

        labelEl.click();

        await element.updateComplete;
        await control.updateComplete;

        assert.isTrue(control.checked);
        assert.equal(fixt.shadowRoot!.activeElement, control);
        assert.equal(numClicks, 1);
      });

      test('formfield will not double click control', async () => {
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        assert.isFalse(control.checked);
        assert.equal(numClicks, 0);

        control.click();

        await element.updateComplete;
        await control.updateComplete;

        assert.equal(numClicks, 1);
        assert.isTrue(control.checked);
      });
    });
  });

  suite('with radio', () => {
    let control: Radio;

    suite('prop label', () => {
      setup(async () => {
        fixt = await fixture(formfield(
            {label: 'label', content: html`<mwc-radio></mwc-radio>`}));
        element = fixt.root.querySelector('mwc-formfield')!;
        await element.updateComplete;
        control = fixt.root.querySelector('mwc-radio')!;
        await control.updateComplete;
      });

      test('sets the aria-label on the control', async () => {
        const internalInput = control.shadowRoot!.querySelector('input')!;
        assert.equal(internalInput.getAttribute('aria-label'), 'label');
      });

      test('label click propagates click and focus to control', async () => {
        const labelEl = element.shadowRoot!.querySelector('label')!;
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        assert.isFalse(control.checked);
        assert.equal(fixt.shadowRoot!.activeElement, null);
        assert.equal(numClicks, 0);

        labelEl.click();

        await element.updateComplete;
        await control.updateComplete;

        assert.isTrue(control.checked);
        assert.equal(fixt.shadowRoot!.activeElement, control);
        assert.equal(numClicks, 1);
      });

      test('formfield will not double click control', async () => {
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        assert.isFalse(control.checked);
        assert.equal(numClicks, 0);

        control.click();

        await element.updateComplete;
        await control.updateComplete;

        assert.equal(numClicks, 1);
        assert.isTrue(control.checked);
      });
    });
  });
});
