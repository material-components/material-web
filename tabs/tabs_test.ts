/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {TabsHarness} from './harness.js';
import {MdPrimaryTab} from './primary-tab.js';
import {MdSecondaryTab} from './secondary-tab.js';
import {MdTabs} from './tabs.js';

interface TabsTestProps {
  activeTabIndex?: number;
}

function getTabsTemplate(props?: TabsTestProps) {
  return html` <md-tabs .activeTabIndex=${props?.activeTabIndex ?? 0}>
    <md-primary-tab>A</md-primary-tab>
    <md-primary-tab>B</md-primary-tab>
    <md-primary-tab>C</md-primary-tab>
  </md-tabs>`;
}

describe('<md-tabs>', () => {
  const env = new Environment();

  async function setupTest(props?: TabsTestProps, template = getTabsTemplate) {
    const root = env.render(template(props));
    await env.waitForStability();
    const tab = root.querySelector<MdTabs>('md-tabs')!;
    const harness = new TabsHarness(tab);
    return {harness, root};
  }

  describe('.styles', () => {
    createTokenTests(MdTabs.styles);
    createTokenTests(MdPrimaryTab.styles);
    createTokenTests(MdSecondaryTab.styles);
  });

  describe('properties', () => {
    it('renders selected with indicator', async () => {
      const {harness} = await setupTest({activeTabIndex: 1});
      expect(harness.element.activeTabIndex).toBe(1);
      expect(harness.element.activeTab).toBe(harness.harnessedItems[1].element);
      harness.harnessedItems.forEach(async (tabHarness, i) => {
        const shouldBeSelected = i === harness.element.activeTabIndex;
        await tabHarness.element.updateComplete;
        expect(tabHarness.element.active).toBe(shouldBeSelected);
        expect(await tabHarness.isIndicatorShowing()).toBe(shouldBeSelected);
      });
      await env.waitForStability();
      harness.element.activeTabIndex = 0;
      await harness.element.updateComplete;
      expect(harness.element.activeTabIndex).toBe(0);
      harness.harnessedItems.forEach(async (tabHarness, i) => {
        const shouldBeSelected = i === harness.element.activeTabIndex;
        await tabHarness.element.updateComplete;
        expect(tabHarness.element.active).toBe(shouldBeSelected);
        expect(await tabHarness.isIndicatorShowing()).toBe(shouldBeSelected);
      });
    });

    it('updates activeTab', async () => {
      const {harness} = await setupTest({activeTabIndex: 1});
      expect(harness.element.activeTab).toBe(harness.harnessedItems[1].element);
      harness.element.activeTabIndex = 0;
      await harness.element.updateComplete;
      expect(harness.element.activeTab).toBe(harness.harnessedItems[0].element);
    });

    it('maintains selection when tabs are mutated', async () => {
      // Note: adding and moving tabs does not change selection
      const {harness} = await setupTest({activeTabIndex: 1});
      const [, second] = harness.element.tabs;
      expect(harness.element.activeTab).toBe(second);
      const tab = document.createElement('md-primary-tab');
      tab.textContent = 'tab';
      // add before selected
      harness.element.prepend(tab);
      await env.waitForStability();
      expect(harness.element.activeTab).toBe(second);
      // move after selected
      harness.element.activeTab?.after(tab);
      await env.waitForStability();
      expect(harness.element.activeTab).toBe(second);
      // move before selected
      harness.element.prepend(tab);
      await env.waitForStability();
      expect(harness.element.activeTab).toBe(second);
      // remove
      tab.remove();
      await env.waitForStability();
      expect(harness.element.activeTab).toBe(second);
    });

    it('selects first item when selected tab is removed', async () => {
      const {harness} = await setupTest({activeTabIndex: 1});
      const [first, second] = harness.element.tabs;
      expect(harness.element.activeTab).toBe(second);
      second.remove();
      await env.waitForStability();
      expect(harness.element.activeTab).toBe(first);
    });

    it('should ignore setting activeTab when tab is not a child', async () => {
      const {harness} = await setupTest();
      const [firstTab] = harness.element.tabs;
      expect(harness.element.activeTab).toBe(firstTab);
      const unrelatedTab = document.createElement('md-primary-tab');
      harness.element.activeTab = unrelatedTab;
      await env.waitForStability();
      expect(harness.element.activeTab).toBe(firstTab);
    });

    it('should allow setting activeTabIndex in a lit property binding', async () => {
      const root = env.render(html`
        <md-tabs .activeTabIndex=${1}>
          <md-primary-tab>A</md-primary-tab>
          <md-primary-tab>B</md-primary-tab>
        </md-tabs>
      `);

      await env.waitForStability();
      const tabs = root.querySelector('md-tabs')!;
      expect(tabs.activeTabIndex).withContext('activeTabIndex').toBe(1);
      expect(tabs.activeTab?.textContent)
        .withContext('activeTab')
        .toBe('B');
    });

    it('should allow setting active-tab-index as an attribute', async () => {
      const root = env.render(html`
        <md-tabs active-tab-index=${1}>
          <md-primary-tab>A</md-primary-tab>
          <md-primary-tab>B</md-primary-tab>
        </md-tabs>
      `);

      await env.waitForStability();
      const tabs = root.querySelector('md-tabs')!;
      expect(tabs.activeTabIndex).withContext('activeTabIndex').toBe(1);
      expect(tabs.activeTab?.textContent)
        .withContext('activeTab')
        .toBe('B');
    });
  });

  it('should dispatch "change" when tab changes', async () => {
    const {harness} = await setupTest();
    const changeListener = jasmine.createSpy('changeListener');
    harness.element.addEventListener('change', changeListener);

    await harness.harnessedItems[1].clickWithMouse();
    expect(changeListener).toHaveBeenCalledTimes(1);
  });

  it('should not dispatch "change" when changing to unrelated tab', async () => {
    const {harness} = await setupTest();
    const changeListener = jasmine.createSpy('changeListener');
    harness.element.addEventListener('change', changeListener);

    harness.element.activeTab = document.createElement('md-primary-tab');
    await env.waitForStability();
    expect(changeListener).not.toHaveBeenCalled();
  });

  it('should not dispatch "change" when setting activeTab to itself', async () => {
    const {harness} = await setupTest();
    const changeListener = jasmine.createSpy('changeListener');
    harness.element.addEventListener('change', changeListener);

    harness.element.activeTab = harness.element.activeTab;
    await env.waitForStability();
    expect(changeListener).not.toHaveBeenCalled();
  });
});
