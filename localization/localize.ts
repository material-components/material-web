/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TemplateResult} from 'lit';

/** Options object to the `msg()` function */
export interface MsgOptions {
  id?: string;
  desc?: string;
}

/** stand-in for lit-localize str function */
export function str(
    strings: TemplateStringsArray, ...values: unknown[]): string {
  let out = strings[0];
  for (let i = 1; i < strings.length; i++) {
    out += String(values[i - 1]) + strings[i];
  }
  return out;
}

/** stand-in for lit-localize msg function */
export function msg<T extends(string | TemplateResult)>(
    template: T, options?: MsgOptions): T {
  return template;
}