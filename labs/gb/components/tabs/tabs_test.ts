/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../../aria/tabs/md-aria-tabpanel.js';
import './md-gb-tab.js';
import './md-gb-tabs.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {internals} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {styles as badgeStyles} from '../badge/badge.cssresult.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import {setupTabs} from './tabs.js';
import {styles as tabsStyles} from './tabs.cssresult.js';

// The utility classes must be styled in the document for raw-HTML mode. Element
// mode adopts the same sheet itself; adoption is idempotent.
adoptStyles(document, [
  m3Styles,
  badgeStyles,
  focusRingStyles,
  rippleStyles,
  tabsStyles,
]);

function parsePixels(value: string): number {
  return Number(value.replace('px', ''));
}

describe('md-gb-tabs', () => {
  const env = new Environment();

  describe('element mode', () => {
    it('puts the .tabs class on the host, in the light tree', async () => {
      const root = env.render(html`<md-gb-tabs></md-gb-tabs>`);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;

      expect(tabs.classList.contains('tabs')).toBeTrue();
      expect(tabs.shadowRoot!.querySelector('.tabs'))
        .withContext('.tabs must not be a shadow wrapper')
        .toBeNull();
    });

    it('sets the tablist role and focusgroup', async () => {
      const root = env.render(html`<md-gb-tabs></md-gb-tabs>`);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;

      expect(tabs[internals].role).toBe('tablist');
      expect(tabs.getAttribute('focusgroup')).toBe('tablist inline');
    });

    it('treats vertical orientation as a visual no-op with tablist block focusgroup', async () => {
      const root = env.render(html`
        <md-gb-tabs orientation="vertical">
          <md-gb-tab><span slot="label">Flights</span></md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;

      expect(getComputedStyle(tabs).flexDirection).toBe('row');
      expect(tabs.getAttribute('focusgroup')).toBe('tablist block');
    });

    it('toggles .tabs-secondary with the variant property', async () => {
      const root = env.render(html`<md-gb-tabs></md-gb-tabs>`);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;

      expect(tabs.variant).toBe('primary');
      expect(tabs.classList.contains('tabs-secondary')).toBeFalse();

      tabs.variant = 'secondary';
      await env.waitForStability();
      expect(tabs.classList.contains('tabs-secondary')).toBeTrue();
      expect(tabs.getAttribute('variant')).toBe('secondary');

      tabs.variant = 'primary';
      await env.waitForStability();
      expect(tabs.classList.contains('tabs-secondary')).toBeFalse();
    });

    it('adopts its stylesheet into both its shadow root and its scope', async () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({mode: 'open'});
      document.body.appendChild(host);
      const tabs = document.createElement('md-gb-tabs');
      shadow.appendChild(tabs);
      await tabs.updateComplete;

      const sheet = tabsStyles.styleSheet!;
      expect(Array.from(shadow.adoptedStyleSheets))
        .withContext('connected scope')
        .toContain(sheet);
      expect(Array.from(tabs.shadowRoot!.adoptedStyleSheets))
        .withContext('own shadow root')
        .toContain(sheet);

      host.remove();
    });

    it('selects a clicked tab, deselects the previous one, and fires change', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab><span slot="label">One</span></md-gb-tab>
          <md-gb-tab><span slot="label">Two</span></md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const [first, second] = Array.from(root.querySelectorAll('md-gb-tab'));
      const onChange = jasmine.createSpy('change');
      tabs.addEventListener('change', onChange);

      second.click();
      await env.waitForStability();

      expect(second.selected).toBeTrue();
      expect(first.selected).toBeFalse();
      expect(tabs.selectedTabIndex).toBe(1);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('hides the tabpanels of unselected tabs', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab tabpanel="one"><span slot="label">One</span></md-gb-tab>
          <md-gb-tab tabpanel="two"><span slot="label">Two</span></md-gb-tab>
        </md-gb-tabs>
        <md-aria-tabpanel id="one">One</md-aria-tabpanel>
        <md-aria-tabpanel id="two">Two</md-aria-tabpanel>
      `);
      await env.waitForStability();
      const [panelOne, panelTwo] = Array.from(
        root.querySelectorAll('md-aria-tabpanel'),
      );

      expect(panelOne.hidden).toBeFalse();
      expect(panelTwo.hidden).toBeTrue();
    });

    it('scrolls a partially-visible tab into view on focus with clearance', async () => {
      const labels = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
      const root = env.render(html`
        <div style="width: 200px;">
          <md-gb-tabs>
            ${labels.map(
              (l) => html`
                <md-gb-tab><span slot="label">${l}</span></md-gb-tab>
              `,
            )}
          </md-gb-tabs>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const tabsRect = tabs.getBoundingClientRect();
      const allTabs = Array.from(tabs.querySelectorAll('md-gb-tab'));

      const straddlingTab = allTabs.find((tab) => {
        const rect = tab.getBoundingClientRect();
        return rect.left < tabsRect.right && rect.right > tabsRect.right;
      })!;
      expect(straddlingTab).toBeDefined();
      expect(tabs.scrollLeft).toBe(0);
      straddlingTab.focus();

      expect(tabs.scrollLeft).toBeGreaterThan(0);
      const updatedTabsRect = tabs.getBoundingClientRect();
      const updatedTabRect = straddlingTab.getBoundingClientRect();
      expect(
        updatedTabsRect.right - updatedTabRect.right,
      ).toBeGreaterThanOrEqual(3);
      expect(updatedTabRect.left - updatedTabsRect.left).toBeGreaterThanOrEqual(
        0,
      );
    });

    it('keeps focused tab fully visible across the overflow boundary without one-tab lag', async () => {
      const labels = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
      const root = env.render(html`
        <div style="width: 200px;">
          <md-gb-tabs>
            ${labels.map(
              (l) => html`
                <md-gb-tab><span slot="label">${l} tab</span></md-gb-tab>
              `,
            )}
          </md-gb-tabs>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const tabsRect = tabs.getBoundingClientRect();
      const allTabs = Array.from(tabs.querySelectorAll('md-gb-tab'));

      const straddlingIndex = allTabs.findIndex((tab) => {
        const rect = tab.getBoundingClientRect();
        return rect.left < tabsRect.right && rect.right > tabsRect.right;
      });
      expect(straddlingIndex).toBeGreaterThan(0);

      const consecutiveTabs = [
        allTabs[straddlingIndex - 1],
        allTabs[straddlingIndex],
        allTabs[straddlingIndex + 1],
      ];

      for (const tab of consecutiveTabs) {
        tab.focus();
        const currentTabsRect = tabs.getBoundingClientRect();
        const currentTabRect = tab.getBoundingClientRect();
        expect(currentTabRect.left).toBeGreaterThanOrEqual(
          currentTabsRect.left,
        );
        expect(currentTabRect.right).toBeLessThanOrEqual(currentTabsRect.right);
      }
    });

    it('scrolls a leading-edge partially-visible tab into view on backwards focus with clearance', async () => {
      const labels = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
      const root = env.render(html`
        <div style="width: 200px;">
          <md-gb-tabs>
            ${labels.map(
              (l) => html`
                <md-gb-tab><span slot="label">${l} tab</span></md-gb-tab>
              `,
            )}
          </md-gb-tabs>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const allTabs = Array.from(tabs.querySelectorAll('md-gb-tab'));

      // Scroll tabs all the way to the end so early tabs are scrolled out past the leading edge.
      tabs.scrollLeft = tabs.scrollWidth - tabs.clientWidth;
      const initialScrollLeft = tabs.scrollLeft;
      expect(initialScrollLeft).toBeGreaterThan(0);

      const tabsRect = tabs.getBoundingClientRect();
      // Find a tab that straddles the leading edge (left < tabsRect.left && right > tabsRect.left).
      const straddlingLeadingTab = allTabs.find((tab) => {
        const rect = tab.getBoundingClientRect();
        return rect.left < tabsRect.left && rect.right > tabsRect.left;
      })!;
      expect(straddlingLeadingTab).toBeDefined();

      straddlingLeadingTab.focus();

      expect(tabs.scrollLeft).toBeLessThan(initialScrollLeft);
      const updatedTabsRect = tabs.getBoundingClientRect();
      const updatedTabRect = straddlingLeadingTab.getBoundingClientRect();
      expect(updatedTabRect.left - updatedTabsRect.left).toBeGreaterThanOrEqual(
        3,
      );
      expect(
        updatedTabsRect.right - updatedTabRect.right,
      ).toBeGreaterThanOrEqual(0);
    });

    it('does not scroll container when tabs container itself receives focus', async () => {
      const root = env.render(html`
        <div style="width: 200px;">
          <md-gb-tabs tabindex="0">
            <md-gb-tab><span slot="label">One</span></md-gb-tab>
            <md-gb-tab><span slot="label">Two</span></md-gb-tab>
          </md-gb-tabs>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const scrollIntoViewSpy = spyOn(tabs, 'scrollIntoView');
      tabs.focus();
      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
    });
  });

  describe('raw HTML mode', () => {
    it('scrolls on overflow in both modes, with no scrollable modifier', async () => {
      const labels = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
      const root = env.render(html`
        <div style="width: 200px;">
          <md-gb-tabs id="element">
            ${labels.map(
              (l) => html`
                <md-gb-tab><span slot="label">${l} tab</span></md-gb-tab>
              `,
            )}
          </md-gb-tabs>
          <div id="raw" class="tabs" role="tablist">
            ${labels.map(
              (l) => html`
                <button class="tab" role="tab"
                  ><span class="tab-label"> ${l} tab </span></button
                >
              `,
            )}
          </div>
        </div>
      `);
      await env.waitForStability();
      const element = root.querySelector<HTMLElement>('#element')!;
      const raw = root.querySelector<HTMLElement>('#raw')!;

      expect(element.scrollWidth).toBeGreaterThan(element.clientWidth + 1);
      expect(raw.scrollWidth).toBeGreaterThan(raw.clientWidth + 1);
    });

    it('scrolls partially-visible tab into view in raw HTML mode with setupTabs', async () => {
      const labels = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
      const root = env.render(html`
        <div style="width: 200px;">
          <div class="tabs" role="tablist">
            ${labels.map(
              (l) => html`
                <button class="tab" role="tab"
                  ><span class="tab-label">${l} tab</span></button
                >
              `,
            )}
          </div>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      setupTabs(tabs);

      const tabsRect = tabs.getBoundingClientRect();
      const buttons = Array.from(
        tabs.querySelectorAll<HTMLButtonElement>('.tab'),
      );
      const straddlingTab = buttons.find((btn) => {
        const rect = btn.getBoundingClientRect();
        return rect.left < tabsRect.right && rect.right > tabsRect.right;
      })!;
      expect(straddlingTab).toBeDefined();
      expect(tabs.scrollLeft).toBe(0);

      straddlingTab.focus();

      expect(tabs.scrollLeft).toBeGreaterThan(0);
      const updatedTabsRect = tabs.getBoundingClientRect();
      const updatedTabRect = straddlingTab.getBoundingClientRect();
      expect(
        updatedTabsRect.right - updatedTabRect.right,
      ).toBeGreaterThanOrEqual(3);
      expect(updatedTabRect.left - updatedTabsRect.left).toBeGreaterThanOrEqual(
        0,
      );
    });

    it('scrolls a leading-edge partially-visible tab into view on backwards focus in raw HTML mode with setupTabs', async () => {
      const labels = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
      const root = env.render(html`
        <div style="width: 200px;">
          <div class="tabs" role="tablist">
            ${labels.map(
              (l) => html`
                <button class="tab" role="tab"
                  ><span class="tab-label">${l} tab</span></button
                >
              `,
            )}
          </div>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      setupTabs(tabs);

      // Scroll tabs all the way to the end so early tabs are scrolled out past the leading edge.
      tabs.scrollLeft = tabs.scrollWidth - tabs.clientWidth;
      const initialScrollLeft = tabs.scrollLeft;
      expect(initialScrollLeft).toBeGreaterThan(0);

      const tabsRect = tabs.getBoundingClientRect();
      const buttons = Array.from(
        tabs.querySelectorAll<HTMLButtonElement>('.tab'),
      );
      // Find a button that straddles the leading edge (left < tabsRect.left && right > tabsRect.left).
      const straddlingLeadingTab = buttons.find((btn) => {
        const rect = btn.getBoundingClientRect();
        return rect.left < tabsRect.left && rect.right > tabsRect.left;
      })!;
      expect(straddlingLeadingTab).toBeDefined();

      straddlingLeadingTab.focus();

      expect(tabs.scrollLeft).toBeLessThan(initialScrollLeft);
      const updatedTabsRect = tabs.getBoundingClientRect();
      const updatedTabRect = straddlingLeadingTab.getBoundingClientRect();
      expect(updatedTabRect.left - updatedTabsRect.left).toBeGreaterThanOrEqual(
        3,
      );
      expect(
        updatedTabsRect.right - updatedTabRect.right,
      ).toBeGreaterThanOrEqual(0);
    });
  });

  describe('indicator', () => {
    it('positions the raw-HTML indicator to bracket the label with 2px inset', async () => {
      const root = env.render(html`
        <div
          class="tabs"
          role="tablist"
          style="position: relative; width: 400px;">
          <button class="tab selected" role="tab" aria-selected="true">
            <span class="tab-label">Flights</span>
          </button>
          <button class="tab" role="tab" aria-selected="false">
            <span class="tab-label">Trips</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      const label = tabs.querySelector<HTMLElement>(
        '.tab.selected .tab-label',
      )!;
      const labelRect = label.getBoundingClientRect();
      const tabsRect = tabs.getBoundingClientRect();
      const after = getComputedStyle(tabs, '::after');
      const afterLeft = parsePixels(after.left);
      const afterWidth = parsePixels(after.width);

      expect(afterLeft).toBeCloseTo(labelRect.left - tabsRect.left + 2, 0);
      expect(afterLeft + afterWidth).toBeCloseTo(
        labelRect.right - tabsRect.left - 2,
        0,
      );
    });

    it('floors the rendered indicator width at 20px for short labels', async () => {
      const root = env.render(html`
        <div class="tabs" role="tablist">
          <button class="tab selected" role="tab" aria-selected="true">
            <span class="tab-label">A</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      const after = getComputedStyle(tabs, '::after');

      // 24px content floor - 2px * 2 inset = 20px
      expect(after.width).toBe('20px');
    });

    it('spans the full tab width in secondary variant', async () => {
      const root = env.render(html`
        <div class="tabs tabs-secondary" role="tablist" style="width: 400px;">
          <button class="tab selected" role="tab" aria-selected="true">
            <span class="tab-label">Flights</span>
          </button>
          <button class="tab" role="tab" aria-selected="false">
            <span class="tab-label">Trips</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      const selectedTab = tabs.querySelector<HTMLElement>('.tab.selected')!;
      const tabRect = selectedTab.getBoundingClientRect();
      const after = getComputedStyle(tabs, '::after');

      expect(parsePixels(after.width)).toBeCloseTo(tabRect.width, 0);
    });

    it('isolates indicator anchors per tabs bar using anchor-scope', async () => {
      const root = env.render(html`
        <div
          id="bar1"
          class="tabs"
          role="tablist"
          style="display: flex; width: 400px;">
          <button class="tab selected" role="tab" aria-selected="true">
            <span class="tab-label">First</span>
          </button>
          <button class="tab" role="tab" aria-selected="false">
            <span class="tab-label">Second</span>
          </button>
        </div>
        <div
          id="bar2"
          class="tabs"
          role="tablist"
          style="display: flex; width: 400px;">
          <button class="tab" role="tab" aria-selected="false">
            <span class="tab-label">First</span>
          </button>
          <button class="tab selected" role="tab" aria-selected="true">
            <span class="tab-label">Second</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const bar1 = root.querySelector<HTMLElement>('#bar1')!;
      const bar2 = root.querySelector<HTMLElement>('#bar2')!;
      const [bar1Tab0] = Array.from(bar1.querySelectorAll<HTMLElement>('.tab'));
      const [, bar2Tab1] = Array.from(
        bar2.querySelectorAll<HTMLElement>('.tab'),
      );

      const bar1Rect = bar1.getBoundingClientRect();
      const bar2Rect = bar2.getBoundingClientRect();
      const after1 = getComputedStyle(bar1, '::after');
      const after2 = getComputedStyle(bar2, '::after');

      const after1Center =
        parsePixels(after1.left) + parsePixels(after1.width) / 2;
      const tab1Center =
        bar1Tab0.getBoundingClientRect().left -
        bar1Rect.left +
        bar1Tab0.getBoundingClientRect().width / 2;
      expect(after1Center).toBeCloseTo(tab1Center, 0);

      const after2Center =
        parsePixels(after2.left) + parsePixels(after2.width) / 2;
      const tab2Center =
        bar2Tab1.getBoundingClientRect().left -
        bar2Rect.left +
        bar2Tab1.getBoundingClientRect().width / 2;
      expect(after2Center).toBeCloseTo(tab2Center, 0);
    });

    it('hides ::after when nothing is selected', async () => {
      const root = env.render(html`
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" aria-selected="false">
            <span class="tab-label">Flights</span>
          </button>
          <button class="tab" role="tab" aria-selected="false">
            <span class="tab-label">Trips</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const after = getComputedStyle(root.querySelector('.tabs')!, '::after');

      expect(after.display).toBe('none');
    });

    it('brackets label and badge in element mode', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab selected>
            <span slot="label">Flights</span>
            <span class="badge tab-badge" slot="badge">3</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const after = getComputedStyle(tabs, '::after');
      const width = parsePixels(after.width);

      expect(width).toBeGreaterThan(20);
    });

    it('renders the badge after the label in flat-tree order in element mode', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab selected>
            <span slot="label">Flights</span>
            <span class="badge tab-badge" slot="badge">3</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;
      const label = tab.querySelector<HTMLElement>('[slot="label"]')!;
      const badge = tab.querySelector<HTMLElement>('[slot="badge"]')!;

      expect(badge.getBoundingClientRect().left).toBeGreaterThan(
        label.getBoundingClientRect().right - 1,
      );
    });

    it('brackets label and badge in raw-HTML mode', async () => {
      const root = env.render(html`
        <div class="tabs" role="tablist">
          <button
            class="tab focus-ring-inner ripple selected"
            role="tab"
            aria-selected="true">
            <span class="tab-label">Flights</span>
            <span class="badge tab-badge">3</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      const after = getComputedStyle(tabs, '::after');
      const width = parsePixels(after.width);

      expect(width).toBeGreaterThan(20);
    });

    it('renders indicator with non-zero extent inside a nested shadow root', async () => {
      const host = document.createElement('div');
      const shadow = host.attachShadow({mode: 'open'});
      document.body.appendChild(host);

      const tabs = document.createElement('md-gb-tabs');
      const tab1 = document.createElement('md-gb-tab');
      tab1.selected = true;
      const label1 = document.createElement('span');
      label1.slot = 'label';
      label1.textContent = 'Flights';
      tab1.appendChild(label1);

      const tab2 = document.createElement('md-gb-tab');
      const label2 = document.createElement('span');
      label2.slot = 'label';
      label2.textContent = 'Trips';
      tab2.appendChild(label2);

      tabs.appendChild(tab1);
      tabs.appendChild(tab2);
      shadow.appendChild(tabs);

      await tabs.updateComplete;
      await tab1.updateComplete;
      await tab2.updateComplete;

      const after = getComputedStyle(tabs, '::after');
      const width = parsePixels(after.width);

      expect(after.display).not.toBe('none');
      expect(width).toBeGreaterThan(0);

      host.remove();
    });

    it('brackets content and respects 20px floor for icon-only tabs', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab selected>
            <span class="md-icon">flight</span>
          </md-gb-tab>
          <md-gb-tab>
            <span class="md-icon">hotel</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const after = getComputedStyle(tabs, '::after');
      const width = parsePixels(after.width);

      // Icon container is 24px - 2px*2 inset = 20px floor
      expect(width).toBe(20);
    });

    it('brackets only the icon and anchors badge in primary icon-only + badge tabs', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab selected>
            <span class="md-icon">flight</span>
            <span class="badge tab-badge" slot="badge">3</span>
          </md-gb-tab>
          <md-gb-tab>
            <span class="md-icon">hotel</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tabs = root.querySelector('md-gb-tabs')!;
      const tab = tabs.querySelector('md-gb-tab[selected]')!;
      const icon = tab.querySelector<HTMLElement>('.md-icon')!;
      const badge = tab.querySelector<HTMLElement>('[slot="badge"]')!;

      const tabsRect = tabs.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();

      // Top-right corner of the icon, inset by 6px
      expect(badgeRect.top).toBeCloseTo(iconRect.top, 0);
      expect(badgeRect.left).toBeCloseTo(iconRect.right - 6, 0);

      // Brackets ONLY the icon (24px - 2px*2 inset = 20px floor, centered under icon)
      const after = getComputedStyle(tabs, '::after');
      const afterLeft = parsePixels(after.left);
      const afterWidth = parsePixels(after.width);
      expect(afterLeft).toBeCloseTo(iconRect.left - tabsRect.left + 2, 0);
      expect(afterWidth).toBe(20);
    });

    it('brackets only the icon and anchors badge in primary icon-only + badge raw-HTML mode', async () => {
      const root = env.render(html`
        <div class="tabs" role="tablist">
          <button class="tab selected" role="tab" aria-selected="true">
            <span class="md-icon">flight</span>
            <span class="badge tab-badge">3</span>
          </button>
          <button class="tab" role="tab" aria-selected="false">
            <span class="md-icon">hotel</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      const tab = tabs.querySelector<HTMLElement>('.tab.selected')!;
      const icon = tab.querySelector<HTMLElement>('.md-icon')!;
      const badge = tab.querySelector<HTMLElement>('.tab-badge')!;

      const tabsRect = tabs.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();

      // Top-right corner of the icon, inset by 6px
      expect(badgeRect.top).toBeCloseTo(iconRect.top, 0);
      expect(badgeRect.left).toBeCloseTo(iconRect.right - 6, 0);

      const after = getComputedStyle(tabs, '::after');
      const afterLeft = parsePixels(after.left);
      const afterWidth = parsePixels(after.width);
      expect(afterLeft).toBeCloseTo(iconRect.left - tabsRect.left + 2, 0);
      expect(afterWidth).toBe(20);
    });

    it('keeps badge in flex flow after the icon with a 4px gap in secondary icon-only + badge tabs', async () => {
      const root = env.render(html`
        <md-gb-tabs variant="secondary">
          <md-gb-tab>
            <span class="md-icon">flight</span>
            <span class="badge tab-badge" slot="badge">3</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;
      const icon = tab.querySelector<HTMLElement>('.md-icon')!;
      const badge = tab.querySelector<HTMLElement>('[slot="badge"]')!;

      const iconRect = icon.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();

      // In secondary tabs, badge remains in-flow after the icon with 4px gap
      expect(badgeRect.left - iconRect.right).toBeCloseTo(4, 0);
    });

    it('scrolls overflowing tab into view on focus with scroll margin', async () => {
      const labels = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'];
      const root = env.render(html`
        <div style="width: 200px;">
          <div id="scroll-test-bar" class="tabs" role="tablist">
            ${labels.map(
              (l) => html`
                <button class="tab" role="tab"
                  ><span class="tab-label">${l} tab</span></button
                >
              `,
            )}
          </div>
        </div>
      `);
      await env.waitForStability();
      const tabs = root.querySelector<HTMLElement>('#scroll-test-bar')!;
      const buttons = Array.from(
        tabs.querySelectorAll<HTMLButtonElement>('.tab'),
      );

      // Verify scroll-margin-inline is set on tab items (defaults to 16px leading space)
      expect(getComputedStyle(buttons[0]).scrollMarginInlineStart).toBe('16px');
      expect(getComputedStyle(buttons[0]).scrollMarginInlineEnd).toBe('16px');

      // Focusing a tab overflowed past the trailing edge scrolls it into view with margin
      expect(tabs.scrollLeft).toBe(0);
      buttons[4].focus();

      expect(tabs.scrollLeft).toBeGreaterThan(0);
      const tab4Rect = buttons[4].getBoundingClientRect();
      const tabsRect = tabs.getBoundingClientRect();
      // Tab 4 is fully in view, with clearance for its focus ring (at least 3px)
      expect(tabsRect.right - tab4Rect.right).toBeGreaterThanOrEqual(3);
    });
  });

  describe('stacked tabs with badges', () => {
    it('anchor-positions badge to the top-right of the icon inset by 6px in primary stacked element mode', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab id="control">
            <span class="md-icon">flight</span>
            <span slot="label">Flights</span>
          </md-gb-tab>
          <md-gb-tab id="test" selected>
            <span class="md-icon">flight</span>
            <span slot="label">Flights</span>
            <span class="badge tab-badge" slot="badge">3</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const control = root.querySelector<HTMLElement>('#control')!;
      const test = root.querySelector<HTMLElement>('#test')!;
      const controlIcon = control.querySelector<HTMLElement>('.md-icon')!;
      const controlLabel =
        control.querySelector<HTMLElement>('[slot="label"]')!;
      const icon = test.querySelector<HTMLElement>('.md-icon')!;
      const label = test.querySelector<HTMLElement>('[slot="label"]')!;
      const badge = test.querySelector<HTMLElement>('[slot="badge"]')!;

      const iconRect = icon.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();
      const controlIconRect = controlIcon.getBoundingClientRect();
      const controlLabelRect = controlLabel.getBoundingClientRect();

      // Top-right corner of the icon, inset by 6px
      expect(badgeRect.top).toBeCloseTo(iconRect.top, 0);
      expect(badgeRect.left).toBeCloseTo(iconRect.right - 6, 0);

      // Badge is out of flex flow: icon and label have the same vertical positions
      expect(iconRect.top).toBeCloseTo(controlIconRect.top, 0);
      expect(labelRect.top).toBeCloseTo(controlLabelRect.top, 0);

      // Active indicator brackets ONLY the label (labelRect.left + 2 to labelRect.right - 2)
      const tabs = root.querySelector('md-gb-tabs')!;
      const tabsRect = tabs.getBoundingClientRect();
      const after = getComputedStyle(tabs, '::after');
      const afterLeft = parsePixels(after.left);
      const afterWidth = parsePixels(after.width);
      expect(afterLeft).toBeCloseTo(labelRect.left - tabsRect.left + 2, 0);
      expect(afterLeft + afterWidth).toBeCloseTo(
        labelRect.right - tabsRect.left - 2,
        0,
      );
    });

    it('anchor-positions badge to the top-right of the icon inset by 6px in primary stacked raw-HTML mode', async () => {
      const root = env.render(html`
        <div class="tabs" role="tablist">
          <button id="control" class="tab" role="tab">
            <span class="md-icon">flight</span>
            <span class="tab-label">Flights</span>
          </button>
          <button
            id="test"
            class="tab selected"
            role="tab"
            aria-selected="true">
            <span class="md-icon">flight</span>
            <span class="tab-label">Flights</span>
            <span class="badge tab-badge">3</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const control = root.querySelector<HTMLElement>('#control')!;
      const test = root.querySelector<HTMLElement>('#test')!;
      const controlIcon = control.querySelector<HTMLElement>('.md-icon')!;
      const controlLabel = control.querySelector<HTMLElement>('.tab-label')!;
      const icon = test.querySelector<HTMLElement>('.md-icon')!;
      const label = test.querySelector<HTMLElement>('.tab-label')!;
      const badge = test.querySelector<HTMLElement>('.tab-badge')!;

      const iconRect = icon.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();
      const controlIconRect = controlIcon.getBoundingClientRect();
      const controlLabelRect = controlLabel.getBoundingClientRect();

      // Top-right corner of the icon, inset by 6px
      expect(badgeRect.top).toBeCloseTo(iconRect.top, 0);
      expect(badgeRect.left).toBeCloseTo(iconRect.right - 6, 0);

      // Badge is out of flex flow: icon and label have the same vertical positions
      expect(iconRect.top).toBeCloseTo(controlIconRect.top, 0);
      expect(labelRect.top).toBeCloseTo(controlLabelRect.top, 0);

      // Active indicator brackets ONLY the label
      const tabs = root.querySelector<HTMLElement>('.tabs')!;
      const tabsRect = tabs.getBoundingClientRect();
      const after = getComputedStyle(tabs, '::after');
      const afterLeft = parsePixels(after.left);
      const afterWidth = parsePixels(after.width);
      expect(afterLeft).toBeCloseTo(labelRect.left - tabsRect.left + 2, 0);
      expect(afterLeft + afterWidth).toBeCloseTo(
        labelRect.right - tabsRect.left - 2,
        0,
      );
    });

    it('isolates icon anchor across multiple stacked tabs in the same bar', async () => {
      const root = env.render(html`
        <md-gb-tabs>
          <md-gb-tab id="tab1">
            <span class="md-icon">flight</span>
            <span slot="label">Flights</span>
            <span class="badge tab-badge" slot="badge">1</span>
          </md-gb-tab>
          <md-gb-tab id="tab2">
            <span class="md-icon">hotel</span>
            <span slot="label">Hotels</span>
            <span class="badge tab-badge" slot="badge">2</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tab1 = root.querySelector<HTMLElement>('#tab1')!;
      const tab2 = root.querySelector<HTMLElement>('#tab2')!;
      const tab1Icon = tab1.querySelector<HTMLElement>('.md-icon')!;
      const tab1Badge = tab1.querySelector<HTMLElement>('[slot="badge"]')!;
      const tab2Icon = tab2.querySelector<HTMLElement>('.md-icon')!;
      const tab2Badge = tab2.querySelector<HTMLElement>('[slot="badge"]')!;

      const tab1IconRect = tab1Icon.getBoundingClientRect();
      const tab1BadgeRect = tab1Badge.getBoundingClientRect();
      const tab2IconRect = tab2Icon.getBoundingClientRect();
      const tab2BadgeRect = tab2Badge.getBoundingClientRect();

      expect(tab1BadgeRect.left).toBeCloseTo(tab1IconRect.right - 6, 0);
      expect(tab2BadgeRect.left).toBeCloseTo(tab2IconRect.right - 6, 0);
    });

    it('keeps badge in flex flow after the label with a 4px gap in secondary tabs', async () => {
      const root = env.render(html`
        <md-gb-tabs variant="secondary">
          <md-gb-tab>
            <span class="md-icon">flight</span>
            <span slot="label">Flights</span>
            <span class="badge tab-badge" slot="badge">3</span>
          </md-gb-tab>
        </md-gb-tabs>
      `);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;
      const label = tab.querySelector<HTMLElement>('[slot="label"]')!;
      const badge = tab.querySelector<HTMLElement>('[slot="badge"]')!;

      const labelRect = label.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();

      // In secondary tabs, badge remains in-flow after the label with 4px gap
      expect(badgeRect.left - labelRect.right).toBeCloseTo(4, 0);
    });
  });
});
