/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../styles/icon/md-gb-icon.js';

import {ContextProvider} from '@lit/context';
import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import {property, query} from 'lit/decorators.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {fab, type FabColor, type FabSize} from '../fab/fab.js';
import {
  fabMenu,
  fabMenuContext,
  type FabMenuColor,
  type FabMenuItem,
} from './fab-menu.js';

import fabStyles from '../fab/fab.css' with {type: 'css'}; // github-only
// import {styles as fabStyles} from '../fab/fab.cssresult.js'; // google3-only
import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import fabMenuStyles from './fab-menu.css' with {type: 'css'}; // github-only
// import {styles as fabMenuStyles} from './fab-menu.cssresult.js'; // google3-only

// Separate variable needed for closure.
const baseClass = mixinElementInternals(LitElement);

/**
 * A Material Design FAB menu component.
 *
 * @slot - Used to display the menu's items.
 * @slot icon - Used to display the FAB trigger icon.
 * @slot label - Used to display the FAB trigger label text.
 * @slot trigger - Used to customize the entire FAB trigger element.
 * @csspart trigger - The FAB trigger button.
 * @csspart menu - The menu surface element.
 * @cssprop --between-space
 * @cssprop --menu-container-color
 * @cssprop --menu-container-elevation
 * @cssprop --menu-container-shape
 * @cssprop --menu-container-width
 * @cssprop --menu-group-padding
 */
export class FabMenuElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    fabStyles,
    fabMenuStyles,
    css`
      :host {
        display: inline-flex;
        position: relative;
        vertical-align: middle;
      }
    `,
  ];

  @property() color: FabColor = 'primary-container';
  @property() size: FabSize = 'default';
  @property({attribute: 'menu-color'}) menuColor: FabMenuColor = 'standard';
  @property({type: Boolean, reflect: true}) open = false;
  @property() icon = '';
  @property() label = '';
  @property({attribute: 'aria-label'}) override ariaLabel: string | null = null;

  @query('.fab-menu-trigger')
  readonly triggerElement!: HTMLButtonElement | null;
  @query('.fab-menu-surface') readonly surfaceElement!: HTMLDivElement | null;

  private readonly itemsSet = new Set<FabMenuItem>();
  private closingOnTab = false;

  /** Returns all registered menu items in DOM order. */
  get items(): FabMenuItem[] {
    return Array.from(this.itemsSet).sort((a, b) => {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING
        ? 1
        : -1;
    });
  }

  constructor() {
    super();

    this.addController(
      new ContextProvider(this, {
        context: fabMenuContext,
        initialValue: {
          menu: this,
          getItems: () => this.items,
          itemConnected: (item: FabMenuItem) => {
            this.itemsSet.add(item);
          },
          itemDisconnected: (item: FabMenuItem) => {
            this.itemsSet.delete(item);
          },
          close: () => {
            this.open = false;
          },
        },
      }),
    );

    // TODO(emilyln): Move host event listeners into setupFabMenu() so Light DOM
    // fabMenu() directive consumers share keyboard navigation.
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      if (this.open) {
        this.handleKeydown(event);
      }
    });
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated && this.open) {
      this.syncPopoverOpen();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.open = false;
  }

  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);
    if (changedProperties.has('open')) {
      this.syncPopoverOpen();
    }
  }

  private autoFocusFirstItem(): void {
    const firstEnabled = this.items.find((item) => !item.disabled);
    firstEnabled?.focus();
  }

  private syncPopoverOpen(): void {
    if (!this.isConnected || !this.surfaceElement) return;
    const isOpen = this.surfaceElement.matches(':popover-open');
    if (this.open && !isOpen) {
      this.surfaceElement.showPopover();
      this.autoFocusFirstItem();
    } else if (!this.open && isOpen) {
      this.surfaceElement.hidePopover();
    }
  }

  private handleTriggerClick(): void {
    this.open = !this.open;
  }

  private handleToggle(event: ToggleEvent): void {
    if (event.newState === 'open') {
      this.closingOnTab = false;
      if (!this.open) {
        this.open = true;
        this.autoFocusFirstItem();
      }
    } else {
      this.open = false;
      if (this.closingOnTab) {
        this.closingOnTab = false;
        return;
      }
      const active = document.activeElement;
      if (
        !active ||
        active === document.body ||
        this.contains(active) ||
        this.shadowRoot?.contains(active)
      ) {
        this.triggerElement?.focus();
      }
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.open = false;
      this.triggerElement?.focus();
      return;
    }

    if (event.key === 'Tab') {
      this.closingOnTab = true;
      this.open = false;
      this.surfaceElement?.hidePopover();
      this.triggerElement?.focus();
      return;
    }

    const enabledItems = this.items.filter((item) => !item.disabled);
    if (enabledItems.length === 0) return;

    const currentIndex = enabledItems.findIndex(
      (item) =>
        item.matches(':focus-within') || item === document.activeElement,
    );

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex === -1 || currentIndex >= enabledItems.length - 1) {
          enabledItems[0].focus();
        } else {
          enabledItems[currentIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex <= 0) {
          enabledItems[enabledItems.length - 1].focus();
        } else {
          enabledItems[currentIndex - 1].focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        enabledItems[0].focus();
        break;
      case 'End':
        event.preventDefault();
        enabledItems[enabledItems.length - 1].focus();
        break;
      default:
        break;
    }
  }

  protected override render() {
    return html`
      <div
        class="${fabMenu({
          menuColor: this.menuColor,
          open: this.open,
        })}">
        <button
          part="trigger"
          class="${fab({color: this.color, size: this.size})} fab-menu-trigger"
          aria-haspopup="menu"
          aria-expanded="${this.open ? 'true' : 'false'}"
          aria-controls="menu"
          aria-label=${this.ariaLabel || nothing}
          @click=${this.handleTriggerClick}>
          <slot name="trigger">
            <slot name="icon">
              ${this.icon
                ? html`<md-gb-icon>${this.icon}</md-gb-icon>`
                : nothing}
            </slot>
            <slot name="label">${this.label || nothing}</slot>
          </slot>
        </button>
        <div
          id="menu"
          part="menu"
          popover="auto"
          class="fab-menu-surface"
          role="menu"
          @toggle=${this.handleToggle}>
          <slot></slot>
        </div>
      </div>
    `;
  }
}
