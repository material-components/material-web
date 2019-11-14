/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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


suite('mwc-radio', () => {
  let container: HTMLElement;

  suiteSetup(() => {
    container = document.createElement('main');
    document.body.appendChild(container);
  });

  teardown(() => {
    render(html``, container);
  });

  suiteTeardown(() => {
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
          <mwc-radio id="a1" name="a"></mwc-radio>
          <mwc-radio id="a2" name="a"></mwc-radio>
          <mwc-radio id="b1" name="b"></mwc-radio>
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
      assert.isFalse(b1.checked);

      b1.checked = true;
      assert.isTrue(a1.checked);
      assert.isFalse(a2.checked);
      assert.isTrue(b1.checked);

      a1.checked = false;
      b1.checked = false;
      assert.isFalse(a1.checked);
      assert.isFalse(a2.checked);
      assert.isFalse(b1.checked);
    });

    test('after updates settle', async () => {
      render(
          html`
          <mwc-radio id="a1" name="a"></mwc-radio>
          <mwc-radio id="a2" name="a"></mwc-radio>
          <mwc-radio id="b1" name="b"></mwc-radio>
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
      assert.isFalse(b1.checked);

      b1.checked = true;
      await allUpdatesComplete();
      assert.isTrue(a1.checked);
      assert.isFalse(a2.checked);
      assert.isTrue(b1.checked);

      a1.checked = false;
      b1.checked = false;
      await allUpdatesComplete();
      assert.isFalse(a1.checked);
      assert.isFalse(a2.checked);
      assert.isFalse(b1.checked);
    });

    test('when checked before connected', () => {
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
      assert.isTrue(r1.checked);
      assert.isTrue(r2.checked);
      assert.isFalse(r3.checked);

      // Connecting r1 shouldn't change anything, since it's the only one in the
      // group.
      container.appendChild(r1);
      assert.isTrue(r1.checked);
      assert.isTrue(r2.checked);
      assert.isFalse(r3.checked);

      // Appending r2 should disable r1, because when a new checked radio is
      // connected, it wins (this matches native input behavior).
      container.appendChild(r2);
      assert.isFalse(r1.checked);
      assert.isTrue(r2.checked);
      assert.isFalse(r3.checked);

      // Appending r3 shouldn't change anything, because it's not checked.
      container.appendChild(r3);
      assert.isFalse(r1.checked);
      assert.isTrue(r2.checked);
      assert.isFalse(r3.checked);

      // Checking r3 should uncheck r2 because it's now in the same group.
      r3.checked = true;
      assert.isFalse(r1.checked);
      assert.isFalse(r2.checked);
      assert.isTrue(r3.checked);
    });

    test('in a lit repeat', () => {
      const values = ['a1', 'a2'];
      render(
          html`${
              values.map(
                  (value) =>
                      html`<mwc-radio value=${value} name="a"></mwc-radio>`)}`,
          container);
      const [a1, a2] = container.querySelectorAll('mwc-radio');

      assert.isFalse(a1.checked);
      assert.isFalse(a2.checked);
      assert.equal(a1.value, values[0]);
      assert.equal(a2.value, values[1]);

      a1.checked = true;
      assert.isTrue(a1.checked);
      assert.isFalse(a2.checked);

      a2.checked = true;
      assert.isFalse(a1.checked);
      assert.isTrue(a2.checked);

      a2.checked = false;
      assert.isFalse(a1.checked);
      assert.isFalse(a2.checked);
    });
  });
});
