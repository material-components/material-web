/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {Environment} from '../../testing/environment.js';
import {NavigationTabHarness} from '../navigationtab/harness.js';
import {MdNavigationTab} from '../navigationtab/navigation-tab.js';

import {NavigationBarHarness} from './harness.js';
import {MdNavigationBar} from './navigation-bar.js';

@customElement('md-test-navigation-bar')
class TestMdNavigationBar extends MdNavigationBar {}
@customElement('md-test-navigation-bar-tab')
class TestMdNavigationTab extends MdNavigationTab {}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-navigation-bar': TestMdNavigationBar;
    'md-test-navigation-bar-tab': TestMdNavigationTab;
  }
}

interface NavigationBarProps {
  activeIndex: number;
  hideInactiveLabels: boolean;
  ariaLabel?: string;
}

const defaultNavBar = html`
  <md-test-navigation-bar>
    <md-test-navigation-bar-tab label="One"></md-test-navigation-bar-tab>
  </md-test-navigation-bar>
`;

const navBarWithNavTabsElement = (propsInit: Partial<NavigationBarProps>) => {
  return html`
    <md-test-navigation-bar
      .activeIndex="${propsInit.activeIndex ?? 0}"
      .hideInactiveLabels="${propsInit.hideInactiveLabels === true}"
      aria-label="${ifDefined(propsInit.ariaLabel)}">
      <md-test-navigation-bar-tab label="One"></md-test-navigation-bar-tab>
      <md-test-navigation-bar-tab label="Two"></md-test-navigation-bar-tab>
    </md-test-navigation-bar>
  `;
};

// The following is a Navbar with the tabs being out of sync with the bar.
const navBarWithIncorrectTabsElement = html` <md-test-navigation-bar
  activeIndex="0">
  <md-test-navigation-bar-tab
    label="One"
    hideInactiveLabel></md-test-navigation-bar-tab>
  <md-test-navigation-bar-tab label="One" active></md-test-navigation-bar-tab>
</md-test-navigation-bar>`;

