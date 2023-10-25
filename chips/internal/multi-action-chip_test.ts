/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {css, html, nothing} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {ChipHarness} from '../harness.js';

import {MultiActionChip} from './multi-action-chip.js';
import {renderRemoveButton} from './trailing-icons.js';

@customElement('test-multi-action-chip')
class TestMultiActionChip extends MultiActionChip {
  static override styles = css`
    :host {
      position: relative;
    }
  `;

  @query('#primary') primaryAction!: HTMLElement;
  @query('.trailing.action') trailingAction!: HTMLElement;
  @property() noTrailingAction = false;

  protected primaryId = 'primary';

  protected override renderPrimaryAction() {
    return html`<button id="primary"></button>`;
  }

  protected override renderTrailingAction(focusListener: EventListener) {
    if (this.noTrailingAction) {
      return nothing;
    }

    return renderRemoveButton({
      focusListener,
      ariaLabel: this.ariaLabelRemove,
      disabled: this.disabled,
    });
  }
}

describe('Multi-action chips', () => {
  const env = new Environment();

  async function setupTest() {
    const chip = new TestMultiActionChip();
    env.render(html`${chip}`);
    await env.waitForStability();
    return chip;
  }

  describe('navigation', () => {
    it('should move internal focus forwards', async () => {
      const chip = await setupTest();
      const primaryHarness = new ChipHarness(chip);

      await primaryHarness.focusWithKeyboard();
      expect(chip.primaryAction.matches(':focus-within'))
        .withContext('primary action is focused')
        .toBeTrue();

      await primaryHarness.keypress('ArrowRight');
      expect(chip.trailingAction.matches(':focus-within'))
        .withContext('trailing action is focused')
        .toBeTrue();
    });

    it('should move internal focus forwards in rtl', async () => {
      const chip = await setupTest();
      chip.style.direction = 'rtl';
      const primaryHarness = new ChipHarness(chip);

      await primaryHarness.focusWithKeyboard();
      expect(chip.primaryAction.matches(':focus-within'))
        .withContext('primary action is focused')
        .toBeTrue();

      await primaryHarness.keypress('ArrowLeft');
      expect(chip.trailingAction.matches(':focus-within'))
        .withContext('trailing action is focused')
        .toBeTrue();
    });

    it('should move internal focus backwards', async () => {
      const chip = await setupTest();
      const trailingHarness = new ChipHarness(chip);
      trailingHarness.action = 'trailing';

      await trailingHarness.focusWithKeyboard();
      expect(chip.trailingAction.matches(':focus-within'))
        .withContext('trailing action is focused')
        .toBeTrue();

      await trailingHarness.keypress('ArrowLeft');
      expect(chip.primaryAction.matches(':focus-within'))
        .withContext('primary action is focused')
        .toBeTrue();
    });

    it('should move internal focus backwards in rtl', async () => {
      const chip = await setupTest();
      chip.style.direction = 'rtl';
      const trailingHarness = new ChipHarness(chip);
      trailingHarness.action = 'trailing';

      await trailingHarness.focusWithKeyboard();
      expect(chip.trailingAction.matches(':focus-within'))
        .withContext('trailing action is focused')
        .toBeTrue();

      await trailingHarness.keypress('ArrowRight');
      expect(chip.primaryAction.matches(':focus-within'))
        .withContext('primary action is focused')
        .toBeTrue();
    });

    it('should not bubble when navigating internally', async () => {
      const chip = await setupTest();
      const primaryHarness = new ChipHarness(chip);
      const keydownHandler = jasmine.createSpy();
      if (!chip.parentElement) {
        throw new Error('Expected chip to have a parentElement for test.');
      }

      chip.parentElement.addEventListener('keydown', keydownHandler);

      await primaryHarness.focusWithKeyboard();
      await primaryHarness.keypress('ArrowRight');
      expect(keydownHandler).not.toHaveBeenCalled();
    });

    it('should bubble event when navigating forward past trailing action', async () => {
      const chip = await setupTest();
      const trailingHarness = new ChipHarness(chip);
      trailingHarness.action = 'trailing';
      const keydownHandler = jasmine.createSpy();
      if (!chip.parentElement) {
        throw new Error('Expected chip to have a parentElement for test.');
      }

      chip.parentElement.addEventListener('keydown', keydownHandler);

      await trailingHarness.focusWithKeyboard();
      await trailingHarness.keypress('ArrowRight');
      expect(keydownHandler).toHaveBeenCalledTimes(1);
    });

    it('should bubble event when navigating backward before primary action', async () => {
      const chip = await setupTest();
      const primaryHarness = new ChipHarness(chip);
      const keydownHandler = jasmine.createSpy();
      if (!chip.parentElement) {
        throw new Error('Expected chip to have a parentElement for test.');
      }

      chip.parentElement.addEventListener('keydown', keydownHandler);

      await primaryHarness.focusWithKeyboard();
      await primaryHarness.keypress('ArrowLeft');
      expect(keydownHandler).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if it does not have multiple actions', async () => {
      const chip = await setupTest();
      chip.noTrailingAction = true;
      await env.waitForStability();

      const primaryHarness = new ChipHarness(chip);
      await primaryHarness.focusWithKeyboard();
      await primaryHarness.keypress('ArrowLeft');
      expect(chip.primaryAction.matches(':focus-within'))
        .withContext('primary action is still focused')
        .toBeTrue();
    });
  });

  describe('remove action', () => {
    it('should remove chip from DOM when remove button clicked', async () => {
      const chip = await setupTest();
      const harness = new ChipHarness(chip);
      harness.action = 'trailing';

      expect(chip.parentElement)
        .withContext('chip should be attached before removing')
        .not.toBeNull();
      await harness.clickWithMouse();
      expect(chip.parentElement)
        .withContext('chip should be detached after removing')
        .toBeNull();
    });

    it('should dispatch a "remove" event when removed', async () => {
      const chip = await setupTest();
      const harness = new ChipHarness(chip);
      harness.action = 'trailing';
      const handler = jasmine.createSpy();
      chip.addEventListener('remove', handler);

      await harness.clickWithMouse();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not remove chip if "remove" event is default prevented', async () => {
      const chip = await setupTest();
      const harness = new ChipHarness(chip);
      harness.action = 'trailing';
      chip.addEventListener('remove', (event) => {
        event.preventDefault();
      });

      await harness.clickWithMouse();
      expect(chip.parentElement)
        .withContext('chip should still be attached')
        .not.toBeNull();
    });

    it('should provide a default "ariaLabelRemove" value', async () => {
      const chip = await setupTest();
      chip.label = 'Label';

      expect(chip.ariaLabelRemove).toEqual(`Remove ${chip.label}`);
    });

    it('should provide a default "ariaLabelRemove" when "ariaLabel" is provided', async () => {
      const chip = await setupTest();
      chip.label = 'Label';
      chip.ariaLabel = 'Descriptive label';

      expect(chip.ariaLabelRemove).toEqual(`Remove ${chip.ariaLabel}`);
    });

    it('should allow setting a custom "ariaLabelRemove"', async () => {
      const chip = await setupTest();
      chip.label = 'Label';
      chip.ariaLabel = 'Descriptive label';
      const customAriaLabelRemove = 'Remove custom label';
      chip.ariaLabelRemove = customAriaLabelRemove;

      expect(chip.ariaLabelRemove).toEqual(customAriaLabelRemove);
    });
  });
});
