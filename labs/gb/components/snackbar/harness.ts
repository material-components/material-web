/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../../../../testing/harness.js';
import {SnackbarElement} from './snackbar-element.js';

/**
 * Test harness for snackbar.
 */
export class SnackbarHarness extends Harness<SnackbarElement> {
  override async getInteractiveElement(): Promise<HTMLElement> {
    await this.element.updateComplete;
    return (
      this.getActionButton() ??
      this.getDismissButton() ??
      this.getSurfaceElement() ??
      this.element
    );
  }

  getSurfaceElement(): HTMLElement | null {
    return this.element.shadowRoot?.querySelector('.snackbar-surface') ?? null;
  }

  getLabelElement(): HTMLElement | null {
    return this.element.shadowRoot?.querySelector('.snackbar-label') ?? null;
  }

  getDismissButton(): HTMLElement | null {
    return (
      this.element.querySelector<HTMLElement>(':scope > [slot="dismiss"]') ??
      this.element.shadowRoot?.querySelector<HTMLElement>(
        '.snackbar-dismiss',
      ) ??
      null
    );
  }

  getActionButton(): HTMLElement | null {
    return (
      this.element.querySelector<HTMLElement>(':scope > [slot="action"]') ??
      this.element.shadowRoot?.querySelector<HTMLElement>('.snackbar-action') ??
      null
    );
  }

  /**
   * Hovers and clicks the action button (slotted or built-in) with a simulated
   * mouse. This will generate a `click` event.
   *
   * @param init Additional event options.
   */
  async clickActionWithMouse(init: PointerEventInit = {}) {
    await this.element.updateComplete;
    this.simulateClickWithMouse(this.getActionButton(), 'action', init);
  }

  /**
   * Hovers and clicks the dismiss button (slotted or built-in close button)
   * with a simulated mouse. This will generate a `click` event.
   *
   * @param init Additional event options.
   */
  async clickDismissWithMouse(init: PointerEventInit = {}) {
    await this.element.updateComplete;
    this.simulateClickWithMouse(this.getDismissButton(), 'dismiss', init);
  }

  private simulateClickWithMouse(
    element: HTMLElement | null,
    name: string,
    init: PointerEventInit,
  ) {
    if (!element) {
      throw new Error(`<md-gb-snackbar> has no ${name} button to click`);
    }
    this.simulateStartHover(element, init);
    this.simulateMousePress(element, init);
    this.simulateMouseRelease(element, init);
    this.simulateClick(element, init);
  }
}
