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
import '@material/mwc-menu';
import '@material/mwc-list/mwc-list-item';

import {ListItem} from '@material/mwc-list/mwc-list-item';
import {Menu} from '@material/mwc-menu';
import {html} from 'lit-html';

import {measureFixtureCreation} from '../../util/helpers';

const renderCheck = async (root: ShadowRoot) => {
  const menu = root.firstElementChild as Menu;
  const lastItem = menu.lastElementChild as ListItem;

  await lastItem.updateComplete;
  await menu.updateComplete;
};

const afterRender = async (root: ShadowRoot) => {
  const menu = root.firstElementChild as Menu;
  const anchor = root.lastElementChild as HTMLElement;

  menu.anchor = anchor;
};

measureFixtureCreation(
    html`
  <mwc-menu>
    <mwc-list-item selected value="a">Apple</mwc-list-item>
    <mwc-list-item value="b">Banana</mwc-list-item>
    <mwc-list-item value="c">Cucumber</mwc-list-item>
  </mwc-menu>
  <div id="anchor"></div>
`,
    {renderCheck, afterRender});
