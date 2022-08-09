/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '@material/web/types/aria';

import {List} from './list';

/** @soyCompatible */
export class OptionList extends List {
  override role: ARIARole = 'listbox';
}
