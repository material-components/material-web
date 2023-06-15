/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {MdAssistChip} from './assist-chip.js';
import {MdFilterChip} from './filter-chip.js';
import {MdInputChip} from './input-chip.js';
import {MdSuggestionChip} from './suggestion-chip.js';

/**
 * Test harness for chips.
 */
export class ChipHarness extends
    Harness<MdAssistChip|MdFilterChip|MdInputChip|MdSuggestionChip> {
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
