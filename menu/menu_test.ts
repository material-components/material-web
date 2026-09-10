/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './menu.js';
import './sub-menu.js';

import {html, render} from 'lit';

import {createTokenTests} from '../testing/tokens.js';

import {MenuItemHarness} from './harness.js';
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
      root,
    );

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
      cancelable: true,
    });
    menu.dispatchEvent(escapeKeydownEvent);

    await menu.updateComplete;

    expect(menu.open).toBeFalse();
    expect(escapeKeydownEvent.defaultPrevented).toBeTrue();
  });

  // Regression test for b/314706578.
  it('escape on submenu items closes menu', async () => {
    render(
      html`
        <button>OpenMenu</button>
        <md-menu quick>
          <md-sub-menu hover-open-delay="0" hover-close-delay="0">
            <md-menu-item id="submenu-item" slot="item">
              <div slot="headline">Link Item 1</div>
            </md-menu-item>
            <md-menu quick slot="menu">
              <md-menu-item slot="item">
                <div slot="headline">Submenu Item 1</div>
              </md-menu-item>
            </md-menu>
          </md-sub-menu>
        </md-menu>
      `,
      root,
    );

    const button = root.querySelector('button')!;
    const menu = root.querySelector('md-menu')!;
    const submenuItemHarness = new MenuItemHarness(
      menu.querySelector('#submenu-item')!,
    );
    menu.anchorElement = button;
    menu.show();

    expect(menu.open).toBeTrue();

    const escapeKeydownEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    const interactiveElement = await submenuItemHarness.getInteractiveElement();
    interactiveElement.dispatchEvent(escapeKeydownEvent);

    await menu.updateComplete;

    expect(menu.open).toBeFalse();
    expect(escapeKeydownEvent.defaultPrevented).toBeTrue();
  });
});

describe('<md-menu-item>', () => {
  describe('.styles', () => {
    createTokenTests(MdMenuItem.styles);
  });

  describe('rel and referrerpolicy', () => {
    it('omits rel and referrerpolicy when unset', async () => {
      const item = new MdMenuItem();
      item.href = 'https://example.com';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
      expect(anchor.hasAttribute('referrerpolicy')).toBeFalse();
      item.remove();
    });

    it('propagates rel and referrerpolicy to the anchor tag', async () => {
      const item = new MdMenuItem();
      item.href = 'https://example.com';
      item.rel = 'noopener noreferrer';
      item.referrerPolicy = 'no-referrer';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe('no-referrer');
      item.remove();
    });

    it('reflects rel and referrerpolicy attributes to properties and anchor', async () => {
      const item = new MdMenuItem();
      item.setAttribute('href', 'https://example.com');
      item.setAttribute('rel', 'noreferrer');
      item.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      document.body.appendChild(item);
      await item.updateComplete;

      expect(item.rel).toBe('noreferrer');
      expect(item.referrerPolicy).toBe('strict-origin-when-cross-origin');

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe(
        'strict-origin-when-cross-origin',
      );
      item.remove();
    });

    it('does not default rel when target="_blank"', async () => {
      const item = new MdMenuItem();
      item.href = 'https://example.com';
      item.target = '_blank';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
      item.remove();
    });
  });
});
