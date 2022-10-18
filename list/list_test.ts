/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './list.js';
import './list-item.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';

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
    const list = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await list.updateComplete;

    expect(list.items.length).toBe(3);
  });

  it('focusListRoot() should focus on the list element', async () => {
    const list = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await list.updateComplete;

    list.focusListRoot();
    expect(document.activeElement).toEqual(list);
  });

  it('activateFirstItem() should focus on the first list item', async () => {
    const list = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await list.updateComplete;

    list.activateFirstItem();
    expect(document.activeElement).toEqual(list.items[0]);
  });

  it('activateLastItem() should focus on the last list item', async () => {
    const list = env.render(LIST_TEMPLATE).querySelector('md-list')!;
    await list.updateComplete;

    list.activateLastItem();
    expect(document.activeElement).toEqual(list.items[list.items.length - 1]);
  });

  it('setting `role` attribute sets role on <ul> element', async () => {
    const listItem = env.render(html`<md-list role="menu"></md-list>`)
                         .querySelector('md-list')!;
    await env.waitForStability();

    expect(listItem.shadowRoot!.querySelector('ul')!.getAttribute('role'))
        .toBe('menu');
  });

  it('setting `aria-label` attribute sets aria-label on <ul> element',
     async () => {
       const listItem = env.render(html`<md-list aria-label="foo"></md-list>`)
                            .querySelector('md-list')!;
       await env.waitForStability();

       expect(
           listItem.shadowRoot!.querySelector('ul')!.getAttribute('aria-label'))
           .toBe('foo');
     });
});
