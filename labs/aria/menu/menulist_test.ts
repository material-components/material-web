/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="../../../types/popover.d.ts" />

// import 'jasmine'; (google3-only)

import './md-aria-menuitem.js';
import './md-aria-menulist.js';

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {internals} from '../../behaviors/element-internals.js';

import {AriaMenulistElement} from './menulist.js';

describe('md-aria-menulist', () => {
  const env = new Environment();

  async function setUpTest(
    template = html`
      <button id="openButton" popovertarget="menu">Open</button>
      <md-aria-menulist id="menu">
        <md-aria-menuitem id="item1" autofocus>Item 1</md-aria-menuitem>
        <md-aria-menuitem id="item2">Item 2</md-aria-menuitem>
        <md-aria-menuitem id="item3" disabled>Item 3</md-aria-menuitem>
      </md-aria-menulist>
      <button id="otherButton">Other button</button>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();

    const openButton = root.querySelector('#openButton') as HTMLButtonElement;
    const menulist = root.querySelector(
      'md-aria-menulist',
    ) as AriaMenulistElement;
    const otherButton = root.querySelector('#otherButton') as HTMLButtonElement;

    return {root, openButton, menulist, otherButton};
  }

  async function setUpOpenMenu() {
    const {root, openButton, menulist, otherButton} = await setUpTest();

    await new Promise<void>((resolve) => {
      menulist.addEventListener('toggle', (event: ToggleEvent) => {
        if (event.newState === 'open') {
          resolve();
        }
      });
      openButton.focus();
      openButton.click();
    });
    await env.waitForStability();
    expect(menulist.matches(':popover-open')).toBeTrue();

    return {root, openButton, menulist, otherButton};
  }

  describe('ARIA roles, orientation, and popover defaults', () => {
    it('sets element role to "menu" and ariaOrientation to "vertical"', async () => {
      const {menulist} = await setUpTest();

      expect(menulist[internals].role).toBe('menu');
      expect(menulist[internals].ariaOrientation).toBe('vertical');
    });

    it('defaults popover attribute and property to "auto"', async () => {
      const {menulist} = await setUpTest();

      expect(menulist.popover).toBe('auto');
      expect(menulist.getAttribute('popover')).toBe('auto');
    });

    it('defaults focusgroup attribute and property to "menu"', async () => {
      const {menulist} = await setUpTest();

      expect(menulist.focusGroup).toBe('menu');
      expect(menulist.getAttribute('focusgroup')).toBe('menu');
    });
  });

  describe('Closing behavior', () => {
    it('restores focus to opener when hidden', async () => {
      const {openButton, menulist} = await setUpOpenMenu();
      expect(menulist.matches(':popover-open')).toBeTrue();

      await new Promise<void>((resolve) => {
        menulist.addEventListener('toggle', (event: ToggleEvent) => {
          if (event.newState === 'closed') {
            resolve();
          }
        });
        menulist.hidePopover();
      });
      await env.waitForStability();

      expect(menulist.matches(':popover-open')).toBeFalse();
      expect(openButton.matches(':focus-within')).toBeTrue();
    });

    it('closes the popover on focusout', async () => {
      const {menulist, otherButton} = await setUpOpenMenu();
      expect(menulist.matches(':popover-open')).toBeTrue();

      await new Promise<void>((resolve) => {
        menulist.addEventListener('toggle', (event: ToggleEvent) => {
          if (event.newState === 'closed') {
            resolve();
          }
        });
        otherButton.focus();
      });
      await env.waitForStability();

      expect(menulist.matches(':popover-open')).toBeFalse();
    });
  });
});
