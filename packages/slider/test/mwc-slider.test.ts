/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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

import {Slider} from '@material/mwc-slider/mwc-slider';
import * as hanbi from 'hanbi';
import {html} from 'lit-html';

import {fixture, ieSafeKeyboardEvent, rafPromise, TestFixture} from '../../../test/src/util/helpers';

const defaultSliderProps = {
  min: 0,
  max: 100,
  value: 0,
};

type SliderProps = typeof defaultSliderProps;

const basic = html`
  <mwc-slider></mwc-slider>
`;

const slider = (propsInit: Partial<SliderProps> = {}) => {
  const props = {...defaultSliderProps, ...propsInit};

  return html`
    <mwc-slider
        .min=${props.min}
        .max=${props.max}
        .value=${props.value}>
    </mwc-slider>
  `;
};

const afterRender = async (root: ShadowRoot) => {
  const slider = root.querySelector('mwc-slider')!;
  await slider.updateComplete;
  slider.layout();
  await rafPromise();
  await rafPromise();
};

suite('mwc-slider', () => {
  let fixt: TestFixture;
  let element: Slider;

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(basic);
      element = fixt.root.querySelector('mwc-slider')!;
    });

    teardown(() => {
      fixt.remove();
    });

    test('initializes as an mwc-slider', () => {
      assert.instanceOf(element, Slider);
    });

    test('initializes defaults', () => {
      assert.equal(element.value, 0);
      assert.equal(element.min, 0);
      assert.equal(element.max, 100);
      assert.equal(element.step, 0);
      assert.equal(element.disabled, false);
      assert.equal(element.pin, false);
      assert.equal(element.markers, false);
    });

    test('sets correct aria values', () => {
      const slider = element.shadowRoot!.querySelector('.mdc-slider')!;
      assert.equal(slider.getAttribute('aria-valuemin'), '0');
      assert.equal(slider.getAttribute('aria-valuenow'), '0');
    });

    test('key events change value and fire events', async () => {
      const slider = element.shadowRoot!.querySelector('.mdc-slider')!;
      const inputHandler = hanbi.spy();
      const changeHandler = hanbi.spy();
      element.addEventListener('input', inputHandler.handler);
      element.addEventListener('change', changeHandler.handler);

      // arrow up keycode
      const upEv = ieSafeKeyboardEvent('keydown', 38);
      slider.dispatchEvent(upEv);

      await element.updateComplete;
      await rafPromise();
      assert.isTrue(inputHandler.called);
      assert.isTrue(changeHandler.called);
      assert.equal(element.value, 1);

      // arrow down keycode
      const downEv = ieSafeKeyboardEvent('keydown', 40);
      slider.dispatchEvent(downEv);
      await element.updateComplete;
      await rafPromise();
      assert.equal(element.value, 0);
    });

    test('markers display when enabled', async () => {
      const markerSelector = '.mdc-slider__track-marker-container';
      let markers = element.shadowRoot!.querySelector(markerSelector);
      assert.equal(markers, null);
      element.markers = true;
      await element.updateComplete;
      markers = element.shadowRoot!.querySelector(markerSelector);
      assert.equal(markers, null);
      element.step = 1;
      await element.updateComplete;
      markers = element.shadowRoot!.querySelector(markerSelector);
      assert.instanceOf(markers, Element);
    });

    test('pin displays when enabled and receiving input', async () => {
      const pinSelector = '.mdc-slider__pin';
      const slider = element.shadowRoot!.querySelector('.mdc-slider')!;
      let pin = element.shadowRoot!.querySelector(pinSelector);
      assert.equal(pin, null);
      element.pin = true;
      element.step = 1;
      await element.updateComplete;
      await rafPromise();

      // arrow up keycode
      const upEv = ieSafeKeyboardEvent('keydown', 38);
      slider.dispatchEvent(upEv);

      await element.updateComplete;
      await rafPromise();
      pin = element.shadowRoot!.querySelector(pinSelector);
      const pinText = pin!.querySelector('.mdc-slider__pin-value-marker')!;
      assert.instanceOf(pin, Element);
      assert.equal(pinText.textContent, '1');
    });
  });

  suite('min-max-value initializations', () => {
    teardown(() => {
      fixt.remove();
    });

    test('vals set correctly when explicitly set to defaults', async () => {
      fixt = await fixture(slider(), {afterRender});
      element = fixt.root.querySelector('mwc-slider')!;

      assert.equal(element.min, 0);
      assert.equal(element.max, 100);
      assert.equal(element.value, 0);
    });

    test('can set min max over 100', async () => {
      fixt = await fixture(
          slider({min: 101, max: 103, value: 102}), {afterRender});
      element = fixt.root.querySelector('mwc-slider')!;

      assert.equal(element.min, 101);
      assert.equal(element.max, 103);
      assert.equal(element.value, 102);
    });

    test('can set min max below 0', async () => {
      fixt =
          await fixture(slider({min: -3, max: -1, value: -2}), {afterRender});
      element = fixt.root.querySelector('mwc-slider')!;

      assert.equal(element.min, -3);
      assert.equal(element.max, -1);
      assert.equal(element.value, -2);
    });

    test('value below min', async () => {
      fixt =
          await fixture(slider({min: 101, max: 103, value: 99}), {afterRender});
      element = fixt.root.querySelector('mwc-slider')!;

      assert.equal(element.min, 101);
      assert.equal(element.max, 103);
      assert.equal(element.value, 101);
    });

    test('value above max', async () => {
      fixt = await fixture(slider({min: -3, max: -1, value: 1}), {afterRender});
      element = fixt.root.querySelector('mwc-slider')!;

      assert.equal(element.min, -3);
      assert.equal(element.max, -1);
      assert.equal(element.value, -1);
    });
  });
});
