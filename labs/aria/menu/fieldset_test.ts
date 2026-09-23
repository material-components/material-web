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

  describe('the checkable attribute', () => {
    it('is none when the attribute is absent', async () => {
      const {fieldset, items} = await setUpTest();

      expect(fieldset.checkable).toBeNull();
      expect(items[0][internals].role).toBe('menuitem');
    });

    it('is single or multiple when the attribute is set to those values', async () => {
      const {fieldset, items} = await setUpTest();

      fieldset.setAttribute('checkable', 'single');
      await env.waitForStability();

      expect(fieldset.checkable).toBe('single');
      expect(items[0][internals].role).toBe('menuitemradio');

      fieldset.setAttribute('checkable', 'multiple');
      await env.waitForStability();

      expect(fieldset.checkable).toBe('multiple');
      expect(items[0][internals].role).toBe('menuitemcheckbox');
    });

    it('ignores the case of the attribute value', async () => {
      const {fieldset, items} = await setUpTest();

      fieldset.setAttribute('checkable', 'SINGLE');
      await env.waitForStability();

      // Mapping the attribute to a state must not rewrite the attribute
      // itself: the value an author wrote is the value they get back.
      expect(fieldset.getAttribute('checkable')).toBe('SINGLE');
      expect(fieldset.checkable).toBe('single');
      expect(items[0][internals].role).toBe('menuitemradio');

      fieldset.setAttribute('checkable', 'MuLtIpLe');
      await env.waitForStability();

      expect(fieldset.getAttribute('checkable')).toBe('MuLtIpLe');
      expect(fieldset.checkable).toBe('multiple');
      expect(items[0][internals].role).toBe('menuitemcheckbox');
    });

    it('is multiple when the attribute value is empty or unrecognized', async () => {
      const {fieldset, items} = await setUpTest();

      fieldset.setAttribute('checkable', '');
      await env.waitForStability();

      expect(fieldset.getAttribute('checkable')).toBe('');
      expect(fieldset.checkable).toBe('multiple');
      expect(items[0][internals].role).toBe('menuitemcheckbox');

      fieldset.setAttribute('checkable', 'not-a-checkable-state');
      await env.waitForStability();

      expect(fieldset.getAttribute('checkable')).toBe('not-a-checkable-state');
      expect(fieldset.checkable).toBe('multiple');
      expect(items[0][internals].role).toBe('menuitemcheckbox');
    });

    it('is none again when the attribute is removed', async () => {
      const {fieldset, items} = await setUpTest();
      fieldset.setAttribute('checkable', 'multiple');
      await env.waitForStability();

      fieldset.removeAttribute('checkable');
      await env.waitForStability();

      expect(fieldset.checkable).toBeNull();
      expect(items[0][internals].role).toBe('menuitem');
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

  describe('changing the checkable state', () => {
    it('resets the checkedness of every item when becoming single-checkable', async () => {
      const {fieldset, items} = await setUpTest();
      fieldset.checkable = 'multiple';
      await env.waitForStability();

      items[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      items[1].dispatchEvent(new MouseEvent('click', {bubbles: true}));
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([true, true, false]);

      fieldset.checkable = 'single';
      await env.waitForStability();

      expect(items.map((x) => x.checked)).toEqual([false, false, false]);
    });
  });
});
