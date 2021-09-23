/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LabelType} from './constants';

export interface FieldState {
  disabled: boolean;
  error: boolean;
  focused: boolean;
  label?: string;
  labelText: string;
  populated: boolean;
  required: boolean;
  visibleLabelType: LabelType;
}

export interface FieldAdapter {
  state: FieldState;
}
