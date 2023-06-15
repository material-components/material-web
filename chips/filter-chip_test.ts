/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdFilterChip} from './filter-chip.js';
import {ChipHarness} from './harness.js';

describe('<md-filter-chip>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilterChip.styles);
  });

  const env = new Environment();

  async function setupTest() {
    const chip = new MdFilterChip();
    env.render(html`${chip}`);
    await env.waitForStability();
    return {chip, harness: new ChipHarness(chip)};
  }

  describe('selection', () => {
    it('should select on click', async () => {
      const {chip, harness} = await setupTest();

      await harness.clickWithMouse();
      expect(chip.selected).withContext('chip.selected').toBeTrue();
    });

    it('should deselect on click', async () => {
      const {chip, harness} = await setupTest();
      chip.selected = true;

      await harness.clickWithMouse();
      expect(chip.selected).withContext('chip.selected').toBeFalse();
    });

    it('should not select on click when disabled', async () => {
      const {chip, harness} = await setupTest();
      chip.disabled = true;

      await harness.clickWithMouse();
      expect(chip.selected).withContext('chip.selected').toBeFalse();
    });

    it('should dispatch "selected" event when selected changes programmatically',
       async () => {
         const {chip} = await setupTest();
         const handler = jasmine.createSpy();
         chip.addEventListener('selected', handler);

         chip.selected = true;
         await env.waitForStability();
         chip.selected = false;
         await env.waitForStability();
         expect(handler).toHaveBeenCalledTimes(2);
       });

    it('should dispatch "selected" event when selected changes by click',
       async () => {
         const {chip, harness} = await setupTest();
         const handler = jasmine.createSpy();
         chip.addEventListener('selected', handler);

         await harness.clickWithMouse();
         await harness.clickWithMouse();
         expect(handler).toHaveBeenCalledTimes(2);
       });
  });

  describe('removable', () => {
    it('should remove chip from DOM when remove button clicked', async () => {
      const {chip, harness} = await setupTest();
      chip.removable = true;
      await env.waitForStability();

      expect(chip.parentElement)
          .withContext('chip should be attached before removing')
          .not.toBeNull();
      harness.action = 'trailing';
      await harness.clickWithMouse();
      expect(chip.parentElement)
          .withContext('chip should be detached after removing')
          .toBeNull();
    });

    it('should dispatch a "remove" event when removed', async () => {
      const {chip, harness} = await setupTest();
      chip.removable = true;
      await env.waitForStability();
      const handler = jasmine.createSpy();
      chip.addEventListener('remove', handler);

      harness.action = 'trailing';
      await harness.clickWithMouse();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not remove chip if "remove" event is default prevented',
       async () => {
         const {chip, harness} = await setupTest();
         chip.removable = true;
         await env.waitForStability();
         chip.addEventListener('remove', event => {
           event.preventDefault();
         });

         harness.action = 'trailing';
         await harness.clickWithMouse();
         expect(chip.parentElement)
             .withContext('chip should still be attached')
             .not.toBeNull();
       });

    it('should provide a default "ariaLabelRemove" value', async () => {
      const {chip} = await setupTest();
      chip.label = 'Label';

      expect(chip.ariaLabelRemove).toEqual(`Remove ${chip.label}`);
    });

    it('should provide a default "ariaLabelRemove" when "ariaLabel" is provided',
       async () => {
         const {chip} = await setupTest();
         chip.label = 'Label';
         chip.ariaLabel = 'Descriptive label';

         expect(chip.ariaLabelRemove).toEqual(`Remove ${chip.ariaLabel}`);
       });

    it('should allow setting a custom "ariaLabelRemove"', async () => {
      const {chip} = await setupTest();
      chip.label = 'Label';
      chip.ariaLabel = 'Descriptive label';
      const customAriaLabelRemove = 'Remove custom label';
      chip.ariaLabelRemove = customAriaLabelRemove;

      expect(chip.ariaLabelRemove).toEqual(customAriaLabelRemove);
    });
  });
});
