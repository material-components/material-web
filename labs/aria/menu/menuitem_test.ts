/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-aria-menuitem.js';
import './md-aria-menulist.js';

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {internals} from '../../behaviors/element-internals.js';
import {AriaMenuitemElement} from './menuitem.js';
import {AriaMenulistElement} from './menulist.js';

function expectEnabled(menuitem: AriaMenuitemElement) {
  expect(menuitem.disabled).toBeFalse();
  expect(menuitem[internals].ariaDisabled).toBe('false');
  expect(menuitem.hasAttribute('disabled')).toBeFalse();
  expect(menuitem.matches(':state(enabled)')).toBeTrue();
  expect(menuitem.matches(':state(disabled)')).toBeFalse();
}

function expectDisabled(menuitem: AriaMenuitemElement) {
  expect(menuitem.disabled).toBeTrue();
  expect(menuitem[internals].ariaDisabled).toBe('true');
  expect(menuitem.hasAttribute('disabled')).toBeTrue();
  expect(menuitem.matches(':state(enabled)')).toBeFalse();
  expect(menuitem.matches(':state(disabled)')).toBeTrue();
}

describe('md-aria-menuitem', () => {
  const env = new Environment();

  async function setUpTest(
    template = html`<md-aria-menuitem>Menu Item</md-aria-menuitem>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const menuitem = root.querySelector('md-aria-menuitem')!;
    return {root, menuitem};
  }

  describe('ARIA roles and internals', () => {
    it('sets element role to "menuitem"', async () => {
      const {menuitem} = await setUpTest();

      await env.waitForStability();

      expect(menuitem[internals].role).toBe('menuitem');
    });

    it('sets initial custom state to enabled and not disabled', async () => {
      const {menuitem} = await setUpTest();

      await env.waitForStability();

      expectEnabled(menuitem);
    });
  });

  describe('Disabled state and property', () => {
    it('updates ariaDisabled and custom state when disabled property is set to true', async () => {
      const {menuitem} = await setUpTest();

      menuitem.disabled = true;
      await env.waitForStability();

      expectDisabled(menuitem);
    });

    it('restores enabled state when disabled property is set back to false', async () => {
      const {menuitem} = await setUpTest();
      menuitem.disabled = true;
      await env.waitForStability();

      menuitem.disabled = false;
      await env.waitForStability();

      expectEnabled(menuitem);
    });

    it('initializes correctly when disabled attribute is set in HTML', async () => {
      const {menuitem} = await setUpTest(
        html`<md-aria-menuitem disabled>Disabled Item</md-aria-menuitem>`,
      );

      expectDisabled(menuitem);
    });
  });

  describe('Click behavior and command invocation', () => {
    it('opens an associated popover when popovertarget action is show', async () => {
      const {root, menuitem} = await setUpTest(html`
        <md-aria-menuitem
          popovertarget="test-popover"
          popovertargetaction="show">
          Open popover
        </md-aria-menuitem>
        <div id="test-popover" popover="manual">Popover content</div>
      `);
      const popover = root.querySelector('#test-popover')!;
      expect(popover.matches(':popover-open')).toBeFalse();

      menuitem.click();
      await env.waitForStability();

      expect(popover.matches(':popover-open')).toBeTrue();
    });

    it('closes an associated popover when popovertarget action is hide', async () => {
      const {root, menuitem} = await setUpTest(html`
        <md-aria-menuitem
          popovertarget="test-popover"
          popovertargetaction="hide">
          Hide popover
        </md-aria-menuitem>
        <div id="test-popover" popover="manual">Popover content</div>
      `);
      const popover = root.querySelector('#test-popover') as HTMLElement;
      popover.showPopover();
      expect(popover.matches(':popover-open')).toBeTrue();

      menuitem.click();
      await env.waitForStability();

      expect(popover.matches(':popover-open')).toBeFalse();
    });

    it('invokes command on associated target using commandfor and command attributes', async () => {
      const {root, menuitem} = await setUpTest(html`
        <md-aria-menuitem commandfor="test-popover" command="show-popover">
          Show popover
        </md-aria-menuitem>
        <div id="test-popover" popover="manual">Popover content</div>
      `);
      const popover = root.querySelector('#test-popover')!;
      expect(popover.matches(':popover-open')).toBeFalse();

      menuitem.click();
      await env.waitForStability();

      expect(popover.matches(':popover-open')).toBeTrue();
    });

    it('does not execute command steps when click event default is prevented', async () => {
      const {root, menuitem} = await setUpTest(html`
        <md-aria-menuitem
          popovertarget="test-popover"
          popovertargetaction="show">
          Open popover
        </md-aria-menuitem>
        <div id="test-popover" popover="manual">Popover content</div>
      `);
      const popover = root.querySelector('#test-popover')!;
      menuitem.addEventListener('click', (event) => {
        event.preventDefault();
      });

      menuitem.click();
      await env.waitForStability();

      expect(popover.matches(':popover-open')).toBeFalse();
    });

    it('does not execute command steps when the item is disabled', async () => {
      const {root, menuitem} = await setUpTest(html`
        <md-aria-menuitem
          popovertarget="test-popover"
          popovertargetaction="show"
          disabled>
          Open popover
        </md-aria-menuitem>
        <div id="test-popover" popover="manual">Popover content</div>
      `);
      const popover = root.querySelector('#test-popover')!;

      menuitem.click();
      await env.waitForStability();

      expect(popover.matches(':popover-open')).toBeFalse();
    });

    it('closes containing menu when an enabled menuitem is clicked', async () => {
      const {root} = await setUpTest(html`
        <md-aria-menulist id="menu">
          <md-aria-menuitem id="item1">Item 1</md-aria-menuitem>
        </md-aria-menulist>
      `);
      const menulist = root.querySelector('#menu') as AriaMenulistElement;
      const menuitem = root.querySelector('#item1') as AriaMenuitemElement;
      menulist.showPopover();
      expect(menulist.matches(':popover-open')).toBeTrue();

      menuitem.click();
      await env.waitForStability();

      expect(menulist.matches(':popover-open')).toBeFalse();
    });

    it('does not close containing menu when a disabled menuitem is clicked', async () => {
      const {root} = await setUpTest(html`
        <md-aria-menulist id="menu">
          <md-aria-menuitem id="item1" disabled>Disabled Item</md-aria-menuitem>
        </md-aria-menulist>
      `);
      const menulist = root.querySelector('#menu') as AriaMenulistElement;
      const menuitem = root.querySelector('#item1') as AriaMenuitemElement;
      menulist.showPopover();
      expect(menulist.matches(':popover-open')).toBeTrue();

      menuitem.click();
      await env.waitForStability();

      expect(menulist.matches(':popover-open')).toBeTrue();
    });
  });
});
