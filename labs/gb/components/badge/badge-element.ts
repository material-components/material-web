/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';
import {badge} from './badge.js';
import {styles as badgeStyles} from './badge.cssresult.js';

/**
 * A Material Design badge component class without custom element registration.
 */
export class BadgeElement extends LitElement {
  static override styles: CSSResultOrNative[] = [
    badgeStyles,
    css`
      :host {
        display: inline-flex;
      }
      .badge {
        flex: 1;
      }
    `,
  ];

  @state() private hasContent = false;

  protected override render() {
    return html`<span part="badge" class="${badge({large: this.hasContent})}">
      <slot @slotchange=${this.handleSlotChange}></slot>
    </span>`;
  }

  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes();
    this.hasContent = nodes.some((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return (node.textContent ?? '').trim().length > 0;
      }
      return true;
    });
  }
}
