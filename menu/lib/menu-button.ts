/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, PropertyValues} from 'lit';
import {queryAssignedElements} from 'lit/decorators.js';

import {Menu} from './menu.js';

/**
 * Menu button component that automatically attaches a slotted menu to the
 * slotted button.
 */
export class MenuButton extends LitElement {
  @queryAssignedElements({slot: 'button', flatten: true})
  protected readonly buttonAssignedElements!: HTMLElement[];

  @queryAssignedElements({slot: 'menu', flatten: true})
  protected readonly menuAssignedElements!: HTMLElement[];

  get button(): HTMLElement {
    if (this.buttonAssignedElements.length === 0) {
      throw new Error('MenuButton: Missing a slot="button" element.')
    }
    return this.buttonAssignedElements[0];
  }

  get menu(): Menu {
    if (this.menuAssignedElements.length === 0) {
      throw new Error('MenuButton: Missing a slot="menu" element.')
    }
    if (!(this.menuAssignedElements[0] instanceof Menu)) {
      throw new Error(
          'MenuButton: The slot="menu" element must be an instance of the ' +
          'Menu component.');
    }
    return this.menuAssignedElements[0];
  }

  protected override render() {
    return html`
      <div class="md3-menu-button">
        <span>
          <slot name="button"
              @click=${this.handleButtonClick}
              @keydown=${this.handleButtonKeydown}>
          </slot>
        </span>
        <span><slot name="menu"></slot></span>
      </div>
    `;
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    if (!this.menu.anchor) {
      this.menu.anchor = this.button;
    }
  }

  /**
   * If key event is ArrowUp or ArrowDown, opens the menu.
   */
  private handleButtonKeydown(event: KeyboardEvent) {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    if (event.key === 'ArrowUp') {
      this.menu.defaultFocus = 'LAST_ITEM';
    } else if (event.key === 'ArrowDown') {
      this.menu.defaultFocus = 'FIRST_ITEM';
    }
    this.menu.show();
  }

  /**
   * Toggles the menu on button click.
   */
  private handleButtonClick(event: PointerEvent) {
    if (this.menu.open) {
      this.menu.close();
      return;
    }

    // Whether the click is from SPACE or ENTER keypress on a button, for which
    // the browser fires a synthetic click event.
    const isSyntheticClickEvent = event.pointerType === '';
    if (isSyntheticClickEvent) {
      // Key events should automatically focus on first menu item.
      this.menu.defaultFocus = 'FIRST_ITEM';
    } else {
      this.menu.defaultFocus = 'LIST_ROOT';
    }

    this.menu.show();
  }
}
