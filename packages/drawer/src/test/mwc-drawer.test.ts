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

import {Drawer} from '@material/mwc-drawer';

const SCRIM_SELECTOR = '.mdc-drawer-scrim';
const HEADER_SELECTOR = '.mdc-drawer__header';
const DISMISSIBLE_CLASS = 'mdc-drawer--dismissible';

suite('mwc-drawer', () => {
  let element: Drawer;

  setup(async () => {
    element = document.createElement('mwc-drawer');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  teardown(() => {
    element.remove();
  });

  test('initializes as an mwc-drawer', () => {
    assert.instanceOf(element, Drawer);
  });

  test('`hasHeader` should display a header if set', async () => {
    let header = element.shadowRoot!.querySelector(HEADER_SELECTOR);
    assert.equal(header, null);
    element.hasHeader = true;
    await element.updateComplete;
    header = element.shadowRoot!.querySelector(HEADER_SELECTOR);
    assert.instanceOf(header, Element);
    element.hasHeader = false;
    await element.updateComplete;
    header = element.shadowRoot!.querySelector(HEADER_SELECTOR);
    assert.equal(header, null);
  });

  test('modal `type` should display scrim', async () => {
    const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
    let scrim = element.shadowRoot!.querySelector(SCRIM_SELECTOR)!;
    assert.equal(scrim, null);
    assert.isFalse(drawer.classList.contains('mdc-drawer--modal'));
    element.type = 'modal';
    await element.updateComplete;
    scrim = element.shadowRoot!.querySelector(SCRIM_SELECTOR)!;
    assert.instanceOf(scrim, Element);
    assert.isTrue(drawer.classList.contains('mdc-drawer--modal'));
  });

  test('dismissible `type` should set correct classes', async () => {
    const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
    assert.isFalse(drawer.classList.contains(DISMISSIBLE_CLASS));
    element.type = 'dismissible';
    await element.updateComplete;
    assert.isTrue(drawer.classList.contains(DISMISSIBLE_CLASS));
  });
});
