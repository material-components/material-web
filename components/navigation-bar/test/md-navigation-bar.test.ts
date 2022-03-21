/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {doesElementContainFocus} from '@material/mwc-base/utils';
import {KEY} from 'google3/third_party/javascript/material_components_web/dom/keyboard';
import {fixture, rafPromise, TestFixture} from 'google3/third_party/javascript/material_web_components/testing/helpers';
import * as hanbi from 'hanbi';
import {html} from 'lit';
import {customElement} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {MdNavigationTab} from '../../navigation_tab/navigation-tab';
import {MdNavigationBar} from '../navigation-bar';

@customElement('md-test-navigation-bar')
class TestMdNavigationBar extends MdNavigationBar {
}
@customElement('md-test-navigation-tab')
class TestMdNavigationTab extends MdNavigationTab {
}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-navigation-bar': TestMdNavigationBar;
    'md-test-navigation-tab': TestMdNavigationTab;
  }
}

interface NavigationBarProps {
  activeIndex: number;
  hideInactiveLabels: boolean;
  ariaLabel?: string;
}

const defaultNavBarElement = html`
    <md-test-navigation-bar>
      <md-test-navigation-tab label="One"></md-test-navigation-tab>
    </md-test-navigation-bar>`;

const navBarWithNavTabsElement = (propsInit: Partial<NavigationBarProps>) => {
  return html`
      <md-test-navigation-bar
          .activeIndex="${propsInit.activeIndex ?? 0}"
          .hideInactiveLabels="${propsInit.hideInactiveLabels === true}"
          aria-label="${ifDefined(propsInit.ariaLabel)}">
        <md-test-navigation-tab label="One"></md-test-navigation-tab>
        <md-test-navigation-tab label="Two"></md-test-navigation-tab>
      </md-test-navigation-bar>
  `;
};

// The following is a Navbar with the tabs being out of sync with the bar.
const navBarWithIncorrectTabsElement = html`
    <md-test-navigation-bar activeIndex="0">
      <md-test-navigation-tab label="One" hideInactiveLabel></md-test-navigation-tab>
      <md-test-navigation-tab label="One" active></md-test-navigation-tab>
    </md-test-navigation-bar>`;

