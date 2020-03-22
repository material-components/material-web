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

import {Fake, rafPromise} from '../../../../test/src/util/helpers';

suite('mwc-slider', () => {
  let element: Slider;

  setup(async () => {
    element = document.createElement('mwc-slider');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  teardown(() => {
    element.remove();
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
    const inputHandler = new Fake<[], void>();
    const changeHandler = new Fake<[], void>();
    element.addEventListener('input', inputHandler.handler);
    element.addEventListener('change', changeHandler.handler);

    slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
    await element.updateComplete;
    await rafPromise();
    assert.isTrue(inputHandler.called);
    assert.isTrue(changeHandler.called);
    assert.equal(element.value, 1);

    slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
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
    slider.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
    await element.updateComplete;
    await rafPromise();
    pin = element.shadowRoot!.querySelector(pinSelector);
    const pinText = pin!.querySelector('.mdc-slider__pin-value-marker')!;
    assert.instanceOf(pin, Element);
    assert.equal(pinText.textContent, '1');
  });
});
