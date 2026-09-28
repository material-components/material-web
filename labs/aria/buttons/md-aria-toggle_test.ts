/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-aria-toggle.js';

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {MdAriaToggleElement} from './md-aria-toggle.js';
import {AriaToggleElement, isToggleDisabled, isTogglePressed} from './toggle.js';

describe('<md-aria-toggle>', () => {
  const env = new Environment();

  async function setUpTest(
    template = html`<md-aria-toggle>Toggle</md-aria-toggle>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const toggle = root.querySelector('md-aria-toggle') as MdAriaToggleElement;
    return {root, toggle};
  }

  describe('custom element definition and inheritance', () => {
    it('registers md-aria-toggle and inherits from AriaToggleElement', async () => {
      const {toggle} = await setUpTest();
      expect(customElements.get('md-aria-toggle')).toBe(MdAriaToggleElement);
      expect(toggle instanceof AriaToggleElement).toBeTrue();
      expect(toggle instanceof MdAriaToggleElement).toBeTrue();
    });

    it('includes AriaToggleElement.styles in its styles', () => {
      expect(MdAriaToggleElement.styles).toContain(AriaToggleElement.styles);
    });
  });

  describe('selected property and attribute reflection', () => {
    it('reflects selected property to attribute and synchronizes with [isTogglePressed]', async () => {
      const {toggle} = await setUpTest();
      expect(toggle.selected).toBeFalse();
      expect(toggle.hasAttribute('selected')).toBeFalse();
      expect(toggle[isTogglePressed]).toBeFalse();

      toggle.selected = true;
      await env.waitForStability();
      expect(toggle.selected).toBeTrue();
      expect(toggle.hasAttribute('selected')).toBeTrue();
      expect(toggle[isTogglePressed]).toBeTrue();

      toggle.selected = false;
      await env.waitForStability();
      expect(toggle.selected).toBeFalse();
      expect(toggle.hasAttribute('selected')).toBeFalse();
      expect(toggle[isTogglePressed]).toBeFalse();
    });

    it('synchronizes selected attribute changes to property and [isTogglePressed]', async () => {
      const {toggle} = await setUpTest();

      toggle.setAttribute('selected', '');
      await env.waitForStability();
      expect(toggle.selected).toBeTrue();
      expect(toggle[isTogglePressed]).toBeTrue();

      toggle.removeAttribute('selected');
      await env.waitForStability();
      expect(toggle.selected).toBeFalse();
      expect(toggle[isTogglePressed]).toBeFalse();
    });

    it('initializes selected from HTML attribute', async () => {
      const {toggle} = await setUpTest(
        html`<md-aria-toggle selected>Toggle</md-aria-toggle>`,
      );
      expect(toggle.selected).toBeTrue();
      expect(toggle.hasAttribute('selected')).toBeTrue();
      expect(toggle[isTogglePressed]).toBeTrue();
    });

    it('coerces truthy and falsy values for selected property', async () => {
      const {toggle} = await setUpTest();
      (toggle as unknown as {selected: unknown}).selected = 1;
      await env.waitForStability();
      expect(toggle.selected).toBeTrue();
      expect(toggle.hasAttribute('selected')).toBeTrue();

      (toggle as unknown as {selected: unknown}).selected = 0;
      await env.waitForStability();
      expect(toggle.selected).toBeFalse();
      expect(toggle.hasAttribute('selected')).toBeFalse();
    });

    it('updates selected property when mutating [isTogglePressed]', async () => {
      const {toggle} = await setUpTest();
      toggle[isTogglePressed] = true;
      await env.waitForStability();
      expect(toggle.selected).toBeTrue();

      toggle[isTogglePressed] = false;
      await env.waitForStability();
      expect(toggle.selected).toBeFalse();
    });
  });

  describe('disabled property and attribute reflection', () => {
    it('reflects disabled property to attribute and synchronizes with [isToggleDisabled]', async () => {
      const {toggle} = await setUpTest();
      expect(toggle.disabled).toBeFalse();
      expect(toggle.hasAttribute('disabled')).toBeFalse();
      expect(toggle[isToggleDisabled]).toBeFalse();

      toggle.disabled = true;
      await env.waitForStability();
      expect(toggle.disabled).toBeTrue();
      expect(toggle.hasAttribute('disabled')).toBeTrue();
      expect(toggle[isToggleDisabled]).toBeTrue();

      toggle.disabled = false;
      await env.waitForStability();
      expect(toggle.disabled).toBeFalse();
      expect(toggle.hasAttribute('disabled')).toBeFalse();
      expect(toggle[isToggleDisabled]).toBeFalse();
    });

    it('synchronizes disabled attribute changes to property and [isToggleDisabled]', async () => {
      const {toggle} = await setUpTest();

      toggle.setAttribute('disabled', '');
      await env.waitForStability();
      expect(toggle.disabled).toBeTrue();
      expect(toggle[isToggleDisabled]).toBeTrue();

      toggle.removeAttribute('disabled');
      await env.waitForStability();
      expect(toggle.disabled).toBeFalse();
      expect(toggle[isToggleDisabled]).toBeFalse();
    });

    it('initializes disabled from HTML attribute', async () => {
      const {toggle} = await setUpTest(
        html`<md-aria-toggle disabled>Toggle</md-aria-toggle>`,
      );
      expect(toggle.disabled).toBeTrue();
      expect(toggle.hasAttribute('disabled')).toBeTrue();
      expect(toggle[isToggleDisabled]).toBeTrue();
    });

    it('coerces truthy and falsy values for disabled property', async () => {
      const {toggle} = await setUpTest();
      (toggle as unknown as {disabled: unknown}).disabled = 'truthy';
      await env.waitForStability();
      expect(toggle.disabled).toBeTrue();
      expect(toggle.hasAttribute('disabled')).toBeTrue();

      (toggle as unknown as {disabled: unknown}).disabled = '';
      await env.waitForStability();
      expect(toggle.disabled).toBeFalse();
      expect(toggle.hasAttribute('disabled')).toBeFalse();
    });

    it('updates disabled property when mutating [isToggleDisabled]', async () => {
      const {toggle} = await setUpTest();
      toggle[isToggleDisabled] = true;
      await env.waitForStability();
      expect(toggle.disabled).toBeTrue();

      toggle[isToggleDisabled] = false;
      await env.waitForStability();
      expect(toggle.disabled).toBeFalse();
    });
  });

  describe('interaction integration smoke tests', () => {
    it('clicking toggles selected property', async () => {
      const {toggle} = await setUpTest();
      toggle.click();
      await env.waitForStability();
      expect(toggle.selected).toBeTrue();

      toggle.click();
      await env.waitForStability();
      expect(toggle.selected).toBeFalse();
    });

    it('clicking does not toggle selected property when disabled', async () => {
      const {toggle} = await setUpTest(
        html`<md-aria-toggle disabled>Toggle</md-aria-toggle>`,
      );
      toggle.click();
      await env.waitForStability();
      expect(toggle.selected).toBeFalse();
    });

    it('keyboard activation toggles selected property', async () => {
      const {toggle} = await setUpTest();
      toggle.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}),
      );
      await env.waitForStability();
      expect(toggle.selected).toBeTrue();

      toggle.dispatchEvent(
        new KeyboardEvent('keydown', {key: ' ', bubbles: true}),
      );
      toggle.dispatchEvent(
        new KeyboardEvent('keyup', {key: ' ', bubbles: true}),
      );
      await env.waitForStability();
      expect(toggle.selected).toBeFalse();
    });
  });
});
