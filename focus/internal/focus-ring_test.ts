/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, TemplateResult} from 'lit';

import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';

import {FocusRing} from './focus-ring.js';

customElements.define('test-focus-ring', FocusRing);

declare global {
  interface HTMLElementTagNameMap {
    'test-focus-ring': FocusRing;
  }
}

describe('focus ring', () => {
  const env = new Environment();

  function setupTest(template: TemplateResult) {
    const root = env.render(template);
    const button = root.querySelector('button');
    if (!button) {
      throw new Error('Could not query rendered <button>.');
    }

    const focusRing = root.querySelector('test-focus-ring');
    if (!focusRing) {
      throw new Error('Could not query rendered <test-focus-ring>.');
    }

    return {
      root,
      button,
      focusRing,
      harness: new Harness(button),
    };
  }

  describe('control', () => {
    it('should be the parentElement by default', () => {
      const {button, focusRing} = setupTest(html`
        <button>
          <test-focus-ring></test-focus-ring>
        </button>
      `);

      expect(focusRing.control).withContext('focusRing.control').toBe(button);
    });

    it('should be a referenced element when using a for attribute', () => {
      const {button, focusRing} = setupTest(html`
        <button id="button"></button>
        <test-focus-ring for="button"></test-focus-ring>
      `);

      expect(focusRing.control).withContext('focusRing.control').toBe(button);
    });

    it('should update a referenced element when for attribute changes', async () => {
      const {root, focusRing} = setupTest(html`
        <button id="first"></button>
        <button id="second"></button>
        <test-focus-ring for="first"></test-focus-ring>
      `);

      const secondButton = root.querySelector<HTMLElement>('#second');
      if (!secondButton) {
        throw new Error('Could not query rendered <button id="second">');
      }

      focusRing.setAttribute('for', 'second');
      expect(focusRing.control)
        .withContext('focusRing.control')
        .toBe(secondButton);
      await new Harness(secondButton).focusWithKeyboard();

      expect(focusRing.visible).withContext('focusRing.visible').toBeTrue();
    });

    it('should be able to be imperatively attached', () => {
      const {button, focusRing} = setupTest(html`
        <button></button>
        <test-focus-ring></test-focus-ring>
      `);

      focusRing.attach(button);
      expect(focusRing.control).withContext('focusRing.control').toBe(button);
    });

    it('should do nothing if attaching the same control', () => {
      const {button, focusRing} = setupTest(html`
        <button>
          <test-focus-ring></test-focus-ring>
        </button>
      `);

      expect(focusRing.control)
        .withContext('focusRing.control before attach')
        .toBe(button);
      focusRing.attach(button);
      expect(focusRing.control)
        .withContext('focusRing.control after attach')
        .toBe(button);
    });

    it('should detach previous control when attaching a new one', async () => {
      const {harness, focusRing} = setupTest(html`
        <button>
          <test-focus-ring></test-focus-ring>
        </button>
      `);

      const newControl = document.createElement('div');
      focusRing.attach(newControl);
      // Focus the button. It should not trigger focus ring visible anymore.
      await harness.focusWithKeyboard();
      expect(focusRing.visible).withContext('focusRing.visible').toBeFalse();
    });

    it('should detach when removed from the DOM', async () => {
      const {harness, focusRing} = setupTest(html`
        <button>
          <test-focus-ring></test-focus-ring>
        </button>
      `);

      focusRing.remove();
      // Focus the button. It should not trigger focus ring visible anymore.
      await harness.focusWithKeyboard();
      expect(focusRing.visible).withContext('focusRing.visible').toBeFalse();
    });

    it('should be able to be imperatively detached', () => {
      const {focusRing} = setupTest(html`
        <button>
          <test-focus-ring></test-focus-ring>
        </button>
      `);

      focusRing.detach();
      expect(focusRing.control).withContext('focusRing.control').toBeNull();
    });

    it('should not be controlled with an empty for attribute', () => {
      const {focusRing} = setupTest(html`
        <button>
          <test-focus-ring for=""></test-focus-ring>
        </button>
      `);

      expect(focusRing.control).withContext('focusRing.control').toBeNull();
    });
  });

  it('should be hidden on non-keyboard focus', async () => {
    const {harness, focusRing} = setupTest(html`
      <button>
        <test-focus-ring></test-focus-ring>
      </button>
    `);

    await harness.clickWithMouse();
    expect(focusRing.visible)
      .withContext('focusRing.visible after clickWithMouse')
      .toBeFalse();
  });

  it('should be visible on keyboard focus', async () => {
    const {harness, focusRing} = setupTest(html`
      <button>
        <test-focus-ring></test-focus-ring>
      </button>
    `);

    await harness.focusWithKeyboard();
    expect(focusRing.visible)
      .withContext('focusRing.visible after focusWithKeyboard')
      .toBeTrue();
  });

  it('should hide on blur', async () => {
    const {harness, focusRing} = setupTest(html`
      <button>
        <test-focus-ring></test-focus-ring>
      </button>
    `);

    focusRing.visible = true;
    await harness.blur();
    expect(focusRing.visible)
      .withContext('focusRing.visible after blur')
      .toBeFalse();
  });
});
