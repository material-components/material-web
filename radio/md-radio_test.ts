/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {html} from 'lit';

import {MdFocusRing} from '../focus/focus-ring.js';
import {Environment} from '../testing/environment.js';

import {RadioHarness} from './harness.js';
import {MdRadio} from './radio.js';

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
  const env = new Environment();

  // Note, this would be better in the harness, but waiting in the test setup
  // can be flakey without access to the test `env`.
  async function simulateKeyDown(element: HTMLElement, key: string) {
    const event = new KeyboardEvent('keydown', {key, bubbles: true});
    element.dispatchEvent(event);
    // TODO(https://bugzilla.mozilla.org/show_bug.cgi?id=1804576)
    // Remove delay when issue addressed.
    await env.waitForStability();
  }

  let element: MdRadio;
  let harness: RadioHarness;

  describe('basic', () => {
    it('initializes as an md-radio', async () => {
      const root = env.render(defaultRadio);
      await env.waitForStability();
      element = root.querySelector('md-radio')!;
      expect(element).toBeInstanceOf(MdRadio);
    });

    it('clicking a radio should select it', async () => {
      const root = env.render(radioGroup);
      await env.waitForStability();
      element = root.querySelectorAll('md-radio')[1];
      harness = new RadioHarness(element);
      await harness.clickWithMouse();
      expect(element.checked).toBeTrue();
    });

    it('clicking a radio should unselect other radio which is already selected',
       async () => {
         const root = env.render(radioGroupPreSelected);
         await env.waitForStability();
         const a2 = root.querySelectorAll('md-radio')[1];
         expect(a2.checked).toBeTrue();

         const a3 = root.querySelectorAll('md-radio')[2];
         harness = new RadioHarness(a3);
         await harness.clickWithMouse();
         expect(a3.checked).toBeTrue();
         expect(a2.checked).toBeFalse();
       });

    it('disabled radio should not be selected when clicked', async () => {
      const root = env.render(radioGroupDisabled);
      await env.waitForStability();
      const a1 = root.querySelectorAll('md-radio')[0];
      expect(a1.checked).toBeFalse();
      const a2 = root.querySelectorAll('md-radio')[1];
      expect(a2.checked).toBeTrue();

      await (new RadioHarness(a1)).clickWithMouse();
      expect(a1.checked).toBeFalse();

      await (new RadioHarness(a1)).clickWithMouse();
      expect(a2.checked).toBeTrue();
    });
  });

  describe('events', () => {
    it('Should trigger change event when a radio is selected', async () => {
      const root = env.render(radioGroupPreSelected);
      await env.waitForStability();
      const changeHandler = jasmine.createSpy('changeHandler');
      root.addEventListener('change', changeHandler);

      const a3 = root.querySelectorAll('md-radio')[2];
      harness = new RadioHarness(a3);
      await harness.clickWithMouse();

      expect(a3.checked).toBeTrue();
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler).toHaveBeenCalledWith(jasmine.any(Event));
    });
  });

  describe('navigation', () => {
    it('Using arrow right should select the next radio button', async () => {
      const root = env.render(radioGroupPreSelected);
      await env.waitForStability();
      const a2 = root.querySelectorAll('md-radio')[1];
      expect(a2.checked).toBeTrue();

      await simulateKeyDown(a2, 'ArrowRight');

      const a3 = root.querySelectorAll('md-radio')[2];
      expect(a3.checked).toBeTrue();
      expect(a2.checked).toBeFalse();
    });

    it('Using arrow right on the last radio should select the first radio in that group',
       async () => {
         const root = env.render(radioGroupPreSelected);
         await env.waitForStability();

         const a2 = root.querySelectorAll('md-radio')[1];
         expect(a2.checked).toBeTrue();

         await simulateKeyDown(a2, 'ArrowRight');
         const a3 = root.querySelectorAll('md-radio')[2];
         await simulateKeyDown(a3, 'ArrowRight');

         expect(a3.checked).toBeFalse();
         const a1 = root.querySelectorAll('md-radio')[0];
         expect(a1.checked).toBeTrue();
         const b1 = root.querySelectorAll('md-radio')[3];
         expect(b1.checked).toBeFalse();
       });
  });

  describe('manages selection groups', () => {
    it('synchronously', async () => {
      const root = env.render(radioGroup);
      await env.waitForStability();

      const [a1, a2, b1] = [...root.querySelectorAll('md-radio')];

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
      const root = env.render(radioGroup);
      await env.waitForStability();

      const radios = [...root.querySelectorAll('md-radio')];
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
      const root = env.render(html`<main></main>`);
      const container = root.querySelector('main')!;

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
      const root = env.render(repeatedRadio(values));
      await env.waitForStability();
      const [a1, a2] = root.querySelectorAll('md-radio');

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
      const root = env.render(defaultRadio);
      await env.waitForStability();
      element = root.querySelector('md-radio')!;
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

  describe('form submission', () => {
    async function setupFormTest() {
      const root = env.render(html`
        <form>
          <md-radio id="first" name="a" value="first"></md-radio>
          <md-radio id="disabled" name="a" value="disabled" disabled></md-radio>
          <md-radio id="unNamed" value="unnamed"></md-radio>
          <md-radio id="ownGroup" name="b" value="ownGroup"></md-radio>
          <md-radio id="last" name="a" value="last"></md-radio>
        </form>`);
      await env.waitForStability();
      const harnesses = new Map<string, RadioHarness>();
      Array.from(root.querySelectorAll('md-radio')).forEach((el: MdRadio) => {
        harnesses.set(el.id, new RadioHarness(el));
      });
      return harnesses;
    }

    it('does not submit if not checked', async () => {
      const harness = (await setupFormTest()).get('first')!;
      const formData = await harness.submitForm();
      const keys = Array.from(formData.keys());
      expect(keys.length).toEqual(0);
    });

    it('does not submit if disabled', async () => {
      const harness = (await setupFormTest()).get('disabled')!;
      expect(harness.element.disabled).toBeTrue();
      harness.element.checked = true;
      const formData = await harness.submitForm();
      const keys = Array.from(formData.keys());
      expect(keys.length).toEqual(0);
    });

    it('does not submit if name is not provided', async () => {
      const harness = (await setupFormTest()).get('unNamed')!;
      expect(harness.element.name).toBe('');
      const formData = await harness.submitForm();
      const keys = Array.from(formData.keys());
      expect(keys.length).toEqual(0);
    });

    it('submits under correct conditions', async () => {
      const harness = (await setupFormTest()).get('first')!;
      harness.element.checked = true;
      const formData = await harness.submitForm();
      const {name, value} = harness.element;
      const keys = Array.from(formData.keys());
      expect(keys.length).toEqual(1);
      expect(formData.get(name)).toEqual(value);
    });

    it('submits changes to group value under correct conditions', async () => {
      const harnesses = await setupFormTest();
      const first = harnesses.get('first')!;
      const last = harnesses.get('last')!;
      const ownGroup = harnesses.get('ownGroup')!;

      // check first and submit
      first.element.checked = true;
      let formData = await first.submitForm();
      expect(Array.from(formData.keys()).length).toEqual(1);
      expect(formData.get(first.element.name)).toEqual(first.element.value);

      // check last and submit
      last.element.checked = true;
      formData = await last.submitForm();
      expect(Array.from(formData.keys()).length).toEqual(1);
      expect(formData.get(last.element.name)).toEqual(last.element.value);

      // check ownGroup and submit
      ownGroup.element.checked = true;
      formData = await ownGroup.submitForm();
      expect(Array.from(formData.keys()).length).toEqual(2);
      expect(formData.get(last.element.name)).toEqual(last.element.value);
      expect(formData.get(ownGroup.element.name))
          .toEqual(ownGroup.element.value);
    });
  });

  describe('label activation', () => {
    async function setupLabelTest() {
      const root = env.render(html`
        <label> <md-radio name="a"></md-radio></label>
        <label> <md-radio name="a"></md-radio></label>
     `);
      await env.waitForStability();
      // [[label, radio]]
      return Array.from(root.querySelectorAll('label'))
          .map(el => ([el, el.firstElementChild as MdRadio] as const));
    }

    it('toggles when label is clicked', async () => {
      const [[label1, radio1], [label2, radio2], ] = await setupLabelTest();

      label1.click();
      await env.waitForStability();
      expect(radio1.checked).toBeTrue();
      expect(radio2.checked).toBeFalse();

      label2.click();
      await env.waitForStability();
      expect(radio1.checked).toBeFalse();
      expect(radio2.checked).toBeTrue();
    });
  });
});
