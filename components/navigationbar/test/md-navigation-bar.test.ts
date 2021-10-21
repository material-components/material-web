/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {doesElementContainFocus} from '@material/mwc-base/utils';
import {fixture, ieSafeKeyboardEvent, rafPromise, TestFixture} from 'google3/third_party/javascript/material_web_components/testing/helpers';
import * as hanbi from 'hanbi';
import {html} from 'lit';
import {customElement} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {MDNavigationTab} from '../../navigationtab/navigation-tab';
import {MDNavigationBar} from '../navigation-bar';

@customElement('md-test-navigation-bar')
class TestMDNavigationBar extends MDNavigationBar {
}
@customElement('md-test-navigation-tab')
class TestMDNavigationTab extends MDNavigationTab {
}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-navigation-bar': TestMDNavigationBar;
    'md-test-navigation-tab': TestMDNavigationTab;
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

describe('mwc-navigation-bar', () => {
  let fixt: TestFixture;
  let element: MDNavigationBar;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultNavBarElement);
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('initializes as a mwc-navigation-bar', () => {
      const navBarBase =
          element.shadowRoot!.querySelector('.mdc-navigation-bar')!;
      expect(element).toBeInstanceOf(MDNavigationBar);
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

    it('updates on navigation tab click', async () => {
      const tab1 = element.children[0] as HTMLElement;
      const tab2 = element.children[1] as HTMLElement;
      const tab1Button = tab1.shadowRoot!.querySelector('button')!;
      const tab2Button = tab2.shadowRoot!.querySelector('button')!;

      tab1Button.click();
      expect(element.activeIndex).toEqual(0);
      tab2Button.click();
      expect(element.activeIndex).toEqual(1);
    });
  });

  describe('hideInactiveLabels', () => {
    beforeEach(async () => {
      fixt =
          await fixture(navBarWithNavTabsElement({hideInactiveLabels: true}));
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('affects navigation tab hideInactiveLabel state', () => {
      const tab1 = element.children[0] as MDNavigationTab;
      const tab2 = element.children[1] as MDNavigationTab;
      expect(tab1.hideInactiveLabel).toBeTrue();
      expect(tab2.hideInactiveLabel).toBeTrue();
      element.hideInactiveLabels = false;
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
          element.shadowRoot!.querySelector('.mdc-navigation-bar')!;
      expect(navBarBase.getAttribute('aria-label')).toEqual('foo');
    });
  });

  describe('keydown', () => {
    beforeEach(async () => {
      fixt = await fixture(navBarWithNavTabsElement({activeIndex: 0}));
      element = fixt.root.querySelector('md-test-navigation-bar')!;
      await element.updateComplete;
    });

    it('sets focus on tabs accordingly', async () => {
      const bar = element.shadowRoot!.querySelector('.mdc-navigation-bar')!;
      const tab1 = element.children[0] as HTMLElement;
      const tab2 = element.children[1] as HTMLElement;
      tab1.focus();

      const arrowRightEv = ieSafeKeyboardEvent('keydown', 39);
      bar.dispatchEvent(arrowRightEv);
      expect(doesElementContainFocus(tab2)).toBeTrue();

      const arrowLeftEv = ieSafeKeyboardEvent('keydown', 37);
      bar.dispatchEvent(arrowLeftEv);
      expect(doesElementContainFocus(tab1)).toBeTrue();
    });
  });
});
