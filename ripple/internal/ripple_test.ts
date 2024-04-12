/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';

import {Ripple} from './ripple.js';

enum RippleStateClasses {
  HOVERED = 'hovered',
  PRESSED = 'pressed',
}

declare global {
  interface HTMLElementTagNameMap {
    'test-ripple': TestRipple;
  }
}

@customElement('test-ripple')
class TestRipple extends Ripple {}

interface WithState {
  state: number;
}

describe('Ripple', () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`
      <div>
        <test-ripple></test-ripple>
      </div>
    `);

    const container = root.querySelector('div');
    if (!container) {
      throw new Error('Could not query rendered container.');
    }

    const instance = root.querySelector('test-ripple');
    if (!instance) {
      throw new Error('Could not query rendered <test-ripple>.');
    }

    await env.waitForStability();

    const surface = instance.renderRoot.querySelector('.surface');
    if (!surface) {
      throw new Error('Could not query rendered surface.');
    }

    return {
      instance,
      surface,
      harness: new Harness(container),
    };
  }

  describe('basic', () => {
    it('initializes as a test-ripple', async () => {
      const {instance} = await setupTest();
      expect(instance).toBeInstanceOf(TestRipple);
    });

    it('sets pressed class on begin press', async () => {
      const {harness, surface} = await setupTest();
      await harness.startTap();
      jasmine.clock().tick(150); // touch delay
      await env.waitForStability();

      expect(surface).toHaveClass(RippleStateClasses.PRESSED);
    });

    it('removes pressed class on end press', async () => {
      const {harness, surface} = await setupTest();
      await harness.startTap();
      jasmine.clock().tick(150); // touch delay
      await harness.endTap();
      await harness.endTapClick();
      jasmine.clock().tick(225); // MINIMUM_PRESS_MS
      await env.waitForStability();

      expect(surface).not.toHaveClass(RippleStateClasses.PRESSED);
    });

    it('sets hover class on pointer enter', async () => {
      const {harness, surface} = await setupTest();
      await harness.startHover();
      await env.waitForStability();

      expect(surface).toHaveClass(RippleStateClasses.HOVERED);
    });

    it('removes hover class on pointer leave', async () => {
      const {harness, surface} = await setupTest();
      await harness.startHover();
      await env.waitForStability();
      await harness.endHover();
      await env.waitForStability();

      expect(surface).not.toHaveClass(RippleStateClasses.HOVERED);
    });

    it('stops hovering when disabled', async () => {
      const {instance, harness, surface} = await setupTest();
      await harness.startHover();
      await env.waitForStability();
      instance.disabled = true;
      await env.waitForStability();

      expect(surface).not.toHaveClass(RippleStateClasses.HOVERED);
    });

    it('responds to keyboard click after mouse click', async () => {
      const {instance, harness} = await setupTest();
      const STATE_INACTIVE = 0;
      await harness.clickWithMouse();
      await env.waitForStability();
      expect((instance as unknown as WithState).state).toBe(STATE_INACTIVE);
      await harness.clickWithKeyboard();
      await env.waitForStability();
      expect((instance as unknown as WithState).state).toBe(STATE_INACTIVE);
    });
  });
});
