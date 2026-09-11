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
import {hasState} from '../../behaviors/custom-state-set.js';
import {internals} from '../../behaviors/element-internals.js';

describe('md-aria-tablist', () => {
  const env = new Environment();

  async function setupTest(
    template = html`
      <md-aria-tablist>
        <md-aria-tab id="tabone" tabpanel="panelone">Tab one</md-aria-tab>
        <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab two</md-aria-tab>
        <md-aria-tab id="tabthree" tabpanel="panelthree">Tab three</md-aria-tab>
      </md-aria-tablist>
      <md-aria-tabpanel id="panelone" tab="tabone">
        Panel Content 1
      </md-aria-tabpanel>
      <md-aria-tabpanel id="paneltwo" tab="tabtwo">
        Panel Content 2
      </md-aria-tabpanel>
      <md-aria-tabpanel id="panelthree" tab="tabthree">
        Panel Content 3
      </md-aria-tabpanel>
    `,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const tablist = root.querySelector('md-aria-tablist')!;
    const tabs = Array.from(root.querySelectorAll('md-aria-tab'));
    const panels = Array.from(root.querySelectorAll('md-aria-tabpanel'));
    return {root, tablist, tabs, panels};
  }

  describe('ARIA roles and internals', () => {
    it('can be instantiated via document.createElement without throwing', () => {
      expect(() => document.createElement('md-aria-tablist')).not.toThrow();
    });

    it('sets element role to "tablist"', async () => {
      const {tablist} = await setupTest();

      expect(tablist[internals].role).toBe('tablist');
    });

    it('defaults focusgroup attribute to "tablist inline"', async () => {
      const {tablist} = await setupTest();

      expect(tablist.getAttribute('focusgroup')).toBe('tablist inline');
    });
  });

  describe('Initial selection and syncing', () => {
    it('automatically selects the first tab when no tab is pre-selected', async () => {
      const {tabs} = await setupTest();

      expect(tabs[0].selected).toBeTrue();
      expect(tabs[0][internals].ariaSelected).toBe('true');
      expect(tabs[0][hasState]('selected')).toBeTrue();

      expect(tabs[1].selected).toBeFalse();
      expect(tabs[1][internals].ariaSelected).toBe('false');
      expect(tabs[1][hasState]('selected')).toBeFalse();
    });

    it('shows only the active tabpanel on initialization', async () => {
      const {panels} = await setupTest();

      expect(panels[0].hidden).toBeFalse();
      expect(panels[1].hidden).toBeTrue();
      expect(panels[2].hidden).toBeTrue();
    });

    it('selects pre-selected tab specified via selectedTabIndex attribute', async () => {
      const {tabs, panels} = await setupTest(html`
        <md-aria-tablist .selectedTabIndex=${1}>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab one</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab two</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);

      expect(tabs[0].selected).toBeFalse();
      expect(tabs[1].selected).toBeTrue();
      expect(panels[0].hidden).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });
  });

  describe('Properties and getters/setters', () => {
    it('returns current selected tab via selectedTab getter', async () => {
      const {tablist, tabs} = await setupTest();

      expect(tablist.selectedTab).toBe(tabs[0]);
    });

    it('updates selected tab and active tabpanel when selectedTab is set', async () => {
      const {tablist, tabs, panels} = await setupTest();

      tablist.selectedTab = tabs[1];
      await env.waitForStability();

      expect(tablist.selectedTab).toBe(tabs[1]);
      expect(tablist.selectedTabIndex).toBe(1);
      expect(tabs[0].selected).toBeFalse();
      expect(tabs[1].selected).toBeTrue();
      expect(panels[0].hidden).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('ignores setting selectedTab to null', async () => {
      const {tablist, tabs} = await setupTest();
      tablist.selectedTab = tabs[1];
      await env.waitForStability();

      tablist.selectedTab = null;
      await env.waitForStability();

      expect(tablist.selectedTab as unknown).toBe(tabs[1]);
    });

    it('ignores setting selectedTab to an unattached tab', async () => {
      const {tablist, tabs} = await setupTest();
      const outsideTab = document.createElement('md-aria-tab');

      tablist.selectedTab = outsideTab;
      await env.waitForStability();

      expect(tablist.selectedTab).toBe(tabs[0]);
    });

    it('returns current selected tab index via selectedTabIndex getter', async () => {
      const {tablist} = await setupTest();

      expect(tablist.selectedTabIndex).toBe(0);
    });

    it('updates selected tab and active tabpanel when selectedTabIndex is set', async () => {
      const {tablist, tabs, panels} = await setupTest();

      tablist.selectedTabIndex = 1;
      await env.waitForStability();

      expect(tablist.selectedTabIndex).toBe(1);
      expect(tabs[0].selected).toBeFalse();
      expect(tabs[1].selected).toBeTrue();
      expect(panels[0].hidden).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('ignores setting selectedTabIndex to out-of-bounds positive index', async () => {
      const {tablist} = await setupTest();

      tablist.selectedTabIndex = 99;
      await env.waitForStability();

      expect(tablist.selectedTabIndex).toBe(0);
    });

    it('ignores setting selectedTabIndex to negative index', async () => {
      const {tablist} = await setupTest();

      tablist.selectedTabIndex = -1;
      await env.waitForStability();

      expect(tablist.selectedTabIndex).toBe(0);
    });

    it('initializes selected tab via lit property binding for selectedTabIndex', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
        <md-aria-tablist .selectedTabIndex=${1}>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);

      expect(tablist.selectedTabIndex).toBe(1);
      expect(tabs[0].selected).toBeFalse();
      expect(tabs[1].selected).toBeTrue();
      expect(panels[0].hidden).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('excludes non-tab elements when resolving tabs property', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist>
          <div>Header Text</div>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <span>Separator</span>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);

      expect(tablist.tabs.length).toBe(2);
      expect(tablist.tabs[0]).toBe(tabs[0]);
      expect(tablist.tabs[1]).toBe(tabs[1]);
    });

    it('defaults autoSelect property to false', async () => {
      const {tablist} = await setupTest();

      expect(tablist.autoSelect).toBeFalse();
    });

    it('defaults orientation property to horizontal', async () => {
      const {tablist} = await setupTest();

      expect(tablist.orientation).toBe('horizontal');
      expect(tablist[internals].ariaOrientation).toBe('horizontal');
    });

    it('updates ariaOrientation, orientation attribute, and focusgroup attribute when orientation is dynamically updated', async () => {
      const {tablist} = await setupTest();

      tablist.orientation = 'vertical';
      await env.waitForStability();

      expect(tablist.orientation).toBe('vertical');
      expect(tablist.getAttribute('orientation')).toBe('vertical');
      expect(tablist[internals].ariaOrientation).toBe('vertical');
      expect(tablist.getAttribute('focusgroup')).toBe('tablist block');

      tablist.orientation = 'horizontal';
      await env.waitForStability();

      expect(tablist.orientation).toBe('horizontal');
      expect(tablist.getAttribute('orientation')).toBe('horizontal');
      expect(tablist[internals].ariaOrientation).toBe('horizontal');
      expect(tablist.getAttribute('focusgroup')).toBe('tablist inline');

      tablist.setAttribute('orientation', 'vertical');
      await env.waitForStability();

      expect(tablist.orientation).toBe('vertical');
      expect(tablist.getAttribute('orientation')).toBe('vertical');
      expect(tablist[internals].ariaOrientation).toBe('vertical');
      expect(tablist.getAttribute('focusgroup')).toBe('tablist block');
    });
  });

  describe('Click interactions', () => {
    it('selects tab and displays associated tabpanel on click', async () => {
      const {tabs, panels} = await setupTest();

      tabs[1].click();
      await env.waitForStability();

      expect(tabs[0].selected).toBeFalse();
      expect(tabs[1].selected).toBeTrue();
      expect(panels[0].hidden).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('does not select tab on click if event default is prevented', async () => {
      const {tabs, panels} = await setupTest();

      tabs[1].addEventListener(
        'click',
        (event) => {
          event.preventDefault();
        },
        {once: true},
      );

      tabs[1].click();
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(tabs[1].selected).toBeFalse();
      expect(panels[0].hidden).toBeFalse();
      expect(panels[1].hidden).toBeTrue();
    });
  });

  describe('Events', () => {
    it('dispatches "change" event on tablist when tab selection changes via click', async () => {
      const {tablist, tabs} = await setupTest();
      const changeListener = jasmine.createSpy('changeListener');
      tablist.addEventListener('change', changeListener);

      tabs[1].click();
      await env.waitForStability();

      expect(changeListener).toHaveBeenCalledTimes(1);
      const event = changeListener.calls.mostRecent().args[0] as Event;
      expect(event.bubbles).toBeTrue();
      expect(event.target).toBe(tablist);
    });

    it('dispatches "change" event on tablist when tab selection changes via focus in automatic selection mode', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist autoSelect>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      const changeListener = jasmine.createSpy('changeListener');
      tablist.addEventListener('change', changeListener);

      tabs[1].focus();
      await env.waitForStability();

      expect(changeListener).toHaveBeenCalledTimes(1);
    });

    it('does not dispatch "change" event when tab selection changes via selectedTab setter', async () => {
      const {tablist, tabs} = await setupTest();
      const changeListener = jasmine.createSpy('changeListener');
      tablist.addEventListener('change', changeListener);

      tablist.selectedTab = tabs[1];
      await env.waitForStability();

      expect(changeListener).not.toHaveBeenCalled();
    });

    it('does not dispatch "change" event when tab selection changes via selectedTabIndex setter', async () => {
      const {tablist} = await setupTest();
      const changeListener = jasmine.createSpy('changeListener');
      tablist.addEventListener('change', changeListener);

      tablist.selectedTabIndex = 1;
      await env.waitForStability();

      expect(changeListener).not.toHaveBeenCalled();
    });
  });

  describe('Focus activation - Automatic activation (autoSelect = true)', () => {
    it('selects tab on focus in automatic selection mode', async () => {
      const {tabs, panels} = await setupTest(html`
        <md-aria-tablist autoSelect>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
          <md-aria-tab id="tabthree" tabpanel="panelthree">Tab 3</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
        <md-aria-tabpanel id="panelthree" tab="tabthree">
          Panel 3
        </md-aria-tabpanel>
      `);
      tabs[1].focus();
      await env.waitForStability();

      expect(tabs[1].selected).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });
  });

  describe('Focus activation - Manual activation (autoSelect = false)', () => {
    it('does not change selection when tab is focused in manual selection mode', async () => {
      const {tabs, panels} = await setupTest();
      tabs[1].focus();
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(tabs[1].selected).toBeFalse();
      expect(panels[0].hidden).toBeFalse();
      expect(panels[1].hidden).toBeTrue();
    });

    it('selects focused tab when Enter key is pressed', async () => {
      const {tabs, panels} = await setupTest();
      tabs[1].focus();
      await env.waitForStability();

      tabs[1].dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeFalse();
      expect(tabs[1].selected).toBeTrue();
      expect(panels[0].hidden).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('selects focused tab when Space key is pressed', async () => {
      const {tabs, panels} = await setupTest();
      tabs[1].focus();
      await env.waitForStability();

      tabs[1].dispatchEvent(
        new KeyboardEvent('keydown', {key: ' ', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeFalse();
      expect(tabs[1].selected).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });
  });

  describe('Dynamic DOM mutations (slot change)', () => {
    it('selects first remaining tab when currently selected tab is removed from DOM', async () => {
      const {tablist, tabs, panels} = await setupTest();

      expect(tabs[0].selected).toBeTrue();

      tabs[0].remove();
      await env.waitForStability();

      expect(tablist.selectedTab).toBe(tabs[1]);
      expect(tabs[1].selected).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('automatically selects tab added to an empty tablist', async () => {
      const {root} = await setupTest(html`<md-aria-tablist></md-aria-tablist>`);
      const tablist = root.querySelector('md-aria-tablist')!;

      expect(tablist.selectedTab).toBeNull();

      const newTab = document.createElement('md-aria-tab');
      newTab.id = 'newtab';
      newTab.textContent = 'New Tab';
      tablist.appendChild(newTab);
      await env.waitForStability();

      expect(tablist.selectedTab).toBe(newTab);
      expect(newTab.selected).toBeTrue();
    });

    it('ensures only one tab is selected when inserting an already-selected tab', async () => {
      const {tablist, tabs} = await setupTest();

      expect(tabs[0].selected).toBeTrue();

      const newTab = document.createElement('md-aria-tab');
      newTab.id = 'newtab';
      newTab.textContent = 'New Tab';
      newTab.selected = true;
      tablist.appendChild(newTab);
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(newTab.selected).toBeFalse();
    });
  });
});
