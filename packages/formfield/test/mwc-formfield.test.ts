/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import '@material/mwc-formfield/mwc-formfield.js';
import '@material/mwc-checkbox/mwc-checkbox.js';
import '@material/mwc-radio/mwc-radio.js';
import '@material/mwc-switch/mwc-switch.js';

import {Checkbox} from '@material/mwc-checkbox/mwc-checkbox.js';
import {Formfield} from '@material/mwc-formfield/mwc-formfield.js';
import {Radio} from '@material/mwc-radio/mwc-radio.js';
import {Switch} from '@material/mwc-switch/mwc-switch.js';
import {html} from 'lit';

import {fixture, TestFixture} from '../../../test/src/util/helpers.js';

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

describe('mwc-formfield', () => {
  let fixt: TestFixture;
  let element: Formfield;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultEl);
      element = fixt.root.querySelector('mwc-formfield')!;
    });

    it('initializes as an mwc-formfield', () => {
      expect(element).toBeInstanceOf(Formfield);
      expect(element.alignEnd).toBeFalse();
      expect(element.spaceBetween).toBeFalse();
      expect(element.label).toEqual('');
    });
  });

  describe('with checkbox', () => {
    let control: Checkbox;

    describe('prop label', () => {
      beforeEach(async () => {
        fixt = await fixture(formfield(
            {label: 'label', content: html`<mwc-checkbox></mwc-checkbox>`}));
        element = fixt.root.querySelector('mwc-formfield')!;
        await element.updateComplete;
        control = fixt.root.querySelector('mwc-checkbox')!;
        await control.updateComplete;
      });

      it('sets the aria-label on the control', async () => {
        const internalInput = control.shadowRoot!.querySelector('input')!;
        expect(internalInput.getAttribute('aria-label')).toEqual('label');
      });

      it('label click propagates click and focus to control', async () => {
        const labelEl = element.shadowRoot!.querySelector('label')!;
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        expect(control.checked).toBeFalse();
        expect(fixt.shadowRoot!.activeElement).toEqual(null);
        expect(numClicks).toEqual(0);

        labelEl.click();

        await element.updateComplete;
        await control.updateComplete;

        expect(control.checked).toBeTrue();
        expect(fixt.shadowRoot!.activeElement).toEqual(control);
        expect(numClicks).toEqual(1);
      });

      it('formfield click propagates click and focus to control', async () => {
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        expect(control.checked).toBeFalse();
        expect(fixt.shadowRoot!.activeElement).toEqual(null);
        expect(numClicks).toEqual(0);
        element.click();
        await element.updateComplete;
        await control.updateComplete;

        expect(control.checked).toBeTrue();
        expect(fixt.shadowRoot!.activeElement).toEqual(control);
        expect(numClicks).toEqual(1);
      });

      it('formfield will not double click control', async () => {
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        expect(control.checked).toBeFalse();
        expect(numClicks).toEqual(0);

        control.click();

        await element.updateComplete;
        await control.updateComplete;

        expect(numClicks).toEqual(1);
        expect(control.checked).toBeTrue();
      });
    });
  });

  describe('with switch', () => {
    let control: Switch;

    describe('prop label', () => {
      beforeEach(async () => {
        fixt = await fixture(formfield(
            {label: 'label', content: html`<mwc-switch></mwc-switch>`}));
        element = fixt.root.querySelector('mwc-formfield')!;
        await element.updateComplete;
        control = fixt.root.querySelector('mwc-switch')!;
        await control.updateComplete;
      });

      it('sets the aria-label on the control', async () => {
        expect(control.ariaLabel).toEqual('label');
      });

      it('label click propagates click and focus to control', async () => {
        const labelEl = element.shadowRoot!.querySelector('label')!;
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        expect(control.selected).toBeFalse();
        expect(fixt.shadowRoot!.activeElement).toEqual(null);
        expect(numClicks).toEqual(0);

        labelEl.click();

        await element.updateComplete;
        await control.updateComplete;

        expect(control.selected).toBeTrue();
        expect(fixt.shadowRoot!.activeElement).toEqual(control);
        expect(numClicks).toEqual(1);
      });

      it('formfield will not double click control', async () => {
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        expect(control.selected).toBeFalse();
        expect(numClicks).toEqual(0);

        control.click();

        await element.updateComplete;
        await control.updateComplete;

        expect(numClicks).toEqual(1);
        expect(control.selected).toBeTrue();
      });
    });
  });

  describe('with radio', () => {
    let control: Radio;

    describe('prop label', () => {
      beforeEach(async () => {
        fixt = await fixture(formfield(
            {label: 'label', content: html`<mwc-radio></mwc-radio>`}));
        element = fixt.root.querySelector('mwc-formfield')!;
        await element.updateComplete;
        control = fixt.root.querySelector('mwc-radio')!;
        await control.updateComplete;
      });

      it('sets the aria-label on the control', async () => {
        const internalInput = control.shadowRoot!.querySelector('input')!;
        expect(internalInput.getAttribute('aria-label')).toEqual('label');
      });

      it('label click propagates click and focus to control', async () => {
        const labelEl = element.shadowRoot!.querySelector('label')!;
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        expect(control.checked).toBeFalse();
        expect(fixt.shadowRoot!.activeElement).toEqual(null);
        expect(numClicks).toEqual(0);

        labelEl.click();

        await element.updateComplete;
        await control.updateComplete;

        expect(control.checked).toBeTrue();
        expect(fixt.shadowRoot!.activeElement).toEqual(control);
        expect(numClicks).toEqual(1);
      });

      it('formfield will not double click control', async () => {
        let numClicks = 0;
        const origClick = control.click;

        control.click = () => {
          numClicks += 1;
          origClick.call(control);
        };

        expect(control.checked).toBeFalse();
        expect(numClicks).toEqual(0);

        control.click();

        await element.updateComplete;
        await control.updateComplete;

        expect(numClicks).toEqual(1);
        expect(control.checked).toBeTrue();
      });
    });
  });
});
