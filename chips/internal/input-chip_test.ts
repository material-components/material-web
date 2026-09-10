/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';

import {InputChip} from './input-chip.js';

customElements.define('test-input-chip', InputChip);

describe('Input chip', () => {
  const env = new Environment();

  async function setupTest() {
    const chip = new InputChip();
    env.render(html`${chip}`);
    await env.waitForStability();
    return chip;
  }

  describe('links', () => {
    it('should render a link when provided an href', async () => {
      const chip = await setupTest();
      chip.href = 'link';
      await chip.updateComplete;

      expect(chip.renderRoot.querySelector('a'))
        .withContext('should have a rendered <a> link')
        .toBeTruthy();
    });

    it('should not allow link chips to be disabled', async () => {
      const chip = await setupTest();
      chip.href = 'link';
      chip.disabled = true;
      await chip.updateComplete;

      expect(chip.renderRoot.querySelector('.disabled,:disabled'))
        .withContext('should not have any disabled styling or behavior')
        .toBeNull();
    });

    it('should not allow link chips to be soft-disabled', async () => {
      // Arrange
      // Act
      const chip = await setupTest();
      chip.href = 'link';
      chip.softDisabled = true;
      await chip.updateComplete;

      // Assert
      expect(chip.renderRoot.querySelector('.disabled,:disabled'))
        .withContext('should not have any disabled styling or behavior')
        .toBeNull();
    });

    it('omits rel and referrerpolicy when unset', async () => {
      const chip = await setupTest();
      chip.href = 'https://example.com';
      await chip.updateComplete;

      const anchor = chip.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
      expect(anchor.hasAttribute('referrerpolicy')).toBeFalse();
    });

    it('does not default rel when target="_blank"', async () => {
      const chip = await setupTest();
      chip.href = 'https://example.com';
      chip.target = '_blank';
      await chip.updateComplete;

      const anchor = chip.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
    });

    it('propagates rel and referrerpolicy to the anchor tag', async () => {
      const chip = await setupTest();
      chip.href = 'https://example.com';
      chip.rel = 'noopener noreferrer';
      chip.referrerPolicy = 'no-referrer';
      await chip.updateComplete;

      const anchor = chip.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe('no-referrer');
    });

    it('reflects rel and referrerpolicy attributes to properties and anchor', async () => {
      const chip = await setupTest();
      chip.setAttribute('href', 'https://example.com');
      chip.setAttribute('rel', 'noreferrer');
      chip.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      await chip.updateComplete;

      expect(chip.rel).toBe('noreferrer');
      expect(chip.referrerPolicy).toBe('strict-origin-when-cross-origin');

      const anchor = chip.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe(
        'strict-origin-when-cross-origin',
      );
    });
  });

  it('should use aria-disabled when soft-disabled', async () => {
    // Arrange
    // Act
    const chip = await setupTest();
    chip.softDisabled = true;
    await chip.updateComplete;

    // Assert
    expect(chip.renderRoot.querySelector('button[aria-disabled="true"]'))
      .withContext('should have aria-disabled="true"')
      .not.toBeNull();
  });

  it('should be focusable when soft-disabled', async () => {
    // Arrange
    const chip = await setupTest();
    chip.softDisabled = true;
    await chip.updateComplete;

    // Act
    chip.focus();

    // Assert
    expect(document.activeElement)
      .withContext('soft-disabled chip should be focused')
      .toBe(chip);
  });

  it('should not be clickable when soft-disabled', async () => {
    // Arrange
    const clickListener = jasmine.createSpy('clickListener');
    const chip = await setupTest();
    chip.softDisabled = true;
    chip.addEventListener('click', clickListener);

    // Act
    chip.click();

    // Assert
    expect(clickListener).not.toHaveBeenCalled();
  });
});
