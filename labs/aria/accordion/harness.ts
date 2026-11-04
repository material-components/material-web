/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Harness} from '../../../testing/harness.js';

import {AriaAccordionElement} from './accordion.js';

const HEADING_SELECTOR = 'h1,h2,h3,h4,h5,h6,[role="heading"]';

/**
 * Test harness for `md-aria-accordion` elements.
 */
export class AriaAccordionHarness extends Harness<AriaAccordionElement> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.getButton();
  }

  /**
   * Simulates the user activating the accordion's button with the Enter key.
   * Like a native button, this dispatches a single `click` on keydown.
   */
  async pressEnter() {
    const button = await this.getInteractiveElement();
    await this.focusWithKeyboard();
    this.simulateKeydown(button, 'Enter');
    this.simulateClick(button);
    this.simulateKeyup(button, 'Enter');
  }

  /**
   * Simulates the user activating the accordion's button with the Space key.
   * Like a native button, this dispatches a single `click` on keyup.
   */
  async pressSpace() {
    const button = await this.getInteractiveElement();
    await this.focusWithKeyboard();
    this.simulateKeydown(button, ' ');
    this.simulateKeyup(button, ' ');
    this.simulateClick(button);
  }

  /**
   * Returns the button that toggles the accordion.
   */
  getButton(): HTMLButtonElement {
    return this.element.renderRoot.querySelector('button')!;
  }

  /**
   * Returns the slot that contains the accordion's content.
   */
  getContentSlot(): HTMLSlotElement {
    return this.element.renderRoot.querySelector<HTMLSlotElement>(
      'slot[name="content"]',
    )!;
  }

  /**
   * Returns the heading that wraps the button, or `null` if the button is not
   * wrapped in a heading. Both native heading elements (`<h1>`-`<h6>`) and
   * elements with `role="heading"` are considered headings.
   */
  getHeading(): HTMLElement | null {
    return this.element.renderRoot.querySelector<HTMLElement>(HEADING_SELECTOR);
  }

  /**
   * Returns the level of the heading that wraps the button, or `null` if the
   * button is not wrapped in a heading.
   */
  getHeadingLevel(): number | null {
    const heading = this.getHeading();
    if (!heading) {
      return null;
    }

    if (heading.getAttribute('role') === 'heading') {
      // `aria-level` defaults to 2 for the `heading` role.
      return Number(heading.getAttribute('aria-level') ?? 2);
    }

    return Number(heading.localName.slice(1));
  }

  /**
   * Returns the elements referenced by the content slot's `aria-labelledby`
   * attribute, resolved within the accordion's shadow root. Unresolvable IDs
   * are omitted.
   */
  getContentLabelElements(): Element[] {
    const ids = this.getContentSlot().getAttribute('aria-labelledby') ?? '';
    const root = this.element.renderRoot;
    return ids
      .split(/\s+/)
      .filter((id) => id)
      .map((id) => root.querySelector(`#${CSS.escape(id)}`))
      .filter((element): element is Element => element !== null);
  }
}
