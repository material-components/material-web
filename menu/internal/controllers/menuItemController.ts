/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ReactiveController, ReactiveControllerHost} from 'lit';

import {
  CloseReason,
  createDefaultCloseMenuEvent,
  isClosableKey,
} from './shared.js';

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
export type MenuItem = MenuItemAdditions & HTMLElement;

/**
 * Supported behaviors for a menu item.
 */
export type MenuItemType = 'menuitem' | 'option' | 'button' | 'link';

/**
 * The options used to inialize MenuItemController.
 */
export interface MenuItemControllerConfig {
  /**
   * A function that returns the headline element of the menu item.
   */
  getHeadlineElements: () => HTMLElement[];

  /**
   * A function that returns the supporting-text element of the menu item.
   */
  getSupportingTextElements: () => HTMLElement[];

  /**
   * A function that returns the default slot / misc content.
   */
  getDefaultElements: () => Node[];

  /**
   * The HTML Element that accepts user interactions like click. Used for
   * occasions like programmatically clicking anchor tags when `Enter` is
   * pressed.
   */
  getInteractiveElement: () => HTMLElement | null;
}

/**
 * A controller that provides most functionality of an element that implements
 * the MenuItem interface.
 */
export class MenuItemController implements ReactiveController {
  private internalTypeaheadText: string | null = null;
  private readonly getHeadlineElements: MenuItemControllerConfig['getHeadlineElements'];
  private readonly getSupportingTextElements: MenuItemControllerConfig['getSupportingTextElements'];
  private readonly getDefaultElements: MenuItemControllerConfig['getDefaultElements'];
  private readonly getInteractiveElement: MenuItemControllerConfig['getInteractiveElement'];

  /**
   * @param host The MenuItem in which to attach this controller to.
   * @param config The object that configures this controller's behavior.
   */
  constructor(
    private readonly host: ReactiveControllerHost & MenuItem,
    config: MenuItemControllerConfig,
  ) {
    this.getHeadlineElements = config.getHeadlineElements;
    this.getSupportingTextElements = config.getSupportingTextElements;
    this.getDefaultElements = config.getDefaultElements;
    this.getInteractiveElement = config.getInteractiveElement;
    this.host.addController(this);
  }

  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot, and if there are
   * no slotted elements into headline, then it checks the _default_ slot, and
   * then the `"supporting-text"` slot if nothing is in _default_.
   */
  get typeaheadText() {
    if (this.internalTypeaheadText !== null) {
      return this.internalTypeaheadText;
    }

    const headlineElements = this.getHeadlineElements();

    const textParts: string[] = [];
    headlineElements.forEach((headlineElement) => {
      if (headlineElement.textContent && headlineElement.textContent.trim()) {
        textParts.push(headlineElement.textContent.trim());
      }
    });

    // If there are no headline elements, check the default slot's text content
    if (textParts.length === 0) {
      this.getDefaultElements().forEach((defaultElement) => {
        if (defaultElement.textContent && defaultElement.textContent.trim()) {
          textParts.push(defaultElement.textContent.trim());
        }
      });
    }

    // If there are no headline nor default slot elements, check the
    //supporting-text slot's text content
    if (textParts.length === 0) {
      this.getSupportingTextElements().forEach((supportingTextElement) => {
        if (
          supportingTextElement.textContent &&
          supportingTextElement.textContent.trim()
        ) {
          textParts.push(supportingTextElement.textContent.trim());
        }
      });
    }

    return textParts.join(' ');
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

    this.host.dispatchEvent(
      createDefaultCloseMenuEvent(this.host, {
        kind: CloseReason.CLICK_SELECTION,
      }),
    );
  };

  /**
   * Bind this click listener to the interactive element. Handles closing the
   * menu.
   */
  onKeydown = (event: KeyboardEvent) => {
    // Check if the interactive element is an anchor tag. If so, click it.
    if (this.host.href && event.code === 'Enter') {
      const interactiveElement = this.getInteractiveElement();
      if (interactiveElement instanceof HTMLAnchorElement) {
        interactiveElement.click();
      }
    }

    if (event.defaultPrevented) return;

    // If the host has keepOpen = true we should ignore clicks & Space/Enter,
    // however we always maintain the ability to close a menu with a explicit
    // `escape` keypress.
    const keyCode = event.code;
    if (this.host.keepOpen && keyCode !== 'Escape') return;

    if (isClosableKey(keyCode)) {
      event.preventDefault();
      this.host.dispatchEvent(
        createDefaultCloseMenuEvent(this.host, {
          kind: CloseReason.KEYDOWN,
          key: keyCode,
        }),
      );
    }
  };

  /**
   * Use to set the typeaheadText when it changes.
   */
  setTypeaheadText(text: string) {
    this.internalTypeaheadText = text;
  }
}
