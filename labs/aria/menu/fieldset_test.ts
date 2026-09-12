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

describe('md-aria-fieldset', () => {
  const env = new Environment();

  async function setUpTest(
    template = html`
      <md-aria-menulist>
        <md-aria-fieldset>
          <md-aria-menuitem>Item 1</md-aria-menuitem>
          <md-aria-menuitem>Item 2</md-aria-menuitem>
          <md-aria-menuitem disabled>Item 3</md-aria-menuitem>
        </md-aria-fieldset>
      </md-aria-menulist>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const menulist = root.querySelector('md-aria-menulist')!;
    const fieldset = root.querySelector('md-aria-fieldset')!;
    const items = Array.from(root.querySelectorAll('md-aria-menuitem')!);

    await new Promise<void>((resolve) => {
      menulist.addEventListener('toggle', (event: ToggleEvent) => {
        if (event.newState === 'open') {
          resolve();
        }
      });
      menulist.showPopover();
    });
    await env.waitForStability();
    expect(menulist.matches(':popover-open')).toBeTrue();

    return {root, menulist, fieldset, items};
  }

  describe('default state', () => {
    it('has role "group"', async () => {
      const {fieldset} = await setUpTest();

      expect(fieldset[internals].role).toBe('group');
    });

    it('items are not checkable by default', async () => {
      const {items} = await setUpTest();

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);
    });
  });

  describe('single-checkable fieldsets', () => {
    async function setUpSingleCheckableTest() {
      const result = await setUpTest();
      result.fieldset.checkable = 'single';
      await env.waitForStability();
      return result;
    }

    it('only one item can be checked at a time', async () => {
      const {items} = await setUpSingleCheckableTest();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([true, false, false]);

      items[1].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, true, false]);
    });

    it('when disabled, no items are checkable', async () => {
      const {fieldset, items} = await setUpSingleCheckableTest();

      fieldset.disabled = true;
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);
    });

    it('checking an item closes the menu', async () => {
      const {menulist, items} = await setUpSingleCheckableTest();

      expect(menulist.matches(':popover-open')).toBeTrue();

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(menulist.matches(':popover-open')).toBeFalse();
    });
  });

  describe('multiple-checkable fieldsets', () => {
    async function setUpMultipleCheckableTest() {
      const result = await setUpTest();
      result.fieldset.checkable = 'multiple';
      await env.waitForStability();
      return result;
    }

    it('multiple items can be checked at once', async () => {
      const {items} = await setUpMultipleCheckableTest();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([true, false, false]);

      items[1].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([true, true, false]);

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, true, false]);
    });

    it('when disabled, no items are checkable', async () => {
      const {fieldset, items} = await setUpMultipleCheckableTest();

      fieldset.disabled = true;
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);
    });

    it('checking an item does not close the menu', async () => {
      const {menulist, items} = await setUpMultipleCheckableTest();

      expect(menulist.matches(':popover-open')).toBeTrue();

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(menulist.matches(':popover-open')).toBeTrue();
    });
  });
});
