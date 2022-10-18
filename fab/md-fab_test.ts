/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {html, render} from 'lit';

import {Environment} from '../testing/environment.js';

import {MdFabExtended} from './fab-extended.js';
import {FabHarness} from './harness.js';

describe('md-fab-extended', () => {
  const env = new Environment();

  async function setupTest() {
    const element = env.render(html`<md-fab-extended></md-fab-extended>`)
                        .querySelector('md-fab-extended');
    if (!element) {
      throw new Error('Could not query rendered <md-fab-extended>.');
    }

    await env.waitForStability();
    const button = element.renderRoot.querySelector('button');
    if (!button) {
      throw new Error('Could not query rendered <button>.');
    }

    const focusRing = element.renderRoot.querySelector('md-focus-ring');
    if (!focusRing) {
      throw new Error('Could not query rendered <md-focus-ring>.');
    }

    return {
      button,
      focusRing,
      harness: new FabHarness(element),
    };
  }

  describe('basic', () => {
    it('initializes as an md-fab-extended', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(MdFabExtended);
      expect(harness.element.lowered).toEqual(false);
      expect(harness.element.disabled).toEqual(false);
      expect(harness.element.label).toEqual('');
      expect(harness.element.icon).toEqual('');
    });
  });

  describe('lowered', () => {
    it('sets the correct classes', async () => {
      const {harness, button} = await setupTest();
      harness.element.lowered = true;
      await env.waitForStability();

      expect(button.classList.contains('md3-fab--lowered')).toBeTrue();
    });
  });

  describe('disabled', () => {
    it('get/set updates the disabled property on the native button element',
       async () => {
         const {harness, button} = await setupTest();
         harness.element.disabled = true;
         await env.waitForStability();

         expect(button.disabled).toEqual(true);
         harness.element.disabled = false;
         await env.waitForStability();
         expect(button.disabled).toEqual(false);
       });
  });

  describe('icon', () => {
    it('will generate an md-icon', async () => {
      const {harness, button} = await setupTest();
      harness.element.icon = 'star';
      await env.waitForStability();

      const icon = button.querySelector('md-icon')!;
      expect(icon.textContent!.trim()).toEqual('star');
    });

    it('serves as `aria-label` of native button when label is empty',
       async () => {
         const {harness, button} = await setupTest();
         harness.element.icon = 'star';
         await env.waitForStability();

         expect(button.getAttribute('aria-label')).toEqual('star');
       });
  });

  describe('icon slot', () => {
    it('node with `slot=icon` will serve as the fab icon', async () => {
      const {harness} = await setupTest();
      render(
          html`<i slot="icon" class="material-icons">star</i>`,
          harness.element);
      const icon = harness.element.querySelector<HTMLElement>('[slot="icon"]')!;
      expect(icon.textContent!.trim()).toEqual('star');
    });
  });

  describe('label', () => {
    it('displays label text', async () => {
      const {harness, button} = await setupTest();
      harness.element.label = 'foo';
      await env.waitForStability();

      const content = button.querySelector('.md3-fab__label')!;
      expect(content.textContent!.trim()).toEqual('foo');
    });

    it('serves as `aria-label` of native button', async () => {
      const {harness, button} = await setupTest();
      harness.element.label = 'foo';
      await env.waitForStability();

      expect(button.getAttribute('aria-label')).toEqual('foo');
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
