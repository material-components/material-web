/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createFormTests} from '../testing/forms.js';
import {createTokenTests} from '../testing/tokens.js';

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

describe('<md-radio>', () => {
  const env = new Environment();

  // Note, this would be better in the harness, but waiting in the test setup
  // can be flaky without access to the test `env`.
  async function simulateKeyDown(element: HTMLElement, key: string) {
    const event = new KeyboardEvent('keydown', {key, bubbles: true});
    element.dispatchEvent(event);
    // We can remove the delay when FF issue addressed:
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1804576
    await env.waitForStability();
  }

  async function setupTest(template = defaultRadio) {
    const root = env.render(template);
    await env.waitForStability();
    const radios = Array.from(root.querySelectorAll('md-radio'));
    const harnesses = radios.map((radio) => new RadioHarness(radio));
    return {harnesses, root};
  }

  describe('.styles', () => {
    createTokenTests(MdRadio.styles);
  });

  describe('basic', () => {
    it('initializes as an md-radio', async () => {
      const {harnesses} = await setupTest();
      expect(harnesses[0].element).toBeInstanceOf(MdRadio);
    });

    it('clicking a radio should select it', async () => {
      const {harnesses} = await setupTest(radioGroup);
      const unselected = harnesses[1];
      expect(unselected.element.checked)
        .withContext('unselected checked')
        .toBeFalse();

      await unselected.clickWithMouse();
      expect(unselected.element.checked)
        .withContext('after clicking checked')
        .toBeTrue();
    });

    it('clicking a radio can be default prevented', async () => {
      const {harnesses} = await setupTest(radioGroup);
      const unselected = harnesses[1];
      expect(unselected.element.checked)
        .withContext('unselected checked')
        .toBeFalse();

      unselected.element.addEventListener('click', (event) => {
        event.preventDefault();
      });

      await unselected.clickWithMouse();
      expect(unselected.element.checked)
        .withContext('after clicking checked')
        .toBeFalse();
    });

    it('clicking a radio should unselect other radio which is already selected', async () => {
      const {harnesses} = await setupTest(radioGroupPreSelected);
      const [, a2, a3] = harnesses;
      expect(a2.element.checked).withContext('already checked').toBeTrue();

      await a3.clickWithMouse();
      expect(a3.element.checked).withContext('new radio checked').toBeTrue();
      expect(a2.element.checked)
        .withContext('previous radio checked')
        .toBeFalse();
    });

    it('disabled radio should not be selected when clicked', async () => {
      const {harnesses} = await setupTest(radioGroupDisabled);
      const [a1, a2] = harnesses;

      expect(a1.element.checked).withContext('unchecked radio').toBeFalse();
      expect(a2.element.checked).withContext('checked radio').toBeTrue();

      await a1.clickWithMouse();
      expect(a1.element.checked)
        .withContext('still unchecked radio')
        .toBeFalse();

      await a2.clickWithMouse();
      expect(a2.element.checked).withContext('still checked radio').toBeTrue();
    });
  });

  describe('events', () => {
    it('Should trigger change event when a radio is selected', async () => {
      const {harnesses, root} = await setupTest(radioGroupPreSelected);
      const changeHandler = jasmine.createSpy('changeHandler');
      root.addEventListener('change', changeHandler);

      const a3 = harnesses[2];
      await a3.clickWithMouse();

      expect(a3.element.checked)
        .withContext('clicked radio checked')
        .toBeTrue();
      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler).toHaveBeenCalledWith(jasmine.any(Event));
    });

    it('Should trigger input event when a radio is selected', async () => {
      const {harnesses, root} = await setupTest(radioGroupPreSelected);
      const inputHandler = jasmine.createSpy('inputHandler');
      root.addEventListener('input', inputHandler);

      const a3 = harnesses[2];
      await a3.clickWithMouse();

      expect(a3.element.checked)
        .withContext('clicked radio checked')
        .toBeTrue();
      expect(inputHandler).toHaveBeenCalledTimes(1);
      expect(inputHandler).toHaveBeenCalledWith(jasmine.any(InputEvent));
    });
  });

  describe('navigation', () => {
    it('Using arrow right should select the next radio button', async () => {
      const {harnesses} = await setupTest(radioGroupPreSelected);
      const [, a2, a3] = harnesses;
      expect(a2.element.checked)
        .withContext('default checked radio')
        .toBeTrue();

      await simulateKeyDown(a2.element, 'ArrowRight');

      expect(a3.element.checked).withContext('next radio checked').toBeTrue();
      expect(a2.element.checked).withContext('prev radio checked').toBeFalse();
    });

    it('dispatched a change event on user navigation', async () => {
      const {harnesses, root} = await setupTest(radioGroupPreSelected);
      const changeHandler = jasmine.createSpy('changeHandler');
      root.addEventListener('change', changeHandler);
      const [, a2] = harnesses;
      expect(a2.element.checked)
        .withContext('default checked radio')
        .toBeTrue();

      await simulateKeyDown(a2.element, 'ArrowRight');

      expect(changeHandler).toHaveBeenCalledTimes(1);
    });

    it('Using arrow right on the last radio should select the first radio in that group', async () => {
      const {harnesses} = await setupTest(radioGroupPreSelected);
      const [a1, a2, a3, b1] = harnesses;

      expect(a2.element.checked).toBeTrue();

      await simulateKeyDown(a2.element, 'ArrowRight');
      await simulateKeyDown(a3.element, 'ArrowRight');

      expect(a3.element.checked).withContext('last radio checked').toBeFalse();
      expect(a1.element.checked).withContext('first radio checked').toBeTrue();
      expect(b1.element.checked)
        .withContext('unrelated radio checked')
        .toBeFalse();
    });
  });

  describe('manages selection groups', () => {
    it('synchronously', async () => {
      const {harnesses} = await setupTest(radioGroup);
      const [a1, a2, b1] = harnesses;

      expect(a1.element.checked).withContext('initially unchecked').toBeFalse();
      expect(a2.element.checked).withContext('initially unchecked').toBeFalse();
      expect(b1.element.checked).withContext('initially unchecked').toBeFalse();

      // Should uncheck previously checked radio
      a2.element.checked = true;
      a1.element.checked = true;

      expect(a1.element.checked).withContext('last radio checked').toBeTrue();
      expect(a2.element.checked)
        .withContext('unchecked by last radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated radio unchecked')
        .toBeFalse();

      // Should re-check radio
      a2.element.checked = true;
      a1.element.checked = true;
      a2.element.checked = true;
      expect(a1.element.checked)
        .withContext('unchecked by second radio')
        .toBeFalse();
      expect(a2.element.checked).withContext('last radio checked').toBeTrue();
      expect(b1.element.checked)
        .withContext('unrelated radio unchecked')
        .toBeFalse();

      // Should ignore unrelated radios
      a1.element.checked = true;
      expect(a1.element.checked)
        .withContext('related checked radio')
        .toBeTrue();
      expect(a2.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated unchecked radio')
        .toBeFalse();

      b1.element.checked = true;
      expect(a1.element.checked)
        .withContext('related checked radio')
        .toBeTrue();
      expect(a2.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated checked radio')
        .toBeTrue();

      a1.element.checked = false;
      b1.element.checked = false;
      expect(a1.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(a2.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated unchecked radio')
        .toBeFalse();
    });

    it('after updates settle', async () => {
      const {harnesses} = await setupTest(radioGroup);
      const [a1, a2, b1] = harnesses;
      const allUpdatesComplete = () =>
        Promise.all(harnesses.map((harness) => harness.element.updateComplete));

      await allUpdatesComplete();
      expect(a1.element.checked).withContext('initially unchecked').toBeFalse();
      expect(a2.element.checked).withContext('initially unchecked').toBeFalse();
      expect(b1.element.checked).withContext('initially unchecked').toBeFalse();

      // Should uncheck previously checked radio
      a2.element.checked = true;
      a1.element.checked = true;
      await allUpdatesComplete();

      expect(a1.element.checked).withContext('last radio checked').toBeTrue();
      expect(a2.element.checked)
        .withContext('unchecked by last radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated radio unchecked')
        .toBeFalse();

      // Should re-check radio
      a2.element.checked = true;
      a1.element.checked = true;
      a2.element.checked = true;
      await allUpdatesComplete();
      expect(a1.element.checked)
        .withContext('unchecked by second radio')
        .toBeFalse();
      expect(a2.element.checked).withContext('last radio checked').toBeTrue();
      expect(b1.element.checked)
        .withContext('unrelated radio unchecked')
        .toBeFalse();

      // Should ignore unrelated radios
      a1.element.checked = true;
      expect(a1.element.checked)
        .withContext('related checked radio')
        .toBeTrue();
      expect(a2.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated unchecked radio')
        .toBeFalse();

      b1.element.checked = true;
      await allUpdatesComplete();
      expect(a1.element.checked)
        .withContext('related checked radio')
        .toBeTrue();
      expect(a2.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated checked radio')
        .toBeTrue();

      a1.element.checked = false;
      b1.element.checked = false;
      await allUpdatesComplete();
      expect(a1.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(a2.element.checked)
        .withContext('related unchecked radio')
        .toBeFalse();
      expect(b1.element.checked)
        .withContext('unrelated unchecked radio')
        .toBeFalse();
    });

    it('when checked before connected', async () => {
      const root = env.render(html`<main></main>`);
      const container = root.querySelector('main')!;

      const r1 = document.createElement('md-radio');
      r1.setAttribute('name', 'a');
      const r2 = document.createElement('md-radio');
      r2.setAttribute('name', 'a');
      const r3 = document.createElement('md-radio');
      r3.setAttribute('name', 'a');

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

      // Appending r2 should uncheck r1, because when a new checked radio is
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
      const repeated = values.map(
        (value) => html`<md-radio value=${value} name="a"></md-radio>`,
      );
      const root = env.render(html`${repeated}`);
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

  describe('label activation', () => {
    async function setupLabelTest() {
      const root = env.render(html`
        <label> <md-radio name="a"></md-radio></label>
        <label> <md-radio name="a"></md-radio></label>
      `);
      await env.waitForStability();
      // [[label, radio]]
      return Array.from(root.querySelectorAll('label')).map(
        (el) => [el, el.firstElementChild as MdRadio] as const,
      );
    }

    it('toggles when label is clicked', async () => {
      const [[label1, radio1], [label2, radio2]] = await setupLabelTest();

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

  describe('forms', () => {
    createFormTests({
      queryControl: (root) => root.querySelector('md-radio'),
      valueTests: [
        {
          name: 'unnamed',
          render: () => html`
            <md-radio value="One" checked></md-radio>
            <md-radio value="Two"></md-radio>
          `,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form without a name')
              .toHaveSize(0);
          },
        },
        {
          name: 'unchecked',
          render: () => html`
            <md-radio name="radio" value="One"></md-radio>
            <md-radio name="radio" value="Two"></md-radio>
          `,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when unchecked')
              .toHaveSize(0);
          },
        },
        {
          name: 'checked first value',
          render: () => html`
            <md-radio name="radio" value="One" checked></md-radio>
            <md-radio name="radio" value="Two"></md-radio>
          `,
          assertValue(formData) {
            expect(formData.get('radio')).toBe('One');
          },
        },
        {
          name: 'checked second value',
          render: () => html`
            <md-radio name="radio" value="One"></md-radio>
            <md-radio name="radio" value="Two" checked></md-radio>
          `,
          assertValue(formData) {
            expect(formData.get('radio')).toBe('Two');
          },
        },
        {
          name: 'disabled',
          render: () => html`
            <md-radio name="radio" value="One" checked disabled></md-radio>
            <md-radio name="radio" value="Two" disabled></md-radio>
          `,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when disabled')
              .toHaveSize(0);
          },
        },
      ],
      resetTests: [
        {
          name: 'reset to unchecked',
          render: () => html`
            <md-radio name="radio" value="One"></md-radio>
            <md-radio name="radio" value="Two"></md-radio>
          `,
          change(radio) {
            radio.checked = true;
          },
          assertReset(radio) {
            expect(radio.checked)
              .withContext('radio.checked after reset')
              .toBeFalse();
          },
        },
        {
          name: 'reset to checked',
          render: () => html`
            <md-radio name="radio" value="One" checked></md-radio>
            <md-radio name="radio" value="Two"></md-radio>
          `,
          change(radio) {
            radio.checked = false;
          },
          assertReset(radio) {
            expect(radio.checked)
              .withContext('radio.checked after reset')
              .toBeTrue();
          },
        },
      ],
      restoreTests: [
        {
          name: 'restore unchecked',
          render: () => html`
            <md-radio name="radio" value="One"></md-radio>
            <md-radio name="radio" value="Two"></md-radio>
          `,
          assertRestored(radio) {
            expect(radio.checked)
              .withContext('radio.checked after restore')
              .toBeFalse();
          },
        },
        {
          name: 'restore checked',
          render: () => html`
            <md-radio name="radio" value="One" checked></md-radio>
            <md-radio name="radio" value="Two"></md-radio>
          `,
          assertRestored(radio) {
            expect(radio.checked)
              .withContext('radio.checked after restore')
              .toBeTrue();
          },
        },
      ],
    });
  });
});
