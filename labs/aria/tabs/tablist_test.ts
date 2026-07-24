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
import {AriaTabElement} from './tab.js';

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
    it('sets element role to "tablist"', async () => {
      const {tablist} = await setupTest();

      expect(tablist[internals].role).toBe('tablist');
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

    it('configures roving tabIndex for selected and unselected tabs on initialization', async () => {
      const {tabs} = await setupTest();

      expect(tabs[0].tabIndex).toBe(0);
      expect(tabs[1].tabIndex).toBe(-1);
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

    it('dispatches "change" event on tablist when tab selection changes via keydown in automatic selection mode', async () => {
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

      tabs[0].focus();
      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
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

  describe('Keyboard navigation - Automatic activation (autoSelect = true)', () => {
    it('selects next tab on ArrowRight key press in automatic selection mode', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
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
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[1].selected).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('selects previous tab on ArrowLeft key press in automatic selection mode', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
        <md-aria-tablist autoSelect .selectedTabIndex=${1}>
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

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(panels[0].hidden).toBeFalse();
    });

    it('wraps to last tab on ArrowLeft from first tab in automatic selection mode', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
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
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[2].selected).toBeTrue();
      expect(panels[2].hidden).toBeFalse();
    });

    it('wraps to first tab on ArrowRight from last tab in automatic selection mode', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
        <md-aria-tablist autoSelect .selectedTabIndex=${2}>
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
      tabs[2].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(panels[0].hidden).toBeFalse();
    });

    it('selects last tab on End key press', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
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
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'End', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[2].selected).toBeTrue();
      expect(panels[2].hidden).toBeFalse();
    });

    it('selects first tab on Home key press', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
        <md-aria-tablist autoSelect .selectedTabIndex=${2}>
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
      tabs[2].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Home', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(panels[0].hidden).toBeFalse();
    });

    it('selects next tab on ArrowDown key press in vertical orientation', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
        <md-aria-tablist autoSelect orientation="vertical">
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[1].selected).toBeTrue();
      expect(panels[1].hidden).toBeFalse();
    });

    it('selects previous tab on ArrowUp key press in vertical orientation', async () => {
      const {tablist, tabs, panels} = await setupTest(html`
        <md-aria-tablist
          autoSelect
          orientation="vertical"
          .selectedTabIndex=${1}>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[1].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(panels[0].hidden).toBeFalse();
    });

    it('ignores ArrowDown key press in horizontal orientation', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist autoSelect orientation="horizontal">
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(tabs[1].selected).toBeFalse();
    });

    it('moves forward on ArrowLeft in RTL layout', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist autoSelect style="direction: rtl;">
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[1].selected).toBeTrue();
    });

    it('moves backward on ArrowRight in RTL layout', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist
          autoSelect
          style="direction: rtl;"
          .selectedTabIndex=${1}>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[1].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
    });

    it('moves forward on ArrowDown in vertical RTL layout', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist
          autoSelect
          orientation="vertical"
          style="direction: rtl;">
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[1].selected).toBeTrue();
    });

    it('moves backward on ArrowUp in vertical RTL layout', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist
          autoSelect
          orientation="vertical"
          style="direction: rtl;"
          .selectedTabIndex=${1}>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[1].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
    });

    it('ignores navigation keydown when event default is prevented', async () => {
      const {tablist, tabs} = await setupTest(html`
        <md-aria-tablist autoSelect>
          <md-aria-tab id="tabone" tabpanel="panelone">Tab 1</md-aria-tab>
          <md-aria-tab id="tabtwo" tabpanel="paneltwo">Tab 2</md-aria-tab>
        </md-aria-tablist>
        <md-aria-tabpanel id="panelone" tab="tabone">Panel 1</md-aria-tabpanel>
        <md-aria-tabpanel id="paneltwo" tab="tabtwo">Panel 2</md-aria-tabpanel>
      `);
      tabs[0].focus();

      const event = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true,
      });
      event.preventDefault();
      tablist.dispatchEvent(event);
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(tabs[1].selected).toBeFalse();
    });

    it('does not navigate on arrow key press if tablist contains only one tab', async () => {
      const {root} = await setupTest(html`
        <md-aria-tablist autoSelect>
          <md-aria-tab id="tabone">Tab 1</md-aria-tab>
        </md-aria-tablist>
      `);
      const tablist = root.querySelector('md-aria-tablist')!;
      const tabs = tablist.tabs as AriaTabElement[];

      tabs[0].focus();
      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
    });

    it('focuses first tab on ArrowRight when no tab is focused', async () => {
      const {tablist, tabs} = await setupTest();
      (document.activeElement as HTMLElement | null)?.blur();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      expect(document.activeElement).toBe(tabs[0]);
    });

    it('focuses last tab on ArrowLeft when no tab is focused', async () => {
      const {tablist, tabs} = await setupTest();
      (document.activeElement as HTMLElement | null)?.blur();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}),
      );
      await env.waitForStability();

      expect(document.activeElement).toBe(tabs[tabs.length - 1]);
    });
  });

  describe('Keyboard navigation - Manual activation (autoSelect = false)', () => {
    it('moves focus without changing tab selection on arrow key press in manual selection mode', async () => {
      const {tablist, tabs, panels} = await setupTest();
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[0].selected).toBeTrue();
      expect(tabs[1].selected).toBeFalse();
      expect(panels[0].hidden).toBeFalse();
      expect(panels[1].hidden).toBeTrue();
      expect(tabs[1].tabIndex).toBe(0);
    });

    it('selects focused tab when Enter key is pressed', async () => {
      const {tablist, tabs, panels} = await setupTest();
      tabs[0].focus();
      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
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
      const {tablist, tabs, panels} = await setupTest();
      tabs[0].focus();
      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
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

  describe('Focusout behavior', () => {
    it('restores roving tabIndex to selected tab on focusout', async () => {
      const {tablist, tabs} = await setupTest();
      tabs[0].focus();

      tablist.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      expect(tabs[1].tabIndex).toBe(0);
      expect(tabs[0].tabIndex).toBe(-1);

      tabs[1].blur();
      await env.waitForStability();

      expect(tabs[0].tabIndex).toBe(0);
      expect(tabs[1].tabIndex).toBe(-1);
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
