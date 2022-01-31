/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '../../types/aria';

import {List} from './list';

/** @soyCompatible */
export class OptionList extends List {
  /** @soyTemplate */
  protected override getAriaRole(): ARIARole {
    return 'listbox';
  }
}
