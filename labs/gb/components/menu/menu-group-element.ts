/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {consume, provide} from '@lit/context';
import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';

import {
  menuContext,
  menuItemCheckable,
  type MenuContext,
  type MenuItemCheckable,
} from './menu.js';

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

/**
 * A Material Design menu group component.
 *
 * @slot - Used to display the menu group's items.
 */
export class MenuGroupElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: contents;
      }
    `,
  ];

  @provide({context: menuItemCheckable})
  @property({reflect: true})
  checkable: MenuItemCheckable | null = null;

  // TODO: add optional section label

  get menu(): HTMLElement | null {
    return this.menuContext?.menu || null;
  }

  get items(): HTMLElement[] {
    return (this.menuContext?.getItems?.() || []).filter(
      (item) =>
        this.compareDocumentPosition(item) &
        Node.DOCUMENT_POSITION_CONTAINED_BY,
    );
  }

  @consume({context: menuContext, subscribe: true})
  private readonly menuContext: MenuContext | null = null;

  constructor() {
    super();
    this[internals].role = 'none';
    // TODO: single-select items should not be allowed to uncheck themselves.
    // A single change event should be emitted from the group instead.
    this.addEventListener('change', (event: Event) => {
      if (this.checkable === 'single') {
        const composedPath = event.composedPath();
        const items = this.items as Array<HTMLElement & {checked?: boolean}>;
        for (const item of items) {
          if (!composedPath.includes(item) && item.checked) {
            item.checked = false;
          }
        }
      }
    });
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
