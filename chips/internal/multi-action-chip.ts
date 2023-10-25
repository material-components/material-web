/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer} from 'lit';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';

import {Chip} from './chip.js';

const ARIA_LABEL_REMOVE = 'aria-label-remove';

/**
 * A chip component with multiple actions.
 */
export abstract class MultiActionChip extends Chip {
  get ariaLabelRemove(): string {
    if (this.hasAttribute(ARIA_LABEL_REMOVE)) {
      return this.getAttribute(ARIA_LABEL_REMOVE)!;
    }

    const {ariaLabel} = this as ARIAMixinStrict;
    return `Remove ${ariaLabel || this.label}`;
  }
  set ariaLabelRemove(ariaLabel: string | null) {
    const prev = this.ariaLabelRemove;
    if (ariaLabel === prev) {
      return;
    }

    if (ariaLabel === null) {
      this.removeAttribute(ARIA_LABEL_REMOVE);
    } else {
      this.setAttribute(ARIA_LABEL_REMOVE, ariaLabel);
    }

    this.requestUpdate();
  }

  protected abstract readonly primaryAction: HTMLElement | null;
  protected abstract readonly trailingAction: HTMLElement | null;

  constructor() {
    super();
    this.handleTrailingActionFocus = this.handleTrailingActionFocus.bind(this);
    if (!isServer) {
      this.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  override focus(options?: FocusOptions & {trailing?: boolean}) {
    const isFocusable = this.alwaysFocusable || !this.disabled;
    if (isFocusable && options?.trailing && this.trailingAction) {
      this.trailingAction.focus(options);
      return;
    }

    super.focus(options as FocusOptions);
  }

  protected override renderContainerContent() {
    return html`
      ${super.renderContainerContent()}
      ${this.renderTrailingAction(this.handleTrailingActionFocus)}
    `;
  }

  protected abstract renderTrailingAction(
    focusListener: EventListener,
  ): unknown;

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
  }

  private handleTrailingActionFocus() {
    const {primaryAction, trailingAction} = this;
    if (!primaryAction || !trailingAction) {
      return;
    }

    // Temporarily turn off the primary action's focusability. This allows
    // shift+tab from the trailing action to move to the previous chip rather
    // than the primary action in the same chip.
    primaryAction.tabIndex = -1;
    trailingAction.addEventListener(
      'focusout',
      () => {
        primaryAction.tabIndex = 0;
      },
      {once: true},
    );
  }
}
