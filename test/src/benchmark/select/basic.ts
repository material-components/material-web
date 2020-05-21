/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';

import {ListItem} from '@material/mwc-list/mwc-list-item';
import {Select} from '@material/mwc-select';
import {html} from 'lit-html';

import {measureFixtureCreation} from '../../util/helpers';

const renderCheck = async (root: ShadowRoot) => {
  const select = root.firstElementChild as Select;
  const lastItem = select.lastElementChild as ListItem;

  await lastItem.updateComplete;
  await select.updateComplete;
};

measureFixtureCreation(
    html`
  <mwc-select outlined label="Outlined">
    <mwc-list-item></mwc-list-item>
    <mwc-list-item selected value="a">Apple</mwc-list-item>
    <mwc-list-item value="b">Banana</mwc-list-item>
    <mwc-list-item value="c">Cucumber</mwc-list-item>
  </mwc-select>
`,
    {renderCheck});
