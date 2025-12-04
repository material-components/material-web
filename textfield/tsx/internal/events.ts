/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {EventName} from '@lit/react';

// tslint:disable-next-line
export const events = {
  onChange: 'change',
  onInput: 'input' as EventName<InputEvent>,
} as const;
