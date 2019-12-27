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

import {LayoutGrid} from '@material/mwc-layout-grid';

const SLOT_SELECTOR = 'slot[name=\'slot0\']';


suite('mwc-layout-grid', () => {
  /** @type {HTMLElement} */
  let element: LayoutGrid;

  /** @type {HTMLElement} */
  let content: HTMLElement;

  setup(() => {
    element = document.createElement('mwc-layout-grid');
    document.body.appendChild(element);

    content = document.createElement('div');
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-layout-grid', () => {
    assert.instanceOf(element, LayoutGrid);
  });

  test('adding new content to grid', async () => {
    element.appendChild(content);
    await element.updateComplete;
    const i = element.shadowRoot!.querySelector(SLOT_SELECTOR)!;
    assert.instanceOf(i, HTMLElement);
    assert.equal(content.hasAttribute('slot'), true);
    assert.equal(content.getAttribute('slot'), 'slot0');
  });

  test('removing content from grid', async () => {
    element.appendChild(content);
    await element.updateComplete;

    element.removeChild(content);
    await element.updateComplete;
    const i = element.shadowRoot!.querySelector(SLOT_SELECTOR);
    assert.equal(i, null);
  });
});
