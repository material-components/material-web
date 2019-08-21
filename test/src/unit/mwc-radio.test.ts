/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import {Radio} from '@material/mwc-radio';
import {html, render} from 'lit-html';

let container;

suite('mwc-radio');

before(() => {
  container = document.createElement('main');
  document.body.appendChild(container);
});

afterEach(() => {
  render(html``, container);
});

after(() => {
  document.body.removeChild(container);
});

test('initializes as an mwc-radio', () => {
  const radio = document.createElement('mwc-radio');
  container.appendChild(radio);
  assert.instanceOf(radio, Radio);
});

suite('manages selection groups', () => {
  test('synchronously', async () => {
    render(
        html`
        <mwc-radio id="a1" name="a"></mwc-group>
        <mwc-radio id="a2" name="a"></mwc-group>
        <mwc-radio id="b1" name="b"></mwc-group>
        `,
        container);

    const [a1, a2, b1] = [...container.querySelectorAll('mwc-radio')];

    assert.isFalse(a1.checked);
    assert.isFalse(a2.checked);
    assert.isFalse(b1.checked);

    a2.checked = true;
    a1.checked = true;
    assert.isTrue(a1.checked);
    assert.isFalse(a2.checked);
    assert.isFalse(b1.checked);

    a2.checked = true;
    a1.checked = true;
    a2.checked = true;
    assert.isFalse(a1.checked);
    assert.isTrue(a2.checked);
    assert.isFalse(b1.checked);

    a1.checked = true;
    assert.isTrue(a1.checked);
    assert.isFalse(a2.checked);
    assert.isTrue(b1.checked);

    b1.checked = true;
    assert.isFalse(a1.checked);
    assert.isTrue(a2.checked);
    assert.isTrue(b1.checked);

    a2.checked = false;
    b1.checked = false;
    assert.isFalse(a1.checked);
    assert.isFalse(a2.checked);
    assert.isFalse(b1.checked);
  });

  test('after updates settle', async () => {
    render(
        html`
        <mwc-radio id="a1" name="a"></mwc-group>
        <mwc-radio id="a2" name="a"></mwc-group>
        <mwc-radio id="b1" name="b"></mwc-group>
        `,
        container);

    const radios = [...container.querySelectorAll('mwc-radio')];
    const [a1, a2, b1] = radios;
    const allUpdatesComplete = () =>
        Promise.all(radios.map((radio) => radio.updateComplete));

    await allUpdatesComplete();
    assert.isFalse(a1.checked);
    assert.isFalse(a2.checked);
    assert.isFalse(b1.checked);

    a2.checked = true;
    a1.checked = true;
    await allUpdatesComplete();
    assert.isTrue(a1.checked);
    assert.isFalse(a2.checked);
    assert.isFalse(b1.checked);

    a2.checked = true;
    a1.checked = true;
    a2.checked = true;
    await allUpdatesComplete();
    assert.isFalse(a1.checked);
    assert.isTrue(a2.checked);
    assert.isFalse(b1.checked);

    a1.checked = true;
    assert.isTrue(a1.checked);
    assert.isFalse(a2.checked);
    assert.isTrue(b1.checked);

    b1.checked = true;
    await allUpdatesComplete();
    assert.isFalse(a1.checked);
    assert.isTrue(a2.checked);
    assert.isTrue(b1.checked);

    a2.checked = false;
    b1.checked = false;
    await allUpdatesComplete();
    assert.isFalse(a1.checked);
    assert.isFalse(a2.checked);
    assert.isFalse(b1.checked);
  });
});
