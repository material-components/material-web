/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ReactiveController, ReactiveControllerHost} from 'lit';

import {CloseReason, createDefaultCloseMenuEvent, isClosableKey} from './shared.js';

/**
 * Interface specific to menu item and not HTMLElement.
 *
 * NOTE: required properties are expected to be reactive.
 */
interface MenuItemAdditions {
  /**
   * Whether or not the item is in the disabled state.
   */
  disabled: boolean;
  /**
   * The text of the item that will be used for typeahead. If not set, defaults
   * to the textContent of the element slotted into the headline.
   */
  typeaheadText: string;
  /**
   * Whether or not the item is in the selected visual state.
   */
  selected: boolean;
  /**
   * Sets the behavior and role of the menu item, defaults to "menuitem".
   */
  type: MenuItemType;
  /**
   * Whether it should keep the menu open after click.
   */
  keepOpen?: boolean;
  /**
   * Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
   */
  href?: string;
  /**
   * Focuses the item.
   */
  focus: () => void;
}

/**
 * The interface of every menu item interactive with a menu. All menu items
 * should implement this interface to be compatible with md-menu. Additionally
 * it should have the `md-menu-item` attribute set.
 *
 * NOTE, the required properties are recommended to be reactive properties.
 */
export type MenuItem = MenuItemAdditions&HTMLElement;

/**
 * Supported behaviors for a menu item.
 */
export type MenuItemType = 'menuitem'|'option'|'button'|'link';

/**
 * The options used to inialize MenuItemController.
 */
export interface MenuItemControllerConfig {
  /**
   * A function that returns the headline element of the menu item.
   */
  getHeadlineElements: () => HTMLElement[];
}

/**
 * A controller that provides most functionality of an element that implements
 * the MenuItem interface.
 */
export class MenuItemController implements ReactiveController {
  private internalTypeaheadText: string|null = null;
  private readonly getHeadlineElements:
      MenuItemControllerConfig['getHeadlineElements'];

  /**
   * @param host The MenuItem in which to attach this controller to.
   * @param config The object that configures this controller's behavior.
   */
  constructor(
      private readonly host: ReactiveControllerHost&MenuItem,
      config: MenuItemControllerConfig) {
    const {
      getHeadlineElements,
    } = config;
    this.getHeadlineElements = getHeadlineElements;
    this.host.addController(this);
  }

  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot.
   */
  get typeaheadText() {
    if (this.internalTypeaheadText !== null) {
      return this.internalTypeaheadText;
    }

    const headlineElements = this.getHeadlineElements();

    let text = '';
    headlineElements.forEach((headlineElement) => {
      if (headlineElement.textContent && headlineElement.textContent.trim()) {
        text += ` ${headlineElement.textContent.trim()}`;
      }
    });

    return '';
  }

  /**
   * The recommended tag name to render as the list item.
   */
  get tagName() {
    const type = this.host.type;

    switch (type) {
      case 'link':
        return 'a' as const;
      case 'button':
        return 'button' as const;
      default:
      case 'menuitem':
      case 'option':
        return 'li' as const;
    }
  }

  /**
   * The recommended role of the menu item.
   */
  get role() {
    return this.host.type === 'option' ? 'option' : 'menuitem';
  }

  hostConnected() {
    this.host.toggleAttribute('md-menu-item', true);
  }

  hostUpdate() {
    if (this.host.href) {
      this.host.type = 'link';
    }
  }

  /**
   * Bind this click listener to the interactive element. Handles closing the
   * menu.
   */
  onClick = () => {
    if (this.host.keepOpen) return;

    this.host.dispatchEvent(createDefaultCloseMenuEvent(
        this.host, {kind: CloseReason.CLICK_SELECTION}));
  };

  /**
   * Bind this click listener to the interactive element. Handles closing the
   * menu.
   */
  onKeydown = (event: KeyboardEvent) => {
    if (this.host.keepOpen || event.defaultPrevented) return;
    const keyCode = event.code;

    if (!event.defaultPrevented && isClosableKey(keyCode)) {
      event.preventDefault();
      this.host.dispatchEvent(createDefaultCloseMenuEvent(
          this.host, {kind: CloseReason.KEYDOWN, key: keyCode}));
    }
  };

  /**
   * Use to set the typeaheadText when it changes.
   */
  setTypeaheadText(text: string) {
    this.internalTypeaheadText = text;
  }
}