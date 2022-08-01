/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './menu';
import '../list/list-item';

import {Environment} from '@material/web/testing/environment';
import {html} from 'lit';

import {MenuHarness} from './harness';
import {MdMenu} from './menu';

describe('menu tests', () => {
  let menu: MdMenu;
  let harness: MenuHarness;
  const env = new Environment();

  beforeEach(async () => {
    const el = env.render(getMenuTemplate());
    menu = el.querySelector('md-menu')!;
    harness = await new MenuHarness(menu);
    await env.waitForStability();
  });

  describe('open/close', () => {
    it('`show` method opens menu', async () => {
      menu.show();
      await menu.updateComplete;
      expect(menu.open).toBe(true);
    });

    it('close method closes menu', async () => {
      menu.show();
      await menu.updateComplete;

      menu.close();
      await menu.updateComplete;
      expect(menu.open).toBe(false);
    });

    it('closes the menu on click outside the menu', async () => {
      menu.show();
      await menu.updateComplete;

      document.body.dispatchEvent(new MouseEvent('click'));
      await menu.updateComplete;
      expect(menu.open).toBe(false);
    });

    it('closes the menu on click on menu item', async () => {
      menu.show();
      await menu.updateComplete;

      const item = harness.getItems()[0];
      await item.clickWithMouse();
      expect(menu.open).toBe(false);
    });

    it('closes the menu on TAB keypress', async () => {
      menu.show();
      await menu.updateComplete;

      const menuSurface = menu.renderRoot.querySelector('md-menu-surface')!;
      menuSurface.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
      expect(menu.open).toBe(false);
    });

    it('closes the menu on ESC keypress', async () => {
      menu.show();
      await menu.updateComplete;

      const menuSurface = menu.renderRoot.querySelector('md-menu-surface')!;
      menuSurface.mdcRoot.dispatchEvent(
          new KeyboardEvent('keydown', {key: 'Escape'}));
      expect(menu.open).toBe(false);
    });
  });
});

function getMenuTemplate(propsInit: Partial<MdMenu> = {}) {
  return html`
    <div class="root" style="position: relative;">
      <button @click=${setAnchorAndOpen}>
        Open Menu
      </button>
      <md-menu .quick="${propsInit.quick ?? true}">
        <md-list-item>One</md-list-item>
        <md-list-item>Two</md-list-item>
        <md-list-item>Three</md-list-item>
      </md-menu>
    </div>
  `;
}

function setAnchorAndOpen(e: MouseEvent) {
  const target = e.target as HTMLButtonElement;
  const menu = target.nextElementSibling as MdMenu;
  if (!menu.anchor) {
    menu.anchor = target;
  }
  menu.show();
}