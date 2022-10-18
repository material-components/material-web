/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './menu.js';
import './menu-item.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';

import {MenuHarness} from './harness.js';
import {MdMenu} from './menu.js';

describe('menu tests', () => {
  let menu: MdMenu;
  let harness: MenuHarness;
  let anchor: HTMLButtonElement;
  const env = new Environment();

  beforeEach(async () => {
    ({menu, harness, anchor} = await setUp(env));
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

  describe('focus management', () => {
    it('with `defaultFocus=FIRST_ITEM`, focuses on first menu item on open',
       async () => {
         ({menu, harness} = await setUp(env, {defaultFocus: 'FIRST_ITEM'}));
         menu.show();
         await menu.updateComplete;

         const firstItem = harness.getItems()[0].element;
         expect(document.activeElement).toBe(firstItem);
       });

    it('with `defaultFocus=LAST_ITEM`, focuses on last menu item on open',
       async () => {
         ({menu, harness} = await setUp(env, {defaultFocus: 'LAST_ITEM'}));
         menu.show();
         await menu.updateComplete;

         const items = harness.getItems();
         const lastItem = items[items.length - 1].element;
         expect(document.activeElement).toBe(lastItem);
       });

    it('with `defaultFocus=LIST_ROOT`, focuses on menu root on open',
       async () => {
         ({menu} = await setUp(env, {defaultFocus: 'LIST_ROOT'}));
         menu.show();
         await menu.updateComplete;

         expect(document.activeElement).toBe(menu);
       });

    it('on TAB, closes the menu without restoring focus to the anchor',
       async () => {
         anchor.focus();
         expect(document.activeElement).toBe(anchor);

         menu.show();
         await menu.updateComplete;
         expect(document.activeElement).not.toBe(anchor);

         const menuSurface = menu.renderRoot.querySelector('md-menu-surface')!;
         menuSurface.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
         expect(menu.open).toBe(false);
         expect(document.activeElement).not.toBe(anchor);
       });

    it('on ESC, closes the menu and restores focus to the anchor', async () => {
      anchor.focus();
      expect(document.activeElement).toBe(anchor);

      menu.show();
      await menu.updateComplete;
      expect(document.activeElement).not.toBe(anchor);

      const menuSurface = menu.renderRoot.querySelector('md-menu-surface')!;
      menuSurface.mdcRoot.dispatchEvent(
          new KeyboardEvent('keydown', {key: 'Escape'}));
      expect(menu.open).toBe(false);
      expect(document.activeElement).not.toBe(anchor);
    });
  });
});

async function setUp(env: Environment, propsInit: Partial<MdMenu> = {}) {
  const el = env.render(getMenuTemplate(propsInit));
  const menu = el.querySelector('md-menu')!;
  const harness = await new MenuHarness(menu);
  const anchor = el.querySelector('button')!;
  await env.waitForStability();

  return {menu, harness, anchor};
}

function getMenuTemplate(propsInit: Partial<MdMenu> = {}) {
  return html`
    <div class="root" style="position: relative;">
      <button @click=${setAnchorAndOpen}>
        Open Menu
      </button>
      <md-menu .quick="${propsInit.quick ?? true}"
          .defaultFocus="${propsInit.defaultFocus ?? 'LIST_ROOT'}">
        <md-menu-item .headline=${'One'}></md-menu-item>
        <md-menu-item .headline=${'Two'}></md-menu-item>
        <md-menu-item .headline=${'Three'}></md-menu-item>
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