describe('md-navigation-bar', () => {
  let fixt: TestFixture;
  let element: MdNavigationBar;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultNavBarElement);
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('initializes as a md-navigation-bar', () => {
      const navBarBase =
          element.shadowRoot!.querySelector('.md3-navigation-bar')!;
      expect(element).toBeInstanceOf(MdNavigationBar);
      expect(element.activeIndex).toEqual(0);
      expect(element.hideInactiveLabels).toBeFalse();
      expect(navBarBase.getAttribute('aria-label')).toEqual(null);
    });
  });

  describe('activeIndex', () => {
    beforeEach(async () => {
      fixt = await fixture(navBarWithNavTabsElement({activeIndex: 1}));
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('on change emits activated event', async () => {
      const activatedHandler = hanbi.spy();
      element.addEventListener(
          'navigation-bar-activated', activatedHandler.handler);
      element.activeIndex = 0;
      await rafPromise();
      expect(activatedHandler.called).toBeTrue();
    });

    it('#handleNavigationTabInteraction () updates on navigation tab click',
       async () => {
         const tab1 = element.children[0] as HTMLElement;
         const tab2 = element.children[1] as HTMLElement;
         const tab1Button = tab1.shadowRoot!.querySelector('button')!;
         const tab2Button = tab2.shadowRoot!.querySelector('button')!;

         tab1Button.click();
         expect(element.activeIndex).toEqual(0);
         tab2Button.click();
         expect(element.activeIndex).toEqual(1);
       });

    it('#onActiveIndexChange() sets tab at activeIndex to active', async () => {
      const tab = element.tabs[0];
      expect(tab.active).toBeFalse();
      element.activeIndex = 0;
      element.requestUpdate();
      await element.updateComplete;
      expect(tab.active).toBeTrue();
    });

    it('#onActiveIndexChange() sets previously active tab to inactive',
       async () => {
         const tab = element.tabs[1];
         expect(tab.active).toBeTrue();
         element.activeIndex = 0;
         element.requestUpdate();
         await element.updateComplete;
         expect(tab.active).toBeFalse();
       });
  });

  describe('hideInactiveLabels', () => {
    beforeEach(async () => {
      fixt =
          await fixture(navBarWithNavTabsElement({hideInactiveLabels: true}));
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('#onHideInactiveLabelsChange() affects navigation tabs hideInactiveLabel state',
       async () => {
         const tab1 = element.tabs[0];
         const tab2 = element.tabs[1];
         expect(tab1.hideInactiveLabel).toBeTrue();
         expect(tab2.hideInactiveLabel).toBeTrue();
         element.hideInactiveLabels = false;
         element.requestUpdate();
         await element.updateComplete;
         expect(tab1.hideInactiveLabel).toBeFalse();
         expect(tab2.hideInactiveLabel).toBeFalse();
       });
  });

  describe('aria-label', () => {
    beforeEach(async () => {
      fixt = await fixture(navBarWithNavTabsElement({ariaLabel: 'foo'}));
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('sets the root aria-label property', () => {
      const navBarBase =
          element.shadowRoot!.querySelector('.md3-navigation-bar')!;
      expect(navBarBase.getAttribute('aria-label')).toEqual('foo');
    });
  });

  describe('#onTabsChange()', () => {
    beforeEach(async () => {
      // navBarWithIncorrectTabsElement contains tabs with states that don't
      // match the bar. Below we test after updateComplete, everything is
      // in sync.
      fixt = await fixture(navBarWithIncorrectTabsElement);
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('syncs tabs\' hideInactiveLabel state with the navigation bar\'s ' +
           'hideInactiveLabels state',
       () => {
         const tab1 = element.tabs[0];
         const tab2 = element.tabs[1];
         expect(element.hideInactiveLabels).toBeFalse();
         expect(tab1.hideInactiveLabel).toBeFalse();
         expect(tab2.hideInactiveLabel).toBeFalse();
       });

    it('syncs tabs\' active state with the navigation bar\'s activeIndex state',
       () => {
         const tab1 = element.tabs[0];
         const tab2 = element.tabs[1];
         expect(element.activeIndex).toBe(0);
         expect(tab1.active).toBeTrue();
         expect(tab2.active).toBeFalse();
       });
  });

  describe('#handleKeydown', () => {
    let bar: HTMLElement;
    let tab1: HTMLElement;
    let tab2: HTMLElement;

    beforeEach(async () => {
      fixt = await fixture(navBarWithNavTabsElement({activeIndex: 0}));
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
      bar = element.shadowRoot!.querySelector('.md3-navigation-bar')!;
      tab1 = element.children[0] as HTMLElement;
      tab2 = element.children[1] as HTMLElement;
    });

    it('(Enter) activates the focused tab', async () => {
      const eventRight =
          new KeyboardEvent('keydown', {key: KEY.ARROW_RIGHT, bubbles: true});
      const eventEnter =
          new KeyboardEvent('keydown', {key: KEY.ENTER, bubbles: true});
      tab1.focus();
      expect(element.activeIndex).toBe(0);
      bar.dispatchEvent(eventRight);
      bar.dispatchEvent(eventEnter);
      element.requestUpdate();
      await element.updateComplete;
      expect(element.activeIndex).toBe(1);
    });

    it('(Spacebar) activates the focused tab', async () => {
      const eventRight =
          new KeyboardEvent('keydown', {key: KEY.ARROW_RIGHT, bubbles: true});
      const eventSpacebar =
          new KeyboardEvent('keydown', {key: KEY.SPACEBAR, bubbles: true});
      tab1.focus();
      expect(element.activeIndex).toBe(0);
      bar.dispatchEvent(eventRight);
      bar.dispatchEvent(eventSpacebar);
      element.requestUpdate();
      await element.updateComplete;
      expect(element.activeIndex).toBe(1);
    });

    it('(Home) sets focus on the first tab', () => {
      const event =
          new KeyboardEvent('keydown', {key: KEY.HOME, bubbles: true});
      tab2.focus();
      expect(doesElementContainFocus(tab1)).toBeFalse();
      bar.dispatchEvent(event);
      expect(doesElementContainFocus(tab1)).toBeTrue();
    });

    it('(End) sets focus on the last tab', () => {
      const event = new KeyboardEvent('keydown', {key: KEY.END, bubbles: true});
      bar.dispatchEvent(event);
      expect(doesElementContainFocus(tab2)).toBeTrue();
    });

    describe('(ArrowLeft)', () => {
      // Use the same key for all tests
      const key = KEY.ARROW_LEFT;

      it(`sets focus on previous tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab2.focus();
        bar.dispatchEvent(event);
        expect(doesElementContainFocus(tab1)).toBeTrue();
      });

      it(`sets focus to last tab when focus is on the first tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab1.focus();
        bar.dispatchEvent(event);
        expect(doesElementContainFocus(tab2)).toBeTrue();
      });

      it(`sets focus on next tab in RTL`, () => {
        document.body.style.direction = 'rtl';
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab1.focus();
        bar.dispatchEvent(event);
        expect(doesElementContainFocus(tab2)).toBeTrue();
      });
    });

    describe('(ArrowRight)', () => {
      // Use the same key for all tests
      const key = KEY.ARROW_RIGHT;

      it(`sets focus on next tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab1.focus();
        bar.dispatchEvent(event);
        expect(doesElementContainFocus(tab2)).toBeTrue();
      });

      it(`sets focus to first tab when focus is on the last tab`, () => {
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab2.focus();
        bar.dispatchEvent(event);
        expect(doesElementContainFocus(tab1)).toBeTrue();
      });

      it(`sets focus on previous tab in RTL`, () => {
        document.body.style.direction = 'rtl';
        const event = new KeyboardEvent('keydown', {key, bubbles: true});
        tab2.focus();
        bar.dispatchEvent(event);
        expect(doesElementContainFocus(tab1)).toBeTrue();
      });
    });
  });
});
