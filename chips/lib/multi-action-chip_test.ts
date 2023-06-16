/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement, query} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';

import {MultiActionChip} from './multi-action-chip.js';
import {renderRemoveButton} from './trailing-icons.js';

@customElement('test-multi-action-chip')
class TestMultiActionChip extends MultiActionChip {
  @query('#primary') primaryAction!: HTMLElement;
  @query('.trailing.action') trailingAction!: HTMLElement;

  protected primaryId = 'primary';

  protected override renderAction() {
    return html`<button id="primary"></button>`;
  }

  protected override renderTrailingAction() {
    return renderRemoveButton(
        {ariaLabel: this.ariaLabelRemove, disabled: this.disabled});
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

  describe('remove action', () => {
    it('should remove chip from DOM when remove button clicked', async () => {
      const chip = await setupTest();
      const harness = new Harness(chip.trailingAction);

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
      const harness = new Harness(chip.trailingAction);
      const handler = jasmine.createSpy();
      chip.addEventListener('remove', handler);

      await harness.clickWithMouse();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not remove chip if "remove" event is default prevented',
       async () => {
         const chip = await setupTest();
         const harness = new Harness(chip.trailingAction);
         chip.addEventListener('remove', event => {
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

    it('should provide a default "ariaLabelRemove" when "ariaLabel" is provided',
       async () => {
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
