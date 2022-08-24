/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCChipActionAttributes, MDCChipActionType} from './constants.js';
import {MDCChipActionFoundation} from './foundation.js';

/**
 * MDCChipPrimaryActionFoundation provides the business logic for the primary
 * chip action.
 */
export class MDCChipPrimaryActionFoundation extends MDCChipActionFoundation {
  isSelectable() {
    return this.adapter.getAttribute(MDCChipActionAttributes.ROLE) === 'option';
  }

  actionType() {
    return MDCChipActionType.PRIMARY;
  }

  protected shouldEmitInteractionOnRemoveKey() {
    return this.adapter.getAttribute(MDCChipActionAttributes.DATA_DELETABLE) ===
        'true';
  }
}
