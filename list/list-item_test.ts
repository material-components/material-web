/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './list-item.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';

const LIST_ITEM_TEMPLATE = html`
     <md-list-item>One</md-list-item>
 `;

describe('list item tests', () => {
  const env = new Environment();

  it('`activate()` should focus the list item', async () => {
    const listItem =
        env.render(LIST_ITEM_TEMPLATE).querySelector('md-list-item')!;
    await env.waitForStability();

    listItem.activate();
    expect(document.activeElement).toEqual(listItem);
  });

  it('`deactivate()` should set root tab index to -1', async () => {
    const listItem =
        env.render(LIST_ITEM_TEMPLATE).querySelector('md-list-item')!;
    await env.waitForStability();

    listItem.deactivate();
    expect(listItem.shadowRoot!.querySelector('[tabindex]')!.getAttribute(
               'tabindex'))
        .toBe('-1');
  });

  it('setting `role` attribute sets role on <li> element', async () => {
    const listItem =
        env.render(html`<md-list-item role="menuitem">One</md-list-item>`)
            .querySelector('md-list-item')!;
    await env.waitForStability();

    expect(listItem.shadowRoot!.querySelector('li')!.getAttribute('role'))
        .toBe('menuitem');
  });
});
