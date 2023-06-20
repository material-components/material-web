/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Chip} from './lib/chip.js';

/**
 * Test harness for chips.
 */
export class ChipHarness extends Harness<Chip> {
  action: 'primary'|'trailing' = 'primary';

  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    if (this.action === 'trailing') {
      // Retrieve MultiActionChip's trailingAction
      const {trailingAction} =
          this.element as {trailingAction?: HTMLElement | null};
      if (!trailingAction) {
        throw new Error(
            '`ChipHarness.action` is "trailing", but the chip does not have a trailing action.');
      }

      return trailingAction;
    }

    const {primaryId} = this.element as unknown as {primaryId: string};
    const primaryAction = primaryId &&
        this.element.renderRoot.querySelector<HTMLElement>(`#${primaryId}`);
    if (!primaryAction) {
      throw new Error(
          '`ChipHarness.action` is "primary", but the chip does not have a primary action.');
    }

    return primaryAction;
  }
}
