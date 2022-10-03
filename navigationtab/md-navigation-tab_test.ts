/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, render} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../testing/environment.js';

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
  const env = new Environment();

  async function setupTest() {
    // Variant type does not matter for shared tests
    const element =
        env.render(html`<md-test-navigation-tab></md-test-navigation-tab>`)
            .querySelector('md-test-navigation-tab');
    if (!element) {
      throw new Error('Could not query rendered <md-test-navigation-tab>.');
    }

    await env.waitForStability();
    const button = element.renderRoot.querySelector('button');
    if (!button) {
      throw new Error('Could not query rendered <button>.');
    }

    const navTab = element.renderRoot.querySelector('.md3-navigation-tab');
    if (!navTab) {
      throw new Error('Could not query rendered .md3-navigation-tab.');
    }

    const focusRing = element.renderRoot.querySelector('md-focus-ring');
    if (!focusRing) {
      throw new Error('Could not query rendered <md-focus-ring>.');
    }

    return {
      button,
      navTab,
      focusRing,
      harness: new NavigationTabHarness(element),
    };
  }

  describe('basic', () => {
    it('initializes as an md-navigation-tab', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(MdNavigationTab);
      expect(harness.element.active).toBeFalse();
      expect(harness.element.hideInactiveLabel).toBeFalse();
      expect(harness.element.label).toBeUndefined();
      expect(harness.element.badgeValue).toEqual('');
      expect(harness.element.showBadge).toBeFalse();
    });

    it('emits interaction event on click', async () => {
      const {harness} = await setupTest();
      const interactionHandler = jasmine.createSpy();
      harness.element.addEventListener(
          'navigation-tab-interaction', interactionHandler);
      await harness.clickWithMouse();
      expect(interactionHandler).toHaveBeenCalled();
    });

    it('focus() sets focus on button element', async () => {
      const {harness, button} = await setupTest();
      harness.element.focus();
      expect(button.matches(':focus')).toBeTrue();
    });
  });

  it('on render navigation-tab-rendered event fires', async () => {
    const element = document.createElement('md-test-navigation-tab');
    const renderedHandler = jasmine.createSpy();
    element.addEventListener('navigation-tab-rendered', renderedHandler);
    env.render(html`${element}`);
    await env.waitForStability();
    expect(renderedHandler).toHaveBeenCalled();
  });

  describe('active', () => {
    it('affects `aria-selected` of native button', async () => {
      const {harness, button} = await setupTest();
      harness.element.active = true;
      await env.waitForStability();

      expect(button.getAttribute('aria-selected')).toEqual('true');

      harness.element.active = false;
      await env.waitForStability();
      expect(button.getAttribute('aria-selected')).toEqual('false');
    });

    it('affects `tabindex` of native button', async () => {
      const {harness, button} = await setupTest();
      harness.element.active = true;
      await env.waitForStability();

      expect(button.getAttribute('tabindex')).toEqual('0');

      harness.element.active = false;
      await env.waitForStability();
      expect(button.getAttribute('tabindex')).toEqual('-1');
    });

    it('sets the correct classes', async () => {
      const {harness, navTab} = await setupTest();
      harness.element.active = true;
      await env.waitForStability();

      expect(navTab.classList.contains('md3-navigation-tab--active'))
          .toBeTrue();
    });
  });

  describe('hideInactiveLabel', () => {
    it('sets the correct classes', async () => {
      const {harness, navTab} = await setupTest();
      harness.element.hideInactiveLabel = true;
      await env.waitForStability();

      expect(
          navTab.classList.contains('md3-navigation-tab--hide-inactive-label'))
          .toBeTrue();
    });
  });

  describe('label', () => {
    it('displays label text', async () => {
      const {harness} = await setupTest();
      harness.element.label = 'foo';
      await env.waitForStability();

      const content = harness.element.shadowRoot!.querySelector(
          '.md3-navigation-tab__label-text')!;
      expect(content.textContent!.trim()).toEqual('foo');
    });
  });

  describe('ariaLabel', () => {
    it('affects `aria-label` of native button', async () => {
      const {harness, button} = await setupTest();
      harness.element.label = 'foo';
      harness.element.ariaLabel = 'bar';
      await env.waitForStability();

      expect(button.getAttribute('aria-label')).toEqual('bar');
    });
  });

  describe('showBadge', () => {
    it('displays badge', async () => {
      const {harness} = await setupTest();
      harness.element.showBadge = true;
      await env.waitForStability();

      const badge = harness.element.renderRoot.querySelector('md-badge');
      expect(badge).toBeDefined();
    });

    it('does not display badge if showBadge is false', async () => {
      const {harness} = await setupTest();
      harness.element.showBadge = false;
      await env.waitForStability();

      const badge = harness.element.renderRoot.querySelector('md-badge');
      expect(badge).toEqual(null);
    });
  });

  describe('badgeValue', () => {
    it('displays badge value', async () => {
      const {harness} = await setupTest();
      harness.element.showBadge = true;
      harness.element.badgeValue = '9';
      await env.waitForStability();

      const badge = harness.element.renderRoot.querySelector('md-badge');
      expect(badge?.value).toEqual('9');
    });
  });

  describe('icons', () => {
    it('nodes with `slot=activeIcon` will serve as the active icon',
       async () => {
         const {harness} = await setupTest();
         const icons = html`
           <i slot="activeIcon" class="material-icons">star</i>
           <i slot="inactiveIcon" class="material-icons">star_border</i>
         `;
         render(icons, harness.element);

         const icon =
             harness.element.querySelector<HTMLElement>('[slot="activeIcon"]')!;
         expect(icon.textContent!.trim()).toEqual('star');
       });

    it('nodes with `slot=inactiveIcon` will serve as the inactive icon',
       async () => {
         const {harness} = await setupTest();
         const icons = html`
           <i slot="activeIcon" class="material-icons">star</i>
           <i slot="inactiveIcon" class="material-icons">star_border</i>
         `;
         render(icons, harness.element);

         const icon = harness.element.querySelector<HTMLElement>(
             '[slot="inactiveIcon"]')!;
         expect(icon.textContent!.trim()).toEqual('star_border');
       });
  });

  describe('focus ring', () => {
    it('hidden on non-keyboard focus', async () => {
      const {harness, focusRing} = await setupTest();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });

    it('visible on keyboard focus and hides on blur', async () => {
      const {harness, focusRing} = await setupTest();
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.blur();
      expect(focusRing.visible).toBeFalse();
    });

    it('hidden after pointer interaction', async () => {
      const {harness, focusRing} = await setupTest();
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });
  });
});
