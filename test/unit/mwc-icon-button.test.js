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

import {assert} from 'chai';
import {IconButton} from '@material/mwc-icon-button';

const ICON_SELECTOR = '.mdc-icon-button__icon.mdc-icon-button__icon--on';
const OFF_ICON_SELECTOR = '.mdc-icon-button__icon:not(.mdc-icon-button__icon--on)';

let element;

suite('mwc-icon-button');

beforeEach(() => {
  element = document.createElement('mwc-icon-button');
  document.body.appendChild(element);
});

afterEach(() => {
  document.body.removeChild(element);
});

test('initializes as an mwc-icon-button', () => {
  assert.instanceOf(element, IconButton);
});

test('setting `icon` updates the textContent inside <i class="mdc-icon-button__icon mdc-icon-button__icon--on">', async () => {
  let icon = 'check';
  element.icon = icon;
  await element.updateComplete;
  const i = element.shadowRoot.querySelector(ICON_SELECTOR);
  assert.equal(i.textContent, icon);

  icon = 'menu';
  element.icon = icon;
  await element.updateComplete;
  assert.equal(i.textContent, icon);
});

test('setting `offIcon` updates the textContent inside <i class="mdc-icon-button__icon">', async () => {
  let icon = 'check';
  element.offIcon = icon;
  await element.updateComplete;
  const i = element.shadowRoot.querySelector(OFF_ICON_SELECTOR);
  assert.equal(i.textContent, icon);

  icon = 'menu';
  element.offIcon = icon;
  await element.updateComplete;
  assert.equal(i.textContent, icon);
});

test('setting `label` updates the aria-label attribute on the native button element', async () => {
  let label = 'hello';
  element.label = label;
  await element.updateComplete;
  const button = element.shadowRoot.querySelector('button');
  assert.equal(button.getAttribute('aria-label'), label);
});

test('setting `on` updates the aria-pressed attribute on the native button element', async () => {
  element.icon = 'alarm_on';
  element.offIcon = 'alarm_off';

  element.on = true;
  await element.updateComplete;
  let button = element.shadowRoot.querySelector('button');
  assert.equal(button.getAttribute('aria-pressed'), 'true');

  element.on = false;
  await element.updateComplete;
  assert.equal(button.getAttribute('aria-pressed'), 'false');
});

test('setting `disabled` updates the disabled attribute on the native button element', async () => {
  element.disabled = true;
  await element.updateComplete;
  const button = element.shadowRoot.querySelector('button');
  assert.equal(button.hasAttribute('disabled'), true);

  element.disabled = false;
  await element.updateComplete;
  assert.equal(button.hasAttribute('disabled'), false);
});
