/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Radio} from '@material/mwc-radio';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

const defaultRadio = html`<mwc-radio></mwc-radio>`;

const radioGroup = html`
          <mwc-radio id="a1" name="a"></mwc-radio>
          <mwc-radio id="a2" name="a"></mwc-radio>
          <mwc-radio id="b1" name="b"></mwc-radio>
          `;

const repeatedRadio = (values: string[]) => {
  return html`${
      values.map(
          (value) => html`<mwc-radio value=${value} name="a"></mwc-radio>`)}`;
};

describe('mwc-radio', () => {
  let fixt: TestFixture;
  let element: Radio;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultRadio);
      element = fixt.root.querySelector('mwc-radio')!;
    });

    it('initializes as an mwc-radio', () => {
      expect(element).toBeInstanceOf(Radio);
    });
  });

  describe('aria', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultRadio);
      element = fixt.root.querySelector('mwc-radio')!;
      await element.updateComplete;
    });

    it('delegates aria-label via attribute', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.setAttribute('aria-label', 'foo');
      await element.updateComplete;
      expect(element.getAttribute('aria-label')).toEqual(null);
      expect(element.ariaLabel).toEqual('foo');
      expect(input.getAttribute('aria-label')).toEqual('foo');
    });

    it('delegates aria-label via property', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.ariaLabel = 'foo';
      await element.updateComplete;
      expect(element.getAttribute('aria-label')).toEqual(null);
      expect(element.ariaLabel).toEqual('foo');
      expect(input.getAttribute('aria-label')).toEqual('foo');
    });

    it('delegates aria-labelledby via attribute', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.setAttribute('aria-label', 'foo');
      await element.updateComplete;
      expect(element.getAttribute('aria-label')).toEqual(null);
      expect(element.ariaLabel).toEqual('foo');
      expect(input.getAttribute('aria-label')).toEqual('foo');
    });

    it('delegates aria-labelledby via property', async () => {
      const input = element.shadowRoot!.querySelector('input')!;
      element.ariaLabel = 'foo';
      await element.updateComplete;
      expect(element.getAttribute('aria-label')).toEqual(null);
      expect(element.ariaLabel).toEqual('foo');
      expect(input.getAttribute('aria-label')).toEqual('foo');
    });
  });

  describe('manages selection groups', () => {
    it('synchronously', async () => {
      fixt = await fixture(radioGroup);

      const [a1, a2, b1] = [...fixt.root.querySelectorAll('mwc-radio')];

      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();

      a2.checked = true;
      a1.checked = true;

      expect(a1.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();

      a2.checked = true;
      a1.checked = true;
      a2.checked = true;
      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeTrue();
      expect(b1.checked).toBeFalse();

      a1.checked = true;
      expect(a1.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();

      b1.checked = true;
      expect(a1.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeTrue();

      a1.checked = false;
      b1.checked = false;
      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();
    });

    it('after updates settle', async () => {
      fixt = await fixture(radioGroup);

      const radios = [...fixt.root.querySelectorAll('mwc-radio')];
      const [a1, a2, b1] = radios;
      const allUpdatesComplete = () =>
          Promise.all(radios.map((radio) => radio.updateComplete));

      await allUpdatesComplete();
      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();

      a2.checked = true;
      a1.checked = true;
      await allUpdatesComplete();
      expect(a1.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();

      a2.checked = true;
      a1.checked = true;
      a2.checked = true;
      await allUpdatesComplete();
      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeTrue();
      expect(b1.checked).toBeFalse();

      a1.checked = true;
      expect(a1.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();

      b1.checked = true;
      await allUpdatesComplete();
      expect(a1.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeTrue();

      a1.checked = false;
      b1.checked = false;
      await allUpdatesComplete();
      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeFalse();
      expect(b1.checked).toBeFalse();
    });

    it('when checked before connected', async () => {
      fixt = await fixture(html`<main></main>`);
      const container = fixt.root.querySelector('main')!;

      const r1 = document.createElement('mwc-radio');
      r1.name = 'a';
      const r2 = document.createElement('mwc-radio');
      r2.name = 'a';
      const r3 = document.createElement('mwc-radio');
      r3.name = 'a';

      // r1 and r2 should both be checked, because even though they have the
      // same name, they aren't yet connected to a root. Groups are scoped to
      // roots, and we can't know which root a radio belongs to until it is
      // connected to one. This matches native <input type="radio"> behavior.
      r1.checked = true;
      r2.checked = true;
      expect(r1.checked).toBeTrue();
      expect(r2.checked).toBeTrue();
      expect(r3.checked).toBeFalse();

      // Connecting r1 shouldn't change anything, since it's the only one in the
      // group.
      container.appendChild(r1);
      expect(r1.checked).toBeTrue();
      expect(r2.checked).toBeTrue();
      expect(r3.checked).toBeFalse();

      // Appending r2 should disable r1, because when a new checked radio is
      // connected, it wins (this matches native input behavior).
      container.appendChild(r2);
      expect(r1.checked).toBeFalse();
      expect(r2.checked).toBeTrue();
      expect(r3.checked).toBeFalse();

      // Appending r3 shouldn't change anything, because it's not checked.
      container.appendChild(r3);
      expect(r1.checked).toBeFalse();
      expect(r2.checked).toBeTrue();
      expect(r3.checked).toBeFalse();

      // Checking r3 should uncheck r2 because it's now in the same group.
      r3.checked = true;
      expect(r1.checked).toBeFalse();
      expect(r2.checked).toBeFalse();
      expect(r3.checked).toBeTrue();
    });

    it('in a lit repeat', async () => {
      const values = ['a1', 'a2'];
      fixt = await fixture(repeatedRadio(values));
      const [a1, a2] = fixt.root.querySelectorAll('mwc-radio');

      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeFalse();
      expect(a1.value).toEqual(values[0]);
      expect(a2.value).toEqual(values[1]);

      a1.checked = true;
      expect(a1.checked).toBeTrue();
      expect(a2.checked).toBeFalse();

      a2.checked = true;
      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeTrue();

      a2.checked = false;
      expect(a1.checked).toBeFalse();
      expect(a2.checked).toBeFalse();
    });
  });
});
