/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {doesElementContainFocus} from '@material/web/compat/base/utils.js';
import {fixture, TestFixture} from '@material/web/compat/testing/helpers.js';
import {MdFocusRing} from '@material/web/focus/focus-ring.js';
import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {NavigationTabHarness} from './harness.js';
import {MdNavigationTab} from './navigation-tab.js';

@customElement('md-test-navigation-tab')
class TestNavigationTab extends MdNavigationTab {
}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-navigation-tab': TestNavigationTab;
  }
}

describe('mwc-navigation-tab', () => {
  let fixt: TestFixture;
  let element: TestNavigationTab;
  let harness: NavigationTabHarness;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab></md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      harness = new NavigationTabHarness(element);
      await element.updateComplete;
    });

    it('initializes as an md-navigation-tab', () => {
      expect(element).toBeInstanceOf(MdNavigationTab);
      expect(element.active).toBeFalse();
      expect(element.hideInactiveLabel).toBeFalse();
      expect(element.label).toBeUndefined();
      expect(element.badgeValue).toEqual('');
      expect(element.showBadge).toBeFalse();
    });

    it('emits interaction event on click', async () => {
      const interactionHandler = jasmine.createSpy();
      element.addEventListener(
          'navigation-tab-interaction', interactionHandler);
      await harness.clickWithMouse();
      expect(interactionHandler).toHaveBeenCalled();
    });

    it('focus() sets focus on button element', () => {
      const button = element.shadowRoot!.querySelector('button')!;
      element.focus();
      expect(doesElementContainFocus(button)).toBeTrue();
    });
  });

  it('on render navigation-tab-rendered event fires', async () => {
    const renderedHandler = jasmine.createSpy();
    fixt = await fixture(html`
      <md-test-navigation-tab
        @navigation-tab-rendered=${() => renderedHandler()}>
      </md-test-navigation-tab>
    `);
    expect(renderedHandler).toHaveBeenCalled();
  });

  describe('active', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab
          ?active=${true}>
        </md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('affects `aria-selected` of native button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('aria-selected')).toEqual('true');

      element.active = false;
      await element.updateComplete;
      expect(button.getAttribute('aria-selected')).toEqual('false');
    });

    it('affects `tabindex` of native button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('tabindex')).toEqual('0');

      element.active = false;
      await element.updateComplete;
      expect(button.getAttribute('tabindex')).toEqual('-1');
    });

    it('sets the correct classes', () => {
      const navTab = element.shadowRoot!.querySelector('.md3-navigation-tab')!;
      expect(navTab.classList.contains('md3-navigation-tab--active'))
          .toBeTrue();
    });
  });

  describe('hideInactiveLabel', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab
          .hideInactiveLabel=${true}>
        </md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('sets the correct classes', () => {
      const navTab = element.shadowRoot!.querySelector('.md3-navigation-tab')!;
      expect(
          navTab.classList.contains('md3-navigation-tab--hide-inactive-label'))
          .toBeTrue();
    });
  });

  describe('label', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab
          label="foo">
        </md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('displays label text', () => {
      const content =
          element.shadowRoot!.querySelector('.md3-navigation-tab__label-text')!;
      expect(content.textContent!.trim()).toEqual('foo');
    });
  });

  describe('ariaLabel', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab
          label="foo"
          aria-label="bar">
        </md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('affects `aria-label` of native button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('aria-label')).toEqual('bar');
    });
  });

  describe('showBadge', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab
          .showBadge=${true}>
        </md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('displays badge', () => {
      const badge = element.shadowRoot!.querySelector('md-badge')!;
      expect(badge).toBeDefined();
    });

    it('does not display badge if showBadge is false', async () => {
      element.showBadge = false;
      await element.updateComplete;
      const badge = element.shadowRoot!.querySelector('md-badge');
      expect(badge).toEqual(null);
    });
  });

  describe('badgeValue', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab
          .showBadge=${true}
          .badgeValue=${'9'}>
        </md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('displays badge value', () => {
      const badge = element.shadowRoot!.querySelector('md-badge')!;
      expect(badge.value).toEqual('9');
    });
  });

  describe('icons', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab>
          <i slot="activeIcon" class="material-icons">star</i>
          <i slot="inactiveIcon" class="material-icons">star_border</i>
        </md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('nodes with `slot=activeIcon` will serve as the active icon', () => {
      const icon = element.querySelector<HTMLElement>('[slot="activeIcon"]')!;
      expect(icon.textContent!.trim()).toEqual('star');
    });

    it('nodes with `slot=inactiveIcon` will serve as the inactive icon', () => {
      const icon = element.querySelector<HTMLElement>('[slot="inactiveIcon"]')!;
      expect(icon.textContent!.trim()).toEqual('star_border');
    });
  });

  describe('focus ring', () => {
    let focusRing: MdFocusRing;

    beforeEach(async () => {
      fixt = await fixture(html`
        <md-test-navigation-tab></md-test-navigation-tab>
      `);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      focusRing = element.shadowRoot!.querySelector('md-focus-ring')!;
      harness = new NavigationTabHarness(element);
      await element.updateComplete;
    });

    it('hidden on non-keyboard focus', async () => {
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });

    it('visible on keyboard focus and hides on blur', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.blur();
      expect(focusRing.visible).toBeFalse();
    });

    it('hidden after pointer interaction', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });
  });
});
