/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './menu.js';
import './menu-button.js';
import './menu-item.js';
import '../button/filled-button.js';

import {html} from 'lit';

import {ButtonHarness} from '../button/harness.js';
import {Environment} from '../testing/environment.js';

import {MenuHarness} from './harness.js';

describe('menu tests', () => {
  const env = new Environment();

  it('on render, sets menu anchor to slotted button', async () => {
    const el = env.render(getMenuButtonTemplate());
    const menu = el.querySelector('md-menu')!;
    const buttonSlot = el.querySelector<HTMLElement>('[slot="button"]')!;

    await menu.updateComplete;
    expect(menu.anchor).toBe(buttonSlot);
  });

  it('on button click, opens the menu if menu is not open', async () => {
    const {buttonHarness, menu} = await setUp(env);

    await buttonHarness.clickWithMouse();
    await menu.updateComplete;
    expect(menu.open).toBeTrue();
  });

  it('on button click, closes the menu if menu is open', async () => {
    const {buttonHarness, menu} = await setUp(env);

    // Click button to open menu.
    await buttonHarness.clickWithMouse();
    await menu.updateComplete;
    expect(menu.open).toBeTrue();

    // Click button again to close menu.
    await buttonHarness.clickWithMouse();
    await menu.updateComplete;
    expect(menu.open).toBeFalse();
  });

  it('on button click, sets default focus to menu root', async () => {
    const {buttonHarness, menu} = await setUp(env);

    await buttonHarness.clickWithMouse();
    await menu.updateComplete;
    expect(document.activeElement).toBe(menu);
  });

  it('on synthetic button click, sets default focus to FIRST_ITEM',
     async () => {
       const {button, menu, menuHarness} = await setUp(env);

       // Simulate synthetic click.
       const buttonEl = button.renderRoot.querySelector('button')!;
       buttonEl.dispatchEvent(
           new PointerEvent('click', {bubbles: true, composed: true}));
       await menu.updateComplete;
       const firstMenuItem = menuHarness.getItems()[0].element;
       expect(document.activeElement).toBe(firstMenuItem);
     });

  it('on non-ArrowUp/ArrowDown key event, does not open the menu', async () => {
    const {buttonHarness, menu} = await setUp(env);

    await buttonHarness.keypress('a');
    await menu.updateComplete;
    expect(menu.open).toBeFalse();
  });

  it('on ArrowUp key event, opens the menu and sets default focus to LAST_ITEM',
     async () => {
       const {buttonHarness, menu, menuHarness} = await setUp(env);

       await buttonHarness.keypress('ArrowUp');
       await menu.updateComplete;
       const items = menuHarness.getItems();
       const lastMenuItem = items[items.length - 1].element;
       expect(menu.open).toBeTrue();
       expect(document.activeElement).toBe(lastMenuItem);
     });

  it('on ArrowDown key event, opens the menu and sets default focus to FIRST_ITEM',
     async () => {
       const {buttonHarness, menu, menuHarness} = await setUp(env);

       await buttonHarness.keypress('ArrowDown');
       await menu.updateComplete;
       const firstMenuItem = menuHarness.getItems()[0].element;
       expect(menu.open).toBeTrue();
       expect(document.activeElement).toBe(firstMenuItem);
     });
});

async function setUp(env: Environment) {
  const el = env.render(getMenuButtonTemplate());
  const menu = el.querySelector('md-menu')!;
  const menuHarness = await new MenuHarness(menu);
  const button = el.querySelector('md-filled-button')!;
  const buttonHarness = await new ButtonHarness(button);
  await env.waitForStability();

  return {menu, menuHarness, button, buttonHarness};
}

function getMenuButtonTemplate() {
  return html`
    <md-menu-button>
      <button slot="button">
        <md-filled-button .label=${'Open Menu'}></md-filled-button>
      </button>
      <md-menu slot="menu" .quick=${true}>
        <md-menu-item .headline=${'One'}></md-menu-item>
        <md-menu-item .headline=${'Two'}></md-menu-item>
        <md-menu-item .headline=${'Three'}></md-menu-item>
      </md-menu>
    </md-menu-button>
  `;
}
