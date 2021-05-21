/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {Switch} from '@material/mwc-switch';
import * as hanbi from 'hanbi';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

interface SwitchProps {
  checked: boolean;
  disabled: boolean;
  ariaLabel: string;
  ariaLabelledBy: string;
}

const defaultSwitchElement = html`<mwc-switch></mwc-switch>`;

const switchElement = (propsInit: Partial<SwitchProps>) => {
  return html`
    <mwc-switch
      ?checked=${propsInit.checked === true}
      ?disabled=${propsInit.disabled === true}></mwc-switch>
  `;
};

describe('mwc-switch', () => {
  let fixt: TestFixture;
  let element: Switch;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultSwitchElement);
      element = fixt.root.querySelector('mwc-switch')!;
      await element.updateComplete;
    });

    it('initializes as an mwc-switch', () => {
      assert.instanceOf(element, Switch);
      assert.equal(element.checked, false);
      assert.equal(element.disabled, false);
    });

    it('user input emits `change` event', async () => {
      const callback = hanbi.spy();
      element.addEventListener('change', callback.handler);

      element.click();

      assert.equal(callback.callCount, 1);
    });
  });

  describe('checked', () => {
    beforeEach(async () => {
      fixt = await fixture(switchElement({checked: true}));
      element = fixt.root.querySelector('mwc-switch')!;
      await element.updateComplete;
    });

    it('checks the native input', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      assert(input.checked);

      element.checked = false;
      await element.updateComplete;
      assert(!input.checked);
    });

    it('setting `checked` affects `aria-checked` of native input', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      assert.equal(input.getAttribute('aria-checked'), 'true');

      element.checked = false;
      await element.updateComplete;
      assert.equal(input.getAttribute('aria-checked'), 'false');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixt = await fixture(switchElement({disabled: true}));
      element = fixt.root.querySelector('mwc-switch')!;
      await element.updateComplete;
    });

    it('disables the native input', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      assert(input.disabled);

      element.disabled = false;
      await element.updateComplete;
      assert(!input.disabled);
    });
  });

  describe('aria', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultSwitchElement);
      element = fixt.root.querySelector('mwc-switch')!;
      await element.updateComplete;
    });

    it('delegates aria-label to the proper element', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.setAttribute('aria-label', 'foo');
      await element.updateComplete;
      assert.equal(element.ariaLabel, 'foo');
      assert.equal(element.getAttribute('aria-label'), null);
      assert.equal(input.getAttribute('aria-label'), 'foo');
    });

    it('delegates .ariaLabel to the proper element', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.ariaLabel = 'foo';
      await element.updateComplete;
      assert.equal(element.ariaLabel, 'foo');
      assert.equal(element.getAttribute('aria-label'), null);
      assert.equal(input.getAttribute('aria-label'), 'foo');
    });

    it('delegates aria-labelledby to the proper element', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.setAttribute('aria-labelledby', 'foo');
      await element.updateComplete;
      assert.equal(element.ariaLabelledBy, 'foo');
      assert.equal(element.getAttribute('aria-labelledby'), null);
      assert.equal(input.getAttribute('aria-labelledby'), 'foo');
    });

    it('delegates .ariaLabelledBy to the proper element', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.ariaLabelledBy = 'foo';
      await element.updateComplete;
      assert.equal(element.ariaLabelledBy, 'foo');
      assert.equal(element.getAttribute('aria-labelledby'), null);
      assert.equal(input.getAttribute('aria-labelledby'), 'foo');
    });
  });
});
