/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../testing/harness.js';

import {Dialog} from './internal/dialog.js';

/**
 * Test harness for dialog.
 */
export class DialogHarness extends Harness<Dialog> {
  override async getInteractiveElement() {
    await this.element.updateComplete;
    return (
      this.element.querySelector<HTMLElement>('[autocomplete]') ?? this.element
    );
  }
}
