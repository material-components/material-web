/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createFormTests} from '../testing/forms.js';
import {createTokenTests} from '../testing/tokens.js';

import {SliderHarness} from './harness.js';
import {MdSlider} from './slider.js';

interface SliderTestProps {
  range?: boolean;
  value?: number;
  valueStart?: number;
  valueEnd?: number;
  step?: number;
  min?: number;
  max?: number;
}

function getSliderTemplate(props?: SliderTestProps) {
  return html` <md-slider
    .range=${props?.range ?? false}
    .value=${props?.value}
    .valueStart=${props?.valueStart}
    .valueEnd=${props?.valueEnd}
    .step=${props?.step ?? 1}
    .min=${props?.min ?? 0}
    .max=${props?.max ?? 100}></md-slider>`;
}

describe('<md-slider>', () => {
  const env = new Environment();

  async function setupTest(
    props?: SliderTestProps,
    template = getSliderTemplate,
  ) {
    const root = env.render(template(props));
    await env.waitForStability();
    const slider = root.querySelector<MdSlider>('md-slider')!;
    const harness = new SliderHarness(slider);
    return {harness, root};
  }

  describe('.styles', () => {
    createTokenTests(MdSlider.styles);
  });

  describe('rendering value', () => {
    it('updates via interaction', async () => {
      const {harness} = await setupTest();
      await harness.simulateValueInteraction(1);
      expect(harness.element.value).toEqual(1);
      await harness.simulateValueInteraction(9);
      expect(harness.element.value).toEqual(9);
    });

    it('not validated when set', async () => {
      const {harness} = await setupTest();
      harness.element.value = -1000;
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(-1000);
    });

    it('validated on interaction', async () => {
      const {harness} = await setupTest();
      harness.element.value = -1000;
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(-1000);
      await harness.simulateValueInteraction(1);
      expect(harness.element.value).toEqual(1);
    });

    it('setting min validates only after interaction', async () => {
      const {harness} = await setupTest({value: 1});
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(1);
      harness.element.min = 2;
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(1);
      await harness.simulateValueInteraction(0);
      expect(harness.element.value).toEqual(2);
    });

    it('setting max validates only after interaction', async () => {
      const {harness} = await setupTest({value: 9});
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(9);
      harness.element.max = 8;
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(9);
      await harness.simulateValueInteraction(111);
      expect(harness.element.value).toEqual(8);
    });

    it('setting step validates only after interaction', async () => {
      const {harness} = await setupTest({value: 5});
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(5);
      harness.element.step = 2;
      await harness.element.updateComplete;
      expect(harness.element.value).toEqual(5);
      await harness.simulateValueInteraction(3);
      expect(harness.element.value).toEqual(4);
    });

    it('step rounds values from min', async () => {
      const props = {value: 2, min: 1, step: 5};
      const {harness} = await setupTest(props);
      expect(harness.element.value).toEqual(2);
      await harness.simulateValueInteraction(3);
      expect(harness.element.value).toEqual(1);
      await harness.simulateValueInteraction(4);
      expect(harness.element.value).toEqual(6);
    });

    it('step can be non-integer', async () => {
      const props = {value: 2, step: 0.1};
      const {harness} = await setupTest(props);
      expect(harness.element.value).toEqual(2);
      await harness.simulateValueInteraction(3.2);
      expect(harness.element.value).toEqual(3.2);
      await harness.simulateValueInteraction(70.55);
      expect(harness.element.value).toEqual(70.6);
    });
  });

  describe('rendering valueStart/valueEnd (range = true)', () => {
    it('renders inputs and handles', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      await harness.element.updateComplete;
      const inputs = harness.getInputs();
      expect(inputs[0]).not.toBeNull();
      expect(inputs[1]).not.toBeNull();
      const handles = harness.getHandles();
      expect(handles[0]).not.toBeNull();
      expect(handles[1]).not.toBeNull();
    });

    it('update via interaction', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      const [endInput, startInput] = harness.getInputs();
      await harness.simulateValueInteraction(7, endInput);
      expect(harness.element.valueStart).toEqual(2);
      expect(harness.element.valueEnd).toEqual(7);
      await harness.simulateValueInteraction(1, startInput);
      expect(harness.element.valueStart).toEqual(1);
      expect(harness.element.valueEnd).toEqual(7);
    });

    it('not validated when set', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      const testValueStart = -1000;
      const testValueEnd = -900;
      harness.element.valueStart = testValueStart;
      harness.element.valueEnd = testValueEnd;
      await harness.element.updateComplete;
      expect(harness.element.valueStart).toEqual(testValueStart);
      expect(harness.element.valueEnd).toEqual(testValueEnd);
    });

    it('validated on interaction', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      const testValueStart = -1000;
      const testValueEnd = -900;
      harness.element.valueStart = testValueStart;
      harness.element.valueEnd = testValueEnd;
      await harness.element.updateComplete;
      await harness.simulateValueInteraction(1000);
      expect(harness.element.valueStart).toEqual(harness.element.min);
      expect(harness.element.valueEnd).toEqual(harness.element.max);
    });

    it('setting min validates only after interaction', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      harness.element.min = 3;
      await harness.element.updateComplete;
      expect(harness.element.valueStart).toEqual(2);
      expect(harness.element.valueEnd).toEqual(6);
      const startInput = harness.getInputs()[1];
      await harness.simulateValueInteraction(0, startInput);
      expect(harness.element.valueStart).toEqual(3);
      expect(harness.element.valueEnd).toEqual(6);
    });

    it('setting max validates only after interaction', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      harness.element.max = 5;
      await harness.element.updateComplete;
      expect(harness.element.valueStart).toEqual(2);
      expect(harness.element.valueEnd).toEqual(6);
      await harness.simulateValueInteraction(111);
      expect(harness.element.valueStart).toEqual(2);
      expect(harness.element.valueEnd).toEqual(5);
    });

    it('setting step validates only after interaction', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      harness.element.step = 2;
      await harness.element.updateComplete;
      const [endInput, startInput] = harness.getInputs();
      await harness.simulateValueInteraction(7, endInput);
      await harness.simulateValueInteraction(5, startInput);
      expect(harness.element.valueStart).toEqual(6);
      expect(harness.element.valueEnd).toEqual(8);
    });

    it('clamps moving start > end and end < start', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      await harness.element.updateComplete;
      const [endInput, startInput] = harness.getInputs();
      await harness.simulateValueInteraction(7, startInput);
      expect(harness.element.valueStart).toEqual(6);
      await harness.simulateValueInteraction(4, startInput);
      expect(harness.element.valueStart).toEqual(4);
      await harness.simulateValueInteraction(3, endInput);
      expect(harness.element.valueEnd).toEqual(4);
    });

    it('when starting coincident, can move start > end and end < start', async () => {
      const props = {range: true, valueStart: 2, valueEnd: 6};
      const {harness} = await setupTest(props);
      await harness.element.updateComplete;
      const [endInput, startInput] = harness.getInputs();
      await harness.simulateValueInteraction(6, startInput);
      expect(harness.element.valueStart).toEqual(6);
      await harness.simulateValueInteraction(8, startInput);
      expect(harness.element.valueStart).toEqual(6);
      expect(harness.element.valueEnd).toEqual(8);
      await harness.simulateValueInteraction(8, startInput);
      expect(harness.element.valueStart).toEqual(8);
      expect(harness.element.valueEnd).toEqual(8);
      await harness.simulateValueInteraction(4, endInput);
      expect(harness.element.valueStart).toEqual(4);
      expect(harness.element.valueEnd).toEqual(8);
    });
  });

  describe('dispatches input and change events', () => {
    it('when range = false', async () => {
      const {harness} = await setupTest();
      await harness.element.updateComplete;
      const inputHandler = jasmine.createSpy('input');
      const changeHandler = jasmine.createSpy('change');
      harness.element.addEventListener('input', inputHandler);
      harness.element.addEventListener('change', changeHandler);
      await harness.simulateValueInteraction(8);
      expect(inputHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler).toHaveBeenCalledTimes(1);
      await harness.simulateValueInteraction(80);
      expect(inputHandler).toHaveBeenCalledTimes(2);
      expect(changeHandler).toHaveBeenCalledTimes(2);
    });

    it('when range = true', async () => {
      const {harness} = await setupTest({range: true});
      await harness.element.updateComplete;
      const inputHandler = jasmine.createSpy('input');
      const changeHandler = jasmine.createSpy('change');
      harness.element.addEventListener('input', inputHandler);
      harness.element.addEventListener('change', changeHandler);
      const [endInput, startInput] = harness.getInputs();
      await harness.simulateValueInteraction(8, startInput);
      await harness.simulateValueInteraction(80, endInput);
      expect(inputHandler).toHaveBeenCalledTimes(2);
      expect(changeHandler).toHaveBeenCalledTimes(2);
      // input of start > end should be prevented,
      // but change to end value should occur
      await harness.simulateValueInteraction(85, startInput);
      expect(inputHandler).toHaveBeenCalledTimes(2);
      expect(changeHandler).toHaveBeenCalledTimes(3);
      // starting coincident, so input should now be ok.
      await harness.simulateValueInteraction(85, startInput);
      expect(inputHandler).toHaveBeenCalledTimes(3);
      expect(changeHandler).toHaveBeenCalledTimes(4);
      // validate same on end side
      await harness.simulateValueInteraction(40, endInput);
      expect(inputHandler).toHaveBeenCalledTimes(3);
      expect(changeHandler).toHaveBeenCalledTimes(5);
      await harness.simulateValueInteraction(40, endInput);
      expect(inputHandler).toHaveBeenCalledTimes(4);
      expect(changeHandler).toHaveBeenCalledTimes(6);
    });
  });

  describe('value label', () => {
    it('shows on focus when labeled is true', async () => {
      const {harness} = await setupTest();
      harness.element.labeled = true;
      await harness.element.updateComplete;
      harness.element.focus();
      expect(harness.isLabelShowing()).toBeTrue();
    });

    it('does now show when labeled is false', async () => {
      const {harness} = await setupTest();
      await harness.element.updateComplete;
      harness.element.focus();
      expect(harness.isLabelShowing()).toBeFalse();
    });

    it('hides after blur', async () => {
      const {harness} = await setupTest();
      harness.element.labeled = true;
      await harness.element.updateComplete;
      harness.element.focus();
      expect(harness.isLabelShowing()).toBeTrue();
      harness.element.blur();
      expect(harness.isLabelShowing()).toBeFalse();
    });

    it('shows value label on hover', async () => {
      const {harness} = await setupTest();
      harness.element.labeled = true;
      await harness.element.updateComplete;
      await harness.startHover();
      expect(harness.isLabelShowing()).toBeTrue();
      await harness.endHover();
      expect(harness.isLabelShowing()).toBeFalse();
    });
  });

  describe('focus', () => {
    it('focuses on the end input by default', async () => {
      const {harness} = await setupTest({value: 5});
      await harness.element.updateComplete;
      harness.element.focus();
      const input = harness.getInputs()[0];
      expect(input.matches(':focus')).toBe(true);
    });
  });

  describe('default values', () => {
    it('defaults value to midway between min/max', async () => {
      const {harness} = await setupTest({min: -100, max: -40});
      await harness.element.updateComplete;
      expect(harness.element.value).toBe(-70);
    });

    it('defaults valueStart/End to equidistant between min/max', async () => {
      const {harness} = await setupTest({range: true, min: 80, max: 100});
      await harness.element.updateComplete;
      expect(harness.element.valueStart).toBe(87);
      expect(harness.element.valueEnd).toBe(93);
    });
  });

  describe('forms', () => {
    createFormTests({
      queryControl: (root) => root.querySelector('md-slider'),
      valueTests: [
        {
          name: 'unnamed',
          render: () => html`<md-slider></md-slider>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form without a name')
              .toHaveSize(0);
          },
        },
        {
          name: 'single value',
          render: () => html`<md-slider name="slider" value="10"></md-slider>`,
          assertValue(formData) {
            expect(formData.get('slider')).toBe('10');
          },
        },
        {
          name: 'multiple values same name',
          render: () =>
            html`<md-slider
              range
              name="slider"
              value-start="0"
              value-end="10"></md-slider>`,
          assertValue(formData) {
            expect(formData.getAll('slider')).toEqual(['0', '10']);
          },
        },
        {
          name: 'multiple values different names',
          render: () =>
            html`<md-slider
              range
              name-start="slider-start"
              name-end="slider-end"
              value-start="0"
              value-end="10"></md-slider>`,
          assertValue(formData) {
            expect(formData.get('slider-start')).toBe('0');
            expect(formData.get('slider-end')).toBe('10');
          },
        },
        {
          name: 'single default value',
          render: () => html`<md-slider name="slider"></md-slider>`,
          assertValue(formData) {
            expect(formData.get('slider')).toBe('50');
          },
        },
        {
          name: 'single default value with min/max',
          render: () =>
            html`<md-slider name="slider" min="100" max="300"></md-slider>`,
          assertValue(formData) {
            expect(formData.get('slider')).toBe('200');
          },
        },
        {
          name: 'multiple default values',
          render: () => html`<md-slider range name="slider"></md-slider>`,
          assertValue(formData) {
            expect(formData.getAll('slider')).toEqual(['33', '67']);
          },
        },
        {
          name: 'multiple default values with min/max',
          render: () =>
            html`<md-slider
              range
              name="slider"
              min="100"
              max="300"></md-slider>`,
          assertValue(formData) {
            expect(formData.getAll('slider')).toEqual(['167', '233']);
          },
        },
        {
          name: 'disabled',
          render: () =>
            html`<md-slider name="slider" value="10" disabled></md-slider>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when disabled')
              .toHaveSize(0);
          },
        },
      ],
      resetTests: [
        {
          name: 'reset single value',
          render: () => html`<md-slider name="slider" value="10"></md-slider>`,
          change(slider) {
            slider.value = 100;
          },
          assertReset(slider) {
            expect(slider.value)
              .withContext('slider.value after reset')
              .toBe(10);
          },
        },
        {
          name: 'reset multiple values same name',
          render: () =>
            html`<md-slider
              range
              name="slider"
              value-start="0"
              value-end="10"></md-slider>`,
          change(slider) {
            slider.valueStart = 5;
            slider.valueEnd = 5;
          },
          assertReset(slider) {
            expect(slider.valueStart)
              .withContext('slider.valueStart after reset')
              .toEqual(0);
            expect(slider.valueEnd)
              .withContext('slider.valueEnd after reset')
              .toEqual(10);
          },
        },
        {
          name: 'reset multiple values different names',
          render: () =>
            html`<md-slider
              range
              name-start="slider-start"
              name-end="slider-end"
              value-start="0"
              value-end="10"></md-slider>`,
          change(slider) {
            slider.valueStart = 5;
            slider.valueEnd = 5;
          },
          assertReset(slider) {
            expect(slider.valueStart)
              .withContext('slider.valueStart after reset')
              .toEqual(0);
            expect(slider.valueEnd)
              .withContext('slider.valueEnd after reset')
              .toEqual(10);
          },
        },
      ],
      restoreTests: [
        {
          name: 'restore single value',
          render: () => html`<md-slider name="checkbox" value="1"></md-slider>`,
          assertRestored(slider) {
            expect(slider.value)
              .withContext('slider.value after restore')
              .toBe(1);
          },
        },
        {
          name: 'restore multiple values same name',
          render: () =>
            html`<md-slider
              range
              name="slider"
              value-start="0"
              value-end="10"></md-slider>`,
          assertRestored(slider) {
            expect(slider.valueStart)
              .withContext('slider.valueStart after restore')
              .toEqual(0);
            expect(slider.valueEnd)
              .withContext('slider.valueEnd after restore')
              .toEqual(10);
          },
        },
        {
          name: 'restore multiple values different names',
          render: () =>
            html`<md-slider
              range
              name-start="slider-start"
              name-end="slider-end"
              value-start="0"
              value-end="10"></md-slider>`,
          assertRestored(slider) {
            expect(slider.valueStart)
              .withContext('slider.valueStart after restore')
              .toEqual(0);
            expect(slider.valueEnd)
              .withContext('slider.valueEnd after restore')
              .toEqual(10);
          },
        },
      ],
    });
  });
});
