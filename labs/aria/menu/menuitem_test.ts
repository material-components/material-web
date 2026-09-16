/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-aria-fieldset.js';
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

function expectChecked(menuitem: AriaMenuitemElement) {
  expect(menuitem.checked).toBeTrue();
  expect(menuitem[internals].ariaChecked).toBe('true');
  expect(menuitem.matches(':state(checked)')).toBeTrue();
}

function expectNotChecked(menuitem: AriaMenuitemElement) {
  expect(menuitem.checked).toBeFalse();
  expect(menuitem[internals].ariaChecked).toBe('false');
  expect(menuitem.matches(':state(checked)')).toBeFalse();
}

function expectNotCheckable(menuitem: AriaMenuitemElement) {
  expect(menuitem.checked).toBeFalse();
  expect(menuitem[internals].ariaChecked).toBe(null);
  expect(menuitem.matches(':state(checked)')).toBeFalse();
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

    it('sets initial custom state to enabled, not disabled, and not checkable', async () => {
      const {menuitem} = await setUpTest();

      await env.waitForStability();

      expectEnabled(menuitem);
      expectNotCheckable(menuitem);
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

  describe('Checkedness behavior', () => {
    async function setUpCheckednessTest() {
      const {root} = await setUpTest(html`
        <md-aria-menulist>
          <md-aria-fieldset checkable="multiple">
            <md-aria-menuitem>Item 1</md-aria-menuitem>
          </md-aria-fieldset>
        </md-aria-menulist>
      `);
      const menulist = root.querySelector('md-aria-menulist')!;
      const fieldset = root.querySelector('md-aria-fieldset')!;
      const menuitem = root.querySelector('md-aria-menuitem')!;

      menulist.showPopover();
      await env.waitForStability();

      return {menulist, fieldset, menuitem};
    }

    it('has role "menuitemcheckbox" in multiple-checkable fieldsets', async () => {
      const {menuitem} = await setUpCheckednessTest();

      expect(menuitem[internals].role).toEqual('menuitemcheckbox');
    });

    it('has role "menuitemradio" in single-checkable fieldsets', async () => {
      const {fieldset, menuitem} = await setUpCheckednessTest();

      fieldset.checkable = 'single';
      await env.waitForStability();

      expect(menuitem[internals].role).toEqual('menuitemradio');
    });

    it('becomes checked when clicked', async () => {
      const {menuitem} = await setUpCheckednessTest();

      expectNotChecked(menuitem);

      menuitem.click();
      await env.waitForStability();

      expectChecked(menuitem);
    });

    it('does not become checked when clicked if disabled', async () => {
      const {menuitem} = await setUpCheckednessTest();

      expectNotChecked(menuitem);

      menuitem.disabled = true;
      await env.waitForStability();
      menuitem.click();
      await env.waitForStability();

      expectNotChecked(menuitem);
    });

    it('does not become checked when the fieldset is not checkable', async () => {
      const {fieldset, menuitem} = await setUpCheckednessTest();

      expectNotChecked(menuitem);

      fieldset.checkable = null;
      await env.waitForStability();

      expectNotCheckable(menuitem);

      menuitem.click();
      await env.waitForStability();

      expectNotCheckable(menuitem);
    });

    it('items with `defaultchecked` are checked by default', async () => {
      const {root} = await setUpTest(html`
        <md-aria-menulist>
          <md-aria-fieldset checkable="single">
            <md-aria-menuitem defaultchecked
              >Default checked item</md-aria-menuitem
            >
            <md-aria-menuitem>Other item</md-aria-menuitem>
          </md-aria-fieldset>
        </md-aria-menulist>
      `);
      const menulist = root.querySelector('md-aria-menulist')!;
      const menuitems = Array.from(root.querySelectorAll('md-aria-menuitem')!);

      menulist.showPopover();
      await env.waitForStability();

      expect(menuitems.map((x) => x.checked)).toEqual([true, false]);
    });

    it('the last item in a single-checkable fieldset with `defaultchecked` is checked by default', async () => {
      const {root} = await setUpTest(html`
        <md-aria-menulist>
          <md-aria-fieldset checkable="single">
            <md-aria-menuitem defaultchecked>Item 1</md-aria-menuitem>
            <md-aria-menuitem defaultchecked>Item 2</md-aria-menuitem>
            <md-aria-menuitem defaultchecked>Item 3</md-aria-menuitem>
          </md-aria-fieldset>
        </md-aria-menulist>
      `);
      const menulist = root.querySelector('md-aria-menulist')!;
      const menuitems = Array.from(root.querySelectorAll('md-aria-menuitem')!);

      menulist.showPopover();
      await env.waitForStability();

      expect(menuitems.map((x) => x.checked)).toEqual([false, false, true]);
    });

    it('multiple items in a muliple-checkable fieldset with `defaultchecked` are checked by default', async () => {
      const {root} = await setUpTest(html`
        <md-aria-menulist>
          <md-aria-fieldset checkable="multiple">
            <md-aria-menuitem defaultchecked>Item 1</md-aria-menuitem>
            <md-aria-menuitem defaultchecked>Item 2</md-aria-menuitem>
            <md-aria-menuitem defaultchecked>Item 3</md-aria-menuitem>
          </md-aria-fieldset>
        </md-aria-menulist>
      `);
      const menulist = root.querySelector('md-aria-menulist')!;
      const menuitems = Array.from(root.querySelectorAll('md-aria-menuitem')!);

      menulist.showPopover();
      await env.waitForStability();

      expect(menuitems.map((x) => x.checked)).toEqual([true, true, true]);
    });
  });
});
