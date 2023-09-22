/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './menu.js';

import {html, render} from 'lit';

import {createTokenTests} from '../testing/tokens.js';

import {MdMenu} from './menu.js';
import {MdMenuItem} from './menu-item.js';

describe('<md-menu>', () => {
  describe('.styles', () => {
    createTokenTests(MdMenu.styles);
  });

  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root?.remove();
  });

  it('escape on list root closes menu', async () => {
    render(
        html`
      <button>OpenMenu</button>
      <md-menu quick></md-menu>
    `,
        root);

    const button = root.querySelector('button')!;
    const menu = root.querySelector('md-menu')!;
    menu.anchorElement = button;
    menu.show();

    expect(menu.open).toBeTrue();

    const escapeKeydownEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      composed: true,
      cancelable: true
    });
    menu.dispatchEvent(escapeKeydownEvent);

    await menu.updateComplete;

    expect(menu.open).toBeFalse();
    expect(escapeKeydownEvent.defaultPrevented).toBeTrue();
  });
});

describe('<md-menu-item>', () => {
  describe('.styles', () => {
    createTokenTests(MdMenuItem.styles);
  });
});
