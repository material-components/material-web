/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdBrandedFab} from './branded-fab.js';
import {MdFab} from './fab.js';
import {FabHarness} from './harness.js';

describe('<md-fab>', () => {
  const env = new Environment();

  async function setupTest() {
    const element = env.render(html`<md-fab></md-fab>`).querySelector('md-fab');
    if (!element) {
      throw new Error('Could not query rendered <md-fab>.');
    }

    await env.waitForStability();
    const button = element.renderRoot.querySelector('button');
    if (!button) {
      throw new Error('Could not query rendered <button>.');
    }

    return {
      button,
      harness: new FabHarness(element),
    };
  }

  describe('.styles', () => {
    createTokenTests(MdFab.styles);
  });

  describe('basic', () => {
    it('initializes as an md-fab', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(MdFab);
      expect(harness.element.lowered).toEqual(false);
      expect(harness.element.label).toEqual('');
      expect(harness.element.variant).toEqual('surface');
      expect(harness.element.size).toEqual('medium');
      expect(harness.element.label).toEqual('');
    });

    describe('variants', () => {
      it('variant classes are set', async () => {
        const {harness, button} = await setupTest();
        harness.element.variant = 'primary';
        await env.waitForStability();

        expect(button.classList.contains('primary')).toBeTrue();
        expect(button.classList.contains('secondary')).toBeFalse();
        expect(button.classList.contains('tertiary')).toBeFalse();

        harness.element.variant = 'secondary';
        await env.waitForStability();

        expect(button.classList.contains('primary')).toBeFalse();
        expect(button.classList.contains('secondary')).toBeTrue();
        expect(button.classList.contains('tertiary')).toBeFalse();

        harness.element.variant = 'tertiary';
        await env.waitForStability();

        expect(button.classList.contains('primary')).toBeFalse();
        expect(button.classList.contains('secondary')).toBeFalse();
        expect(button.classList.contains('tertiary')).toBeTrue();
      });

      it('size classes are set', async () => {
        const {harness, button} = await setupTest();
        harness.element.size = 'small';
        await env.waitForStability();

        expect(button.classList.contains('small')).toBeTrue();
        expect(button.classList.contains('large')).toBeFalse();

        harness.element.size = 'large';
        await env.waitForStability();

        expect(button.classList.contains('small')).toBeFalse();
        expect(button.classList.contains('large')).toBeTrue();
      });
    });

    it('size classes are not set when extended', async () => {
      const {harness, button} = await setupTest();
      harness.element.size = 'small';
      await env.waitForStability();

      expect(button.classList.contains('small')).toBeTrue();

      harness.element.label = 'label';
      await env.waitForStability();

      expect(button.classList.contains('small')).toBeFalse();
      expect(button.classList.contains('large')).toBeFalse();

      harness.element.size = 'large';
      await env.waitForStability();

      expect(button.classList.contains('small')).toBeFalse();
      expect(button.classList.contains('large')).toBeFalse();
    });
  });

  describe('lowered', () => {
    it('sets the correct classes', async () => {
      const {harness, button} = await setupTest();
      harness.element.lowered = true;
      await env.waitForStability();

      expect(button.classList.contains('lowered')).toBeTrue();
    });
  });

  describe('icon', () => {
    it('node with `slot=icon` will serve as the fab icon', async () => {
      const {harness} = await setupTest();
      render(html`<i slot="icon">star</i>`, harness.element);
      const icon = harness.element.querySelector<HTMLElement>('[slot="icon"]')!;
      expect(icon.textContent!.trim()).toEqual('star');
    });
  });

  describe('label', () => {
    it('displays label text', async () => {
      const {harness, button} = await setupTest();
      harness.element.label = 'foo';
      await env.waitForStability();

      const content = button.querySelector('.label')!;
      expect(content.textContent!.trim()).toEqual('foo');
    });

    it('serves as `aria-label` of native button', async () => {
      const {harness, button} = await setupTest();
      harness.element.ariaLabel = 'foo';
      await env.waitForStability();

      expect(button.getAttribute('aria-label')).toEqual('foo');
    });
  });
});

describe('<md-branded-fab>', () => {
  const env = new Environment();

  async function setupTest() {
    const element = env
      .render(html`<md-branded-fab></md-branded-fab>`)
      .querySelector('md-branded-fab');
    if (!element) {
      throw new Error('Could not query rendered <md-branded-fab>.');
    }

    await env.waitForStability();
    const button = element.renderRoot.querySelector('button');
    if (!button) {
      throw new Error('Could not query rendered <button>.');
    }

    return {
      button,
      harness: new FabHarness(element),
    };
  }

  describe('.styles', () => {
    createTokenTests(MdBrandedFab.styles);
  });

  describe('variants', () => {
    it('variant classes are not set', async () => {
      const {harness, button} = await setupTest();
      harness.element.variant = 'primary';
      await env.waitForStability();

      expect(button.classList.contains('primary')).toBeFalse();
      expect(button.classList.contains('secondary')).toBeFalse();
      expect(button.classList.contains('tertiary')).toBeFalse();

      harness.element.variant = 'secondary';
      await env.waitForStability();

      expect(button.classList.contains('primary')).toBeFalse();
      expect(button.classList.contains('secondary')).toBeFalse();
      expect(button.classList.contains('tertiary')).toBeFalse();

      harness.element.variant = 'tertiary';
      await env.waitForStability();

      expect(button.classList.contains('primary')).toBeFalse();
      expect(button.classList.contains('secondary')).toBeFalse();
      expect(button.classList.contains('tertiary')).toBeFalse();
    });

    it('small size classes are not set', async () => {
      const {harness, button} = await setupTest();
      harness.element.size = 'small';
      await env.waitForStability();

      expect(button.classList.contains('small')).toBeFalse();
      expect(button.classList.contains('large')).toBeFalse();
    });
  });

  describe('accessibility', () => {
    it('sets aria-hidden on the icon slot when aria-label is set', async () => {
      const {button, harness} = await setupTest();
      await env.waitForStability();

      const iconSlot = button.querySelector('slot[name="icon"]')!;

      expect(button.hasAttribute('aria-label')).toBeFalse();
      expect(iconSlot.hasAttribute('aria-hidden')).toBeFalse();

      const element = harness.element;
      element.ariaLabel = 'foo';
      await env.waitForStability();

      expect(button.hasAttribute('aria-label')).toBeTrue();
      expect(iconSlot.getAttribute('aria-hidden')).toEqual('true');
    });

    it('sets aria-hidden on the icon slot when label is set', async () => {
      const {button, harness} = await setupTest();
      await env.waitForStability();
      const element = harness.element;

      const iconSlot = button.querySelector('slot[name="icon"]')!;

      expect(!!element.label).toBeFalse();
      expect(iconSlot.hasAttribute('aria-hidden')).toBeFalse();

      element.label = 'foo';
      await env.waitForStability();

      expect(!!element.label).toBeTrue();
      expect(iconSlot.getAttribute('aria-hidden')).toEqual('true');
    });
  });
});
