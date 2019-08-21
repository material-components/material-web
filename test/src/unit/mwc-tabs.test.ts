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
import {Tab} from '@material/mwc-tab';
import {TabBar} from '@material/mwc-tab-bar/mwc-tab-bar.js';
import {TabScroller} from '@material/mwc-tab-scroller/mwc-tab-scroller.js';

let element;

suite('mwc-tab');

beforeEach(() => {
  element = document.createElement('mwc-tab');
  document.body.appendChild(element);
});

afterEach(() => {
  document.body.removeChild(element);
});

test('initializes as an mwc-tab', () => {
  assert.instanceOf(element, Tab);
});

suite('mwc-tab-bar');

beforeEach(() => {
  element = document.createElement('mwc-tab-bar');
  document.body.appendChild(element);
});

afterEach(() => {
  document.body.removeChild(element);
});

test('initializes as an mwc-tab-bar', () => {
  assert.instanceOf(element, TabBar);
});

suite('mwc-tab-scroller');

beforeEach(() => {
  element = document.createElement('mwc-tab-scroller');
  document.body.appendChild(element);
});

afterEach(() => {
  document.body.removeChild(element);
});

test('initializes as an mwc-tab-scroller', () => {
  assert.instanceOf(element, TabScroller);
});
