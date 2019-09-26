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

import {Snackbar} from '@material/mwc-snackbar';

suite('mwc-snackbar', () => {
  let element: Snackbar;

  setup(() => {
    element = document.createElement('mwc-snackbar');
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-snackbar', () => {
    assert.instanceOf(element, Snackbar);
  });

  const findLabelText = () => {
    // Note that label text can either be in the label's textContent, or in its
    // ::before pseudo-element content (set via an attribute), for ARIA reasons.
    const label = element.shadowRoot!.querySelector('.mdc-snackbar__label')!;
    return label.getAttribute('data-mdc-snackbar-label-text') ||
        label.textContent;
  };

  test('set label text after opening', async () => {
    element.labelText = 'foo';
    element.open();
    await element.updateComplete;
    assert.equal(findLabelText(), 'foo');

    element.labelText = 'bar';
    await element.updateComplete;
    assert.equal(findLabelText(), 'bar');

    element.labelText = 'baz';
    await element.updateComplete;
    assert.equal(findLabelText(), 'baz');
  });
});
