/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TextFieldState {
  disabled: boolean;
  error: boolean;
  label?: string;
  required: boolean;
  value: string;
}

export interface TextFieldAdapter {
  state: TextFieldState;
}
