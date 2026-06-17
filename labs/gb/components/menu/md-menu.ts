/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ContextProvider} from '@lit/context';
import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';
import {mixinFocusable} from '../../../behaviors/focusable.js';

import menuStyles from './menu.css' with {type: 'css'}; // github-only
// import {styles as menuStyles} from './menu.cssresult.js'; // google3-only

import {menu, MENU_COLORS, menuContext, type MenuColor} from './menu.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design menu component. */
    'md-menu': Menu;
  }
}

// Separate variable needed for closure.
const baseClass = mixinElementInternals(mixinFocusable(LitElement));

/**
 * A Material Design menu component.
 */
@customElement('md-menu')
export class Menu extends baseClass {
  static override styles: CSSResultOrNative[] = [menuStyles, css``];

  @property() color: MenuColor = MENU_COLORS.standard;

  get items(): HTMLElement[] {
    return Array.from(this.itemsSet).sort((a, b) => {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING
        ? 1
        : -1;
    });
  }

  private previouslyFocused?: HTMLElement;
  private readonly itemsSet = new Set<HTMLElement>();

  constructor() {
    super();
    this[internals].role = 'menu';
    this.addController(
      new ContextProvider(this, {
        context: menuContext,
        initialValue: {
          menu: this,
          getItems: () => this.items,
          itemConnected: (item: HTMLElement) => {
            this.itemsSet.add(item);
          },
          itemDisconnected: (item: HTMLElement) => {
            this.itemsSet.delete(item);
          },
        },
      }),
    );

    // TODO: move event listeners to setupMenu()
    // Handle keyboard navigation
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        this.hidePopover();
        return;
      }

      const items = this.items.filter(
        (item) => !item.matches(':disabled,[disabled]'),
      );
      const index = items.findIndex((item) => item.matches(':focus-within'));
      if (index === -1 && items.length > 0) {
        // If no item is focused, focus the first one on arrow key
        if (
          [
            'ArrowDown',
            'ArrowRight',
            'ArrowUp',
            'ArrowLeft',
            'Home',
            'End',
          ].includes(event.key)
        ) {
          event.preventDefault();
          items[0].focus();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          if (index < items.length - 1) {
            items[index + 1].focus();
          } else {
            items[0].focus();
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          if (index > 0) {
            items[index - 1].focus();
          } else {
            items[items.length - 1].focus();
          }
          break;
        case 'Home':
          event.preventDefault();
          items[0].focus();
          break;
        case 'End':
          event.preventDefault();
          items[items.length - 1].focus();
          break;
        default:
          break;
      }
    });

    // Handle focus on open
    this.addEventListener(
      'toggle',
      (event: ToggleEvent & {source?: Element | null}) => {
        if (event.newState === 'open') {
          this.previouslyFocused = event.source as HTMLElement;
          // Focus the first non-disabled item
          setTimeout(() => {
            this.items
              .find((item) => !item.matches(':disabled,.disabled,[disabled]'))
              ?.focus();
          });
        } else {
          this.previouslyFocused?.focus();
          this.previouslyFocused = undefined;
        }
      },
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    // Set popover behavior in connectedCallback since constructor may not
    // sprout attributes.
    this.popover = 'auto';
  }

  protected override render() {
    return html`<div part="menu" class="${menu({color: this.color})} menu-host">
      <slot></slot>
    </div>`;
  }
}
