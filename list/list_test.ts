/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './list';
import './list-item';

import {Environment} from '@material/web/testing/environment';
import {html} from 'lit';

const LIST_TEMPLATE = html`
  <md-list>
    <md-list-item>One</md-list-item>
    <md-list-item>Two</md-list-item>
    <md-list-item>Three</md-list-item>
  </md-list>
`;

describe('list tests', () => {
  const env = new Environment();

  it('`items` property returns correct items', async () => {
    const element = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await env.waitForStability();

    expect(element.items.length).toBe(3);
  });

  it('focusListRoot() should focus on the list element', async () => {
    const list = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await env.waitForStability();

    list.focusListRoot();
    expect(document.activeElement).toEqual(list);
  });

  it('activateFirstItem() should focus on the first list item', async () => {
    const list = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await env.waitForStability();

    list.activateFirstItem();
    expect(document.activeElement).toEqual(list.items[0]);
  });

  it('activateLastItem() should focus on the last list item', async () => {
    const list = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await env.waitForStability();

    list.activateLastItem();
    expect(document.activeElement).toEqual(list.items[list.items.length - 1]);
  });
});
