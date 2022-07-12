/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {fixture, TestFixture} from '@material/web/compat/testing/helpers';  // TODO(b/235474830): remove the use of fixtures
import {MdFocusRing} from '@material/web/focus/focus-ring';
import {KEY} from 'google3/third_party/javascript/material_components_web/dom/keyboard';
import {html} from 'lit';

import {RadioHarness} from './harness';
import {MdRadio} from './radio';

const defaultRadio = html`<md-radio></md-radio>`;

const radioGroup = html`
          <md-radio id="a1" name="a"></md-radio>
          <md-radio id="a2" name="a"></md-radio>
          <md-radio id="b1" name="b"></md-radio>
          `;

const radioGroupDisabled = html`
          <md-radio id="a1" name="a" disabled></md-radio>
          <md-radio id="a2" name="a" disabled checked></md-radio>
          `;

const radioGroupPreSelected = html`
          <md-radio id="a1" name="a"></md-radio>
          <md-radio id="a2" name="a" checked></md-radio>
          <md-radio id="a3" name="a"></md-radio>
          <md-radio id="b1" name="b"></md-radio>
          `;

const repeatedRadio = (values: string[]) => {
  return html`${
      values.map(
          (value) => html`<md-radio value=${value} name="a"></md-radio>`)}`;
};

describe('md-radio', () => {
  let fixt: TestFixture;
  let element: MdRadio;
  let harness: RadioHarness;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    it('initializes as an md-radio', async () => {
      fixt = await fixture(defaultRadio);
      element = fixt.root.querySelector('md-radio')!;
      expect(element).toBeInstanceOf(MdRadio);
    });

    it('clicking a radio should select it', async () => {
      fixt = await fixture(radioGroup);
      element = fixt.root.querySelectorAll('md-radio')[1];
      harness = new RadioHarness(element);
      await harness.clickWithMouse();
      expect(element.checked).toBeTrue();
    });

    it('clicking a radio should unselect other radio which is already selected',
       async () => {
         fixt = await fixture(radioGroupPreSelected);
         const a2 = fixt.root.querySelectorAll('md-radio')[1];
         expect(a2.checked).toBeTrue();

         const a3 = fixt.root.querySelectorAll('md-radio')[2];
         harness = new RadioHarness(a3);
         await harness.clickWithMouse();
         expect(a3.checked).toBeTrue();
         expect(a2.checked).toBeFalse();
       });

    it('disabled radio should not be selected when clicked', async () => {
      fixt = await fixture(radioGroupDisabled);
      const a1 = fixt.root.querySelectorAll('md-radio')[0];
      expect(a1.checked).toBeFalse();
      const a2 = fixt.root.querySelectorAll('md-radio')[1];
      expect(a2.checked).toBeTrue();

      await (new RadioHarness(a1)).clickWithMouse();
      expect(a1.checked).toBeFalse();

      await (new RadioHarness(a1)).clickWithMouse();
      expect(a2.checked).toBeTrue();
    });
  });

  describe('events', () => {
    it('Should trigger change event when a radio is selected', async () => {
      fixt = await fixture(radioGroupPreSelected);
      const changeHandler = jasmine.createSpy('changeHandler');
      fixt.root.addEventListener('change', changeHandler);

      const a3 = fixt.root.querySelectorAll('md-radio')[2];
      harness = new RadioHarness(a3);
      await harness.clickWithMouse();

      expect(a3.checked).toBeTrue();
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler).toHaveBeenCalledWith(jasmine.any(Event));
    });
  });

  describe('navigation', () => {
    it('Using arrow right should select the next radio button', async () => {
      fixt = await fixture(radioGroupPreSelected);
      const a2 = fixt.root.querySelectorAll('md-radio')[1];
      expect(a2.checked).toBeTrue();

      const eventRight =
          new KeyboardEvent('keydown', {key: KEY.ARROW_RIGHT, bubbles: true});
      a2.dispatchEvent(eventRight);

      const a3 = fixt.root.querySelectorAll('md-radio')[2];
      expect(a3.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
    });

    it('Using arrow right on the last radio should select the first radio in that group',
       async () => {
         fixt = await fixture(radioGroupPreSelected);

         const a2 = fixt.root.querySelectorAll('md-radio')[1];
         expect(a2.checked).toBeTrue();

         const eventRight = new KeyboardEvent(
             'keydown', {key: KEY.ARROW_RIGHT, bubbles: true});
         a2.dispatchEvent(eventRight);
         const a3 = fixt.root.querySelectorAll('md-radio')[2];
         a3.dispatchEvent(eventRight);

         expect(a3.checked).toBeFalse();
         const a1 = fixt.root.querySelectorAll('md-radio')[0];
         expect(a1.checked).toBeTrue();
         const b1 = fixt.root.querySelectorAll('md-radio')[3];
         expect(b1.checked).toBeFalse();
       });
  });

  describe('manages selection groups', () => {
    it('synchronously', async () => {
      fixt = await fixture(radioGroup);

      const [a1, a2, b1] = [...fixt.root.querySelectorAll('md-radio')];

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

      const radios = [...fixt.root.querySelectorAll('md-radio')];
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

      const r1 = document.createElement('md-radio');
      r1.name = 'a';
      const r2 = document.createElement('md-radio');
      r2.name = 'a';
      const r3 = document.createElement('md-radio');
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
      const [a1, a2] = fixt.root.querySelectorAll('md-radio');

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

  describe('focus ring', () => {
    let focusRing: MdFocusRing;

    beforeEach(async () => {
      fixt = await fixture(defaultRadio);
      element = fixt.root.querySelector('md-radio')!;
      focusRing = element.shadowRoot!.querySelector('md-focus-ring')!;
      harness = new RadioHarness(element);
    });

    it('hidden on non-keyboard focus', async () => {
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });

    it('visible on keyboard focus and hides on blur', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.blur();
      expect(focusRing.visible).toBeFalse();
    });

    it('hidden after pointer interaction', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });
  });
});
