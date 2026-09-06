/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {MdNavigationTab} from '../navigationtab/navigation-tab.js';

import {MdNavigationRail} from './navigation-rail.js';

@customElement('md-test-navigation-rail')
class TestMdNavigationRail extends MdNavigationRail {}
@customElement('md-test-navigation-rail-tab')
class TestMdNavigationRailTab extends MdNavigationTab {}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-navigation-rail': TestMdNavigationRail;
    'md-test-navigation-rail-tab': TestMdNavigationRailTab;
  }
}

describe('md-navigation-rail', () => {
  async function setup() {
    const element = document.createElement(
      'md-test-navigation-rail',
    ) as TestMdNavigationRail;
    for (const label of ['One', 'Two']) {
      const tab = document.createElement(
        'md-test-navigation-rail-tab',
      ) as TestMdNavigationRailTab;
      tab.label = label;
      element.append(tab);
    }
    document.body.append(element);
    await element.updateComplete;
    await Promise.all(element.tabs.map((tab) => tab.updateComplete));
    return element;
  }

  afterEach(() => {
    document.querySelector('md-test-navigation-rail')?.remove();
  });

  it('initializes as a navigation rail with the first tab active', async () => {
    const element = await setup();
    expect(element).toBeInstanceOf(MdNavigationRail);
    expect(element.activeIndex).toBe(0);
    expect(element.tabs[0].active).toBeTrue();
  });

  it('moves focus vertically with arrow keys', async () => {
    const element = await setup();
    const firstTab = element.tabs[0];
    const secondTab = element.tabs[1];
    firstTab.focus();
    element
      .shadowRoot!.querySelector('.md3-navigation-bar')!
      .dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(document.activeElement).toBe(secondTab.buttonElement);
  });

  it('activates a selected tab when clicked', async () => {
    const element = await setup();
    element.tabs[1].handleClick();
    expect(element.activeIndex).toBe(1);
  });
});
