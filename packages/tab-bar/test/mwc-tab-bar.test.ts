/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/mwc-tab';

import {TabBar} from '@material/mwc-tab-bar/mwc-tab-bar';
import {html, TemplateResult} from 'lit-html';

import {fixture, ieSafeKeyboardEvent, rafPromise, TestFixture} from '../../../test/src/util/helpers';

interface TabBarProps {
  activeIndex: number;
  contents: TemplateResult;
}

const defaultTabBar = html`<mwc-tab-bar></mwc-tab-bar>`;

const defaultTabBarWithTabs = html`
  <mwc-tab-bar>
    <mwc-tab></mwc-tab>
  </mwc-tab-bar>`;

const tabBar = (propsInit: Partial<TabBarProps>) => {
  return html`
    <mwc-tab-bar
      .activeIndex=${propsInit.activeIndex ?? 0}>
      ${propsInit.contents ?? html``}
    </mwc-tab-bar>
  `;
};

describe('mwc-tab-bar', () => {
  let fixt: TestFixture;
  let element: TabBar;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultTabBar);
      element = fixt.root.querySelector('mwc-tab-bar')!;
    });

    it('initializes as an mwc-tab-bar', () => {
      expect(element).toBeInstanceOf(TabBar);
      expect(element.activeIndex).toEqual(0);
    });

    it('activates but does not focus tab on init', async () => {
      fixt.remove();
      fixt = await fixture(defaultTabBarWithTabs);
      const tab = fixt.root.querySelector('mwc-tab')!;
      element = fixt.root.querySelector('mwc-tab-bar')!;

      await rafPromise();

      const focusedEl = document.activeElement;
      // IE is null every other browser is body
      const bodyOrNullIsFocused =
          focusedEl === document.body || focusedEl === null;

      expect(bodyOrNullIsFocused).toBeTrue();
      expect(tab.active).toBeTrue();
      expect(element.activeIndex).toEqual(0);
    });
  });

  describe('activation', () => {
    beforeEach(async () => {
      fixt = await fixture(tabBar({
        contents: html`
          <mwc-tab label="one"></mwc-tab>
          <mwc-tab label="two"></mwc-tab>
        `
      }));
      element = fixt.root.querySelector('mwc-tab-bar')!;
      await element.updateComplete;
    });

    it('clicking tab activates it', async () => {
      const tab1 = element.children[0] as HTMLElement;
      const tab2 = element.children[1] as HTMLElement;
      const tab1Button = tab1.shadowRoot!.querySelector('button')!;
      const tab2Button = tab2.shadowRoot!.querySelector('button')!;

      tab2Button.click();
      expect(element.activeIndex).toEqual(1);
      tab1Button.click();
      expect(element.activeIndex).toEqual(0);
    });

    it('responds to key navigation', async () => {
      const bar = element.shadowRoot!.querySelector('.mdc-tab-bar')!;
      const tab1 = element.children[0] as HTMLElement;
      const tab2 = element.children[1] as HTMLElement;
      tab1.focus();

      // right arrow keybode
      const rightEv = ieSafeKeyboardEvent('keydown', 39);
      bar.dispatchEvent(rightEv);
      expect(fixt.root.activeElement).toEqual(tab2);

      // left arrow keycode
      const leftEv = ieSafeKeyboardEvent('keydown', 37);
      bar.dispatchEvent(leftEv);
      expect(fixt.root.activeElement).toEqual(tab1);
    });
  });
});
