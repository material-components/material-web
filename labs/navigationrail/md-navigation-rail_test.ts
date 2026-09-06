/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {MdNavigationTab} from '../navigationtab/navigation-tab.js';

import {NavigationRailHarness} from './harness.js';
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
  const env = new Environment();

  async function setup() {
    const element = env
      .render(html`
        <md-test-navigation-rail>
          <md-test-navigation-rail-tab
            label="One"
          ></md-test-navigation-rail-tab>
          <md-test-navigation-rail-tab
            label="Two"
          ></md-test-navigation-rail-tab>
        </md-test-navigation-rail>
      `)
      .querySelector('md-test-navigation-rail')!;
    await env.waitForStability();
    return new NavigationRailHarness(element);
  }

  it('initializes as a navigation rail with the first tab active', async () => {
    const harness = await setup();
    expect(harness.element).toBeInstanceOf(MdNavigationRail);
    expect(harness.element.activeIndex).toBe(0);
    expect(harness.element.tabs[0].active).toBeTrue();
  });

  it('moves focus vertically with arrow keys', async () => {
    const harness = await setup();
    const firstTab = harness.element.tabs[0];
    const secondTab = harness.element.tabs[1];
    firstTab.focus();
    harness.element.dispatchEvent(
      new KeyboardEvent('keydown', {key: 'ArrowDown'}),
    );
    expect(document.activeElement).toBe(secondTab.buttonElement);
  });

  it('activates a selected tab when clicked', async () => {
    const harness = await setup();
    harness.element.tabs[1].handleClick();
    await env.waitForStability();
    expect(harness.element.activeIndex).toBe(1);
  });
});
