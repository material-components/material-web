/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {ButtonHarness} from '../harness.js';
import {Button} from './button.js';

@customElement('test-button')
class TestButton extends Button {}

describe('Button', () => {
  const env = new Environment();

  async function setupTest() {
    const button = new TestButton();
    env.render(html`${button}`);
    await env.waitForStability();
    return {button, harness: new ButtonHarness(button)};
  }

  it('should not be focusable when disabled', async () => {
    // Arrange
    const {button} = await setupTest();
    button.disabled = true;
    await env.waitForStability();

    // Act
    button.focus();

    // Assert
    expect(document.activeElement)
      .withContext('disabled button should not be focused')
      .not.toBe(button);
  });

  it('should be focusable when soft-disabled', async () => {
    // Arrange
    const {button} = await setupTest();
    button.softDisabled = true;
    await env.waitForStability();

    // Act
    button.focus();

    // Assert
    expect(document.activeElement)
      .withContext('soft-disabled button should be focused')
      .toBe(button);
  });

  it('should not be clickable when disabled', async () => {
    // Arrange
    const clickListener = jasmine.createSpy('clickListener');
    const {button} = await setupTest();
    button.disabled = true;
    button.addEventListener('click', clickListener);
    await env.waitForStability();

    // Act
    button.click();

    // Assert
    expect(clickListener).not.toHaveBeenCalled();
  });

  it('should not be clickable when soft-disabled', async () => {
    // Arrange
    const clickListener = jasmine.createSpy('clickListener');
    const {button} = await setupTest();
    button.softDisabled = true;
    button.addEventListener('click', clickListener);
    await env.waitForStability();

    // Act
    button.click();

    // Assert
    expect(clickListener).not.toHaveBeenCalled();
  });

  it('should not execute pre-bound click listeners when soft-disabled', async () => {
    const button = document.createElement('test-button') as TestButton;
    let clicked = false;
    button.addEventListener('click', () => {
      clicked = true;
    });
    button.softDisabled = true;
    env.render(html`${button}`);
    await env.waitForStability();

    button.click();

    expect(clicked).toBeFalse();
  });

  describe('links', () => {
    it('omits rel and referrerpolicy when unset', async () => {
      const {button} = await setupTest();
      button.href = 'https://example.com';
      await env.waitForStability();

      const link = button.renderRoot.querySelector('a')!;
      expect(link.hasAttribute('rel')).toBeFalse();
      expect(link.hasAttribute('referrerpolicy')).toBeFalse();
    });

    it('does not default rel when target="_blank"', async () => {
      const {button} = await setupTest();
      button.href = 'https://example.com';
      button.target = '_blank';
      await env.waitForStability();

      const link = button.renderRoot.querySelector('a')!;
      expect(link.hasAttribute('rel')).toBeFalse();
    });

    it('propagates rel and referrerpolicy to the anchor tag', async () => {
      const {button} = await setupTest();
      button.href = 'https://example.com';
      button.rel = 'noopener noreferrer';
      button.referrerPolicy = 'no-referrer';
      await env.waitForStability();

      const link = button.renderRoot.querySelector('a')!;
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.getAttribute('referrerpolicy')).toBe('no-referrer');
    });

    it('reflects rel and referrerpolicy attributes to properties and anchor', async () => {
      const {button} = await setupTest();
      button.setAttribute('href', 'https://example.com');
      button.setAttribute('rel', 'noreferrer');
      button.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      await env.waitForStability();

      expect(button.rel).toBe('noreferrer');
      expect(button.referrerPolicy).toBe('strict-origin-when-cross-origin');

      const link = button.renderRoot.querySelector('a')!;
      expect(link.getAttribute('rel')).toBe('noreferrer');
      expect(link.getAttribute('referrerpolicy')).toBe(
        'strict-origin-when-cross-origin',
      );
    });
  });
});
