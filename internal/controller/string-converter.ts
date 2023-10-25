/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const stringConverter = {
  fromAttribute(value: string | null): string {
    return value ?? '';
  },
  toAttribute(value: string): string | null {
    return value || null;
  },
};