describe('md-navigation-bar', () => {
  const env = new Environment();

  async function setupTest(template = defaultNavBar) {
    const element = env
      .render(template)
      .querySelector('md-test-navigation-bar');
    if (!element) {
      throw new Error('Could not query rendered <md-test-navigation-bar>.');
    }

    await env.waitForStability();

    return {
      harness: new NavigationBarHarness(element),
    };
  }

  describe('basic', () => {
    it('initializes as a md-navigation-bar', async () => {
      const {harness} = await setupTest();
      const navBarBase = harness.element.shadowRoot!.querySelector(
        '.md3-navigation-bar',
      )!;
      expect(harness.element).toBeInstanceOf(MdNavigationBar);
      expect(harness.element.activeIndex).toEqual(0);
      expect(harness.element.hideInactiveLabels).toBeFalse();
      expect(navBarBase.getAttribute('aria-label')).toEqual(null);
    });
  });

  describe('activeIndex', () => {
    it('on change emits activated event', async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({activeIndex: 1}),
      );
      const activatedHandler = jasmine.createSpy();
      harness.element.addEventListener(
        'navigation-bar-activated',
        activatedHandler,
      );
      harness.element.activeIndex = 0;
      await env.waitForStability();
      expect(activatedHandler).toHaveBeenCalled();
    });

    it('activated event detail contains the tab and activeIndex', async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({activeIndex: 1}),
      );
      const navigationBarActivatedSpy = jasmine.createSpy(
        'navigationBarActivated',
      );
      harness.element.addEventListener(
        'navigation-bar-activated',
        navigationBarActivatedSpy,
      );

      const tab = harness.element.tabs[0];
      harness.element.activeIndex = 0;

      await env.waitForStability();
      expect(navigationBarActivatedSpy).toHaveBeenCalledWith(
        jasmine.any(CustomEvent),
      );
      expect(navigationBarActivatedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          detail: jasmine.objectContaining({tab, activeIndex: 0}),
        }),
      );
    });

    it('#handleNavigationTabInteraction () updates on navigation tab click', async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({activeIndex: 1}),
      );
      const tab1Harness = new NavigationTabHarness(harness.element.tabs[0]);
      const tab2Harness = new NavigationTabHarness(harness.element.tabs[1]);

      await tab1Harness.clickWithMouse();
      expect(harness.element.activeIndex).toEqual(0);
      await tab2Harness.clickWithMouse();
      expect(harness.element.activeIndex).toEqual(1);
    });

    it('#onActiveIndexChange() sets tab at activeIndex to active', async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({activeIndex: 1}),
      );
      const tab = harness.element.tabs[0];
      expect(tab.active).toBeFalse();
      harness.element.activeIndex = 0;
      harness.element.requestUpdate();
      await env.waitForStability();
      expect(tab.active).toBeTrue();
    });

    it('#onActiveIndexChange() sets previously active tab to inactive', async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({activeIndex: 1}),
      );
      const tab = harness.element.tabs[1];
      expect(tab.active).toBeTrue();
      harness.element.activeIndex = 0;
      harness.element.requestUpdate();
      await env.waitForStability();
      expect(tab.active).toBeFalse();
    });
  });

  describe('hideInactiveLabels', () => {
    it('#onHideInactiveLabelsChange() affects navigation tabs hideInactiveLabel state', async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({hideInactiveLabels: true}),
      );
      const tab1 = harness.element.tabs[0];
      const tab2 = harness.element.tabs[1];
      expect(tab1.hideInactiveLabel).toBeTrue();
      expect(tab2.hideInactiveLabel).toBeTrue();
      harness.element.hideInactiveLabels = false;
      harness.element.requestUpdate();
      await env.waitForStability();
      expect(tab1.hideInactiveLabel).toBeFalse();
      expect(tab2.hideInactiveLabel).toBeFalse();
    });
  });

  describe('aria-label', () => {
    it('sets the root aria-label property', async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({ariaLabel: 'foo'}),
      );
      const navBarBase = harness.element.shadowRoot!.querySelector(
        '.md3-navigation-bar',
      )!;
      expect(navBarBase.getAttribute('aria-label')).toEqual('foo');
    });
  });

  describe('#onTabsChange()', () => {
    it(
      "syncs tabs' hideInactiveLabel state with the navigation bar's " +
        'hideInactiveLabels state',
      async () => {
        const {harness} = await setupTest(navBarWithIncorrectTabsElement);
        const tab1 = harness.element.tabs[0];
        const tab2 = harness.element.tabs[1];
        expect(harness.element.hideInactiveLabels).toBeFalse();
        expect(tab1.hideInactiveLabel).toBeFalse();
        expect(tab2.hideInactiveLabel).toBeFalse();
      },
    );

    it("syncs tabs' active state with the navigation bar's activeIndex state", async () => {
      const {harness} = await setupTest(navBarWithIncorrectTabsElement);
      const tab1 = harness.element.tabs[0];
      const tab2 = harness.element.tabs[1];
      expect(harness.element.activeIndex).toBe(0);
      expect(tab1.active).toBeTrue();
      expect(tab2.active).toBeFalse();
    });
  });

  describe('#handleKeydown', () => {
    let element: MdNavigationBar;
    let bar: HTMLElement;
    let tab1: HTMLElement;
    let tab2: HTMLElement;

    beforeEach(async () => {
      const {harness} = await setupTest(
        navBarWithNavTabsElement({activeIndex: 0}),
      );
      element = harness.element;
      bar = harness.element.shadowRoot!.querySelector('.md3-navigation-bar')!;
      tab1 = harness.element.children[0] as HTMLElement;
      tab2 = harness.element.children[1] as HTMLElement;
    });

    it('(Enter) activates the focused tab', async () => {
      const eventRight = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      const eventEnter = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      tab1.focus();
      expect(element.activeIndex).toBe(0);
      bar.dispatchEvent(eventRight);
      bar.dispatchEvent(eventEnter);
      element.requestUpdate();
      await env.waitForStability();
      expect(element.activeIndex).toBe(1);
    });

    it('(Spacebar) activates the focused tab', async () => {
      const eventRight = new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
      });
      const eventSpacebar = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
      });
      tab1.focus();
      expect(element.activeIndex).toBe(0);
      bar.dispatchEvent(eventRight);
      bar.dispatchEvent(eventSpacebar);
      element.requestUpdate();
      await env.waitForStability();
      expect(element.activeIndex).toBe(1);
    });

    it('(Home) sets focus on the first tab', () => {
      const event = new KeyboardEvent('keydown', {key: 'Home', bubbles: true});
      tab2.focus();
      expect(tab1.matches(':focus-within')).toBeFalse();
      bar.dispatchEvent(event);
      expect(tab1.matches(':focus-within')).toBeTrue();
    });

    it('(End) sets focus on the last tab', () => {
      const event = new KeyboardEvent('keydown', {key: 'End', bubbles: true});
      bar.dispatchEvent(event);
      expect(tab2.matches(':focus-within')).toBeTrue();
    });

    describe('(ArrowLeft)', () => {
      // Use the same key for all tests
      const key = 'ArrowLeft';

      it(`sets focus on previous tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab2.focus();
        bar.dispatchEvent(event);
        expect(tab1.matches(':focus-within')).toBeTrue();
      });

      it(`sets focus to last tab when focus is on the first tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab1.focus();
        bar.dispatchEvent(event);
        expect(tab2.matches(':focus-within')).toBeTrue();
      });

      it(`sets focus on next tab in RTL`, () => {
        document.body.style.direction = 'rtl';
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab1.focus();
        bar.dispatchEvent(event);
        expect(tab2.matches(':focus-within')).toBeTrue();
      });
    });

    describe('(ArrowRight)', () => {
      // Use the same key for all tests
      const key = 'ArrowRight';

      it(`sets focus on next tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab1.focus();
        bar.dispatchEvent(event);
        expect(tab2.matches(':focus-within')).toBeTrue();
      });

      it(`sets focus to first tab when focus is on the last tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab2.focus();
        bar.dispatchEvent(event);
        expect(tab1.matches(':focus-within')).toBeTrue();
      });

      it(`sets focus on previous tab in RTL`, () => {
        document.body.style.direction = 'rtl';
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab2.focus();
        bar.dispatchEvent(event);
        expect(tab1.matches(':focus-within')).toBeTrue();
      });
    });
  });
});
