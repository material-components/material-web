/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing} from 'lit';
import {property, queryAssignedElements, state} from 'lit/decorators.js';

const tooltipId = 'md-tooltip';

/**
 * An accessibility-first tooltip for a single interactive or descriptive
 * element.
 */
export class Tooltip extends LitElement {
  @property() text = '';

  @property({reflect: true}) placement:
    | 'top'
    | 'bottom'
    | 'start'
    | 'end' = 'top';

  @property({type: Number}) delay = 500;

  @property({type: Boolean, reflect: true}) open = false;

  @state() private hasTrigger = false;

  @queryAssignedElements({flatten: true})
  private readonly assignedElements!: HTMLElement[];

  private showTimer?: number;
  private hideTimer?: number;
  private readonly tooltipElementId = `${tooltipId}-${Math.random()
    .toString(36)
    .slice(2)}`;

  protected override render() {
    return html`
      <slot
        @slotchange=${this.handleSlotChange}></slot>
      <div
        id=${this.tooltipElementId}
        role="tooltip"
        aria-hidden=${this.open ? 'false' : 'true'}
        ?hidden=${!this.open}>
        ${this.text || nothing}<slot name="content"></slot>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointerenter', this.handlePointerEnter);
    this.addEventListener('pointerleave', this.handlePointerLeave);
    this.addEventListener('focusin', this.handleFocusIn);
    this.addEventListener('focusout', this.handleFocusOut);
    this.addEventListener('keydown', this.handleKeydown);
  }

  override disconnectedCallback() {
    this.clearTimers();
    this.removeDescribedBy();
    this.removeEventListener('pointerenter', this.handlePointerEnter);
    this.removeEventListener('pointerleave', this.handlePointerLeave);
    this.removeEventListener('focusin', this.handleFocusIn);
    this.removeEventListener('focusout', this.handleFocusOut);
    this.removeEventListener('keydown', this.handleKeydown);
    super.disconnectedCallback();
  }

  protected override updated() {
    this.updateDescribedBy();
  }

  /** Shows the tooltip immediately. */
  show() {
    this.clearTimers();
    if (this.hasTrigger && (this.text || this.querySelector('[slot="content"]'))) {
      this.open = true;
    }
  }

  /** Hides the tooltip immediately. */
  hide() {
    this.clearTimers();
    this.open = false;
  }

  private handleSlotChange = () => {
    this.hasTrigger = this.assignedElements.length > 0;
    this.updateDescribedBy();
  };

  private handlePointerEnter = () => {
    this.clearTimers();
    this.showTimer = window.setTimeout(() => this.show(), this.delay);
  };

  private handlePointerLeave = () => {
    this.clearTimers();
    this.hideTimer = window.setTimeout(() => this.hide(), 100);
  };

  private handleFocusIn = () => {
    this.clearTimers();
    this.show();
  };

  private handleFocusOut = (event: FocusEvent) => {
    if (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)) {
      return;
    }
    this.hide();
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hide();
    }
  };

  private clearTimers() {
    if (this.showTimer !== undefined) {
      window.clearTimeout(this.showTimer);
      this.showTimer = undefined;
    }
    if (this.hideTimer !== undefined) {
      window.clearTimeout(this.hideTimer);
      this.hideTimer = undefined;
    }
  }

  private updateDescribedBy() {
    const trigger = this.assignedElements?.[0];
    if (!trigger) return;
    const describedBy = new Set(
      (trigger.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean),
    );
    describedBy.add(this.tooltipElementId);
    trigger.setAttribute('aria-describedby', [...describedBy].join(' '));
  }

  private removeDescribedBy() {
    for (const trigger of this.assignedElements ?? []) {
      const describedBy = (trigger.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .filter((value) => value && value !== this.tooltipElementId);
      if (describedBy.length) {
        trigger.setAttribute('aria-describedby', describedBy.join(' '));
      } else {
        trigger.removeAttribute('aria-describedby');
      }
    }
  }
}
