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
import {CircularProgress} from '@material/mwc-circular-progress';

const INDETERMINATE_CLASS = 'mdc-circular-progress--indeterminate';

suite('mwc-circular-progress', () => {
  let element: CircularProgress;

  setup(() => {
    element = document.createElement('mwc-circular-progress');
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-circular-progress', () => {
    assert.instanceOf(element, CircularProgress);
  });

  test('sets `aria-label`', async () => {
    element.ariaLabel = 'Unit Test Progress Bar';
    await element.updateComplete;
    const progressBar =
        element.shadowRoot!.querySelector('.mdc-circular-progress');
    assert.equal(
        progressBar!.getAttribute('aria-label'), 'Unit Test Progress Bar');
  });

  test('open sets closed to false', async () => {
    element.closed = true;
    element.open();
    assert.equal(element.closed, false);
  });

  test('close sets closed to true', async () => {
    element.closed = false;
    element.close();
    assert.equal(element.closed, true);
  });

  test('`progress` sets inner progress', async () => {
    element.progress = 0.5;
    await element.updateComplete;
    const progressBar =
        element.shadowRoot!.querySelector('.mdc-circular-progress')!;
    assert.equal(progressBar.getAttribute('aria-valuenow'), '0.5');
  });

  test('`indeterminate` sets correct inner class', async () => {
    await element.updateComplete;
    const progressBar =
        element.shadowRoot!.querySelector('.mdc-circular-progress')!;
    assert.isFalse(progressBar.classList.contains(INDETERMINATE_CLASS));
    element.indeterminate = true;
    await element.updateComplete;
    assert.isTrue(progressBar.classList.contains(INDETERMINATE_CLASS));
  });
});
