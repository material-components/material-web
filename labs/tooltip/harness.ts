/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MdTooltip} from './tooltip.js';

export class TooltipHarness {
  constructor(readonly element: MdTooltip) {}

  get popup() {
    return this.element.shadowRoot!.querySelector<HTMLElement>(
      '[role="tooltip"]',
    )!;
  }

  async show() {
    this.element.show();
    await this.element.updateComplete;
  }

  async hide() {
    this.element.hide();
    await this.element.updateComplete;
  }
}
