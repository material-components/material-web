/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="../../../types/popover.d.ts" />

// import 'jasmine'; (google3-only)

import './md-aria-menubar.js';
import './md-aria-menuitem.js';

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {internals} from '../../behaviors/element-internals.js';

import {AriaMenubarElement} from './menubar.js';

describe('md-aria-menubar', () => {
  const env = new Environment();

  async function setUpTest(
    template = html`
      <md-aria-menubar>
        <md-aria-menuitem id="item1" autofocus>Item 1</md-aria-menuitem>
        <md-aria-menuitem id="item2">Item 2</md-aria-menuitem>
        <md-aria-menuitem id="item3" disabled>Item 3</md-aria-menuitem>
      </md-aria-menubar>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();

    const menubar = root.querySelector('md-aria-menubar') as AriaMenubarElement;

    return {root, menubar};
  }

  describe('ARIA roles, orientation, and popover defaults', () => {
    it('sets element role to "menubar" and ariaOrientation to "vertical"', async () => {
      const {menubar} = await setUpTest();

      expect(menubar[internals].role).toBe('menubar');
      expect(menubar[internals].ariaOrientation).toBe('horizontal');
    });

    it('defaults focusgroup attribute to "menubar"', async () => {
      const {menubar} = await setUpTest();

      expect(menubar.getAttribute('focusgroup')).toBe('menubar');
    });
  });
});
