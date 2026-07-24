/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-aria-tab.js';
import './md-aria-tablist.js';
import './md-aria-tabpanel.js';

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {internals} from '../../behaviors/element-internals.js';

describe('md-aria-tabpanel', () => {
  const env = new Environment();

  async function setupTest(
    template = html`
      <md-aria-tablist>
        <md-aria-tab id="tabone" tabpanel="panelone">Tab one</md-aria-tab>
        <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab two</md-aria-tab>
      </md-aria-tablist>
      <md-aria-tabpanel id="panelone" tab="tabone">
        Panel Content 1
      </md-aria-tabpanel>
      <md-aria-tabpanel id="paneltwo" tab="tabtwo">
        Panel Content 2
      </md-aria-tabpanel>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const tabs = Array.from(root.querySelectorAll('md-aria-tab'));
    const panels = Array.from(root.querySelectorAll('md-aria-tabpanel'));
    return {root, tabs, panels};
  }

  describe('ARIA roles and internals', () => {
    it('sets element role to "tabpanel"', async () => {
      const {panels} = await setupTest();

      expect(panels[0][internals].role).toBe('tabpanel');
    });

    it('links associated tab element via tab ID attribute', async () => {
      const {tabs, panels} = await setupTest();

      expect(panels[0].tabElement).toBe(tabs[0]);
      expect(panels[0].tab).toBe('tabone');
    });

    it('configures tabIndex to 0 by default', async () => {
      const {panels} = await setupTest();

      expect(panels[0].tabIndex).toBe(0);
      expect(panels[0].getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Properties and tab linking', () => {
    it('updates associated tab link when tabElement property is modified', async () => {
      const {tabs, panels} = await setupTest();

      panels[0].tabElement = tabs[1];
      await env.waitForStability();

      expect(panels[0].tabElement).toBe(tabs[1]);
      expect(panels[0].tab).toBe('tabtwo');
    });

    it('updates associated tab element when tab property is modified', async () => {
      const {tabs, panels} = await setupTest();

      panels[0].tab = 'tabtwo';
      await env.waitForStability();

      expect(panels[0].tabElement).toBe(tabs[1]);
    });

    it('returns null for tabElement when unlinked', async () => {
      const {panels} = await setupTest(
        html`<md-aria-tabpanel id="panel"></md-aria-tabpanel>`,
      );

      expect(panels[0].tab).toBe('');
      expect(panels[0].tabElement).toBeNull();
    });

    it('clears tab link when tabElement is set to null', async () => {
      const {panels} = await setupTest();

      panels[0].tabElement = null;
      await env.waitForStability();

      expect(panels[0].tab).toBe('');
    });
  });
});
