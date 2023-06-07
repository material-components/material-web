/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer, nothing, TemplateResult} from 'lit';

import {Chip} from './chip.js';

/**
 * A chip component with multiple actions.
 */
export abstract class MultiActionChip extends Chip {
  protected abstract readonly primaryAction: HTMLElement|null;
  protected abstract readonly trailingAction: HTMLElement|null;

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('focusin', this.updateTabIndices.bind(this));
      this.addEventListener('focusout', this.updateTabIndices.bind(this));
      this.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  override focus(options?: FocusOptions&{trailing?: boolean}) {
    if (options?.trailing && this.trailingAction) {
      this.trailingAction.focus(options);
      return;
    }

    super.focus(options);
  }

  protected override firstUpdated() {
    this.updateTabIndices();
  }

  protected override renderAction() {
    return html`
      ${this.renderPrimaryAction()}
      ${this.renderTrailingAction()}
    `;
  }

  protected abstract renderPrimaryAction(): TemplateResult;

  protected abstract renderTrailingAction(): TemplateResult|typeof nothing;

  private handleKeyDown(event: KeyboardEvent) {
    const isLeft = event.key === 'ArrowLeft';
    const isRight = event.key === 'ArrowRight';
    // Ignore non-navigation keys.
    if (!isLeft && !isRight) {
      return;
    }

    if (!this.primaryAction || !this.trailingAction) {
      // Does not have multiple actions.
      return;
    }

    // Check if moving forwards or backwards
    const isRtl = getComputedStyle(this).direction === 'rtl';
    const forwards = isRtl ? isLeft : isRight;
    const isPrimaryFocused = this.primaryAction?.matches(':focus-within');
    const isTrailingFocused = this.trailingAction?.matches(':focus-within');

    if ((forwards && isTrailingFocused) || (!forwards && isPrimaryFocused)) {
      // Moving outside of the chip, it will be handled by the chip set.
      return;
    }

    // Prevent default interactions, such as scrolling.
    event.preventDefault();
    // Don't let the chip set handle this navigation event.
    event.stopPropagation();
    const actionToFocus = forwards ? this.trailingAction : this.primaryAction;
    actionToFocus.focus();
    this.updateTabIndices();
  }

  private updateTabIndices() {
    const {primaryAction, trailingAction} = this;
    if (!primaryAction || !trailingAction) {
      // Does not have multiple actions.
      primaryAction?.removeAttribute('tabindex');
      trailingAction?.removeAttribute('tabindex');
      return;
    }

    if (trailingAction.matches(':focus-within')) {
      trailingAction.removeAttribute('tabindex');
      primaryAction.tabIndex = -1;
      return;
    }

    primaryAction.removeAttribute('tabindex');
    trailingAction.tabIndex = -1;
  }
}
