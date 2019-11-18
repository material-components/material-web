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

import {LinearProgress} from '@material/mwc-linear-progress';


suite('mwc-linear-progress', () => {
  let element: LinearProgress;

  setup(() => {
    element = document.createElement('mwc-linear-progress');
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-linear-progress', () => {
    assert.instanceOf(element, LinearProgress);
  });

  test(
      'sets `aria-label` of the progress bar when `ariaLabel` is set',
      async () => {
        element.ariaLabel = 'Unit Test Progress Bar';
        await element.updateComplete;
        const progressBar =
            element.shadowRoot!.querySelector('.mdc-linear-progress');
        assert.equal(
            progressBar!.getAttribute('aria-label'), 'Unit Test Progress Bar');
      });
});
