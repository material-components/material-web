/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '../../types/aria';

import {ListItem} from './list-item';

/** @soyCompatible */
export class OptionListItem extends ListItem {
  /** @soyTemplate */
  protected override getAriaRole(): ARIARole {
    return 'option';
  }
}
