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
  KeydownCloseKey,
  SelectionKey,
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

  /**
   * Whether `Enter` and `Space` keydown events should synthesize a click on
   * the interactive element. Defaults to `false` so consumers like
   * `<md-select-option>` preserve their selection coordination.
   */
  activateOnKeydown?: boolean;
}

/**
 * A controller that provides most functionality of an element that implements
 * the MenuItem interface.
 */
export class MenuItemController implements ReactiveController {
  private internalTypeaheadText: string | null = null;
  private isKeyboardClick = false;
  private readonly activateOnKeydown: boolean;
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
    this.activateOnKeydown = config.activateOnKeydown ?? false;
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
    if (this.host.keepOpen || this.isKeyboardClick) return;

    this.host.dispatchEvent(
      createDefaultCloseMenuEvent(this.host, {
        kind: CloseReason.CLICK_SELECTION,
      }),
    );
  };

  /**
   * Bind this keydown listener to the interactive element. Handles keyboard
   * activation and closing the menu.
   */
  onKeydown = (event: KeyboardEvent) => {
    if (!this.activateOnKeydown) {
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
      return;
    }

    // Respect prior handlers (such as mid-prefix typeahead Space) and active
    // IME compositions.
    if (
      event.defaultPrevented ||
      event.isComposing ||
      event.key === 'Process'
    ) {
      return;
    }

    // Always allow Escape to close the menu, including from keep-open items,
    // submenu triggers, and focusable disabled links.
    const isEscape =
      event.code === KeydownCloseKey.ESCAPE ||
      event.key === KeydownCloseKey.ESCAPE;
    if (isEscape) {
      event.preventDefault();
      this.host.dispatchEvent(
        createDefaultCloseMenuEvent(this.host, {
          kind: CloseReason.KEYDOWN,
          key: KeydownCloseKey.ESCAPE,
        }),
      );
      return;
    }

    const isEnter =
      event.code === SelectionKey.ENTER ||
      event.code === 'NumpadEnter' ||
      event.key === SelectionKey.ENTER;
    const isSpace = event.code === SelectionKey.SPACE || event.key === ' ';
    if (!isEnter && !isSpace) {
      return;
    }

    // Ignore events originating from focusable or interactive slotted controls
    // so they handle their own keyboard input without activating the parent
    // menu item, while allowing inert slotted text wrappers (such as
    // `<div slot="headline">`) to activate the item.
    const interactiveElement = this.getInteractiveElement();
    if (!this.isActivatableTarget(event, interactiveElement)) {
      return;
    }

    // Block disabled items (including focusable disabled links) and key repeat
    // before modifier handling so Space does not scroll and disabled links
    // cannot navigate.
    if (this.host.disabled || event.repeat) {
      event.preventDefault();
      return;
    }

    // Submenu triggers rely on SubMenu's keydown handler receiving an
    // un-prevented event so it can open the submenu and focus the first item.
    if (this.isSubmenuTrigger(event)) {
      return;
    }

    // Preserve native modified-Enter navigation (new tab/window) on anchor
    // items while suppressing synthetic clicks and preventing Shift+Space
    // upward scroll or unintended native modified button activation.
    const hasModifier =
      event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;
    if (hasModifier) {
      const isShiftSpaceOnly =
        isSpace &&
        event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey;
      const isButtonElement =
        typeof HTMLButtonElement !== 'undefined' &&
        interactiveElement instanceof HTMLButtonElement;
      if (isShiftSpaceOnly || isButtonElement) {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
    if (!this.host.keepOpen) {
      this.host.dispatchEvent(
        createDefaultCloseMenuEvent(this.host, {
          kind: CloseReason.KEYDOWN,
          key: isEnter ? SelectionKey.ENTER : SelectionKey.SPACE,
        }),
      );
    }

    if (!interactiveElement) {
      return;
    }

    // Suppress onClick's CLICK_SELECTION while synthesizing click so keyboard
    // activation emits only CloseReason.KEYDOWN, and always reset in finally
    // if a click listener throws.
    this.isKeyboardClick = true;
    try {
      interactiveElement.click();
    } finally {
      this.isKeyboardClick = false;
    }
  };

  /**
   * Use to set the typeaheadText when it changes.
   */
  setTypeaheadText(text: string) {
    this.internalTypeaheadText = text;
  }

  /**
   * Returns true if this item (or an enclosing Shadow DOM menu-item wrapper)
   * is slotted as the trigger `slot="item"` of an `<md-sub-menu>` before the
   * nearest enclosing `<md-menu>` boundary.
   */
  private isSubmenuTrigger(event: KeyboardEvent): boolean {
    const path = event.composedPath();
    const hostIndex = path.indexOf(this.host);
    for (let i = hostIndex >= 0 ? hostIndex : 0; i < path.length; i++) {
      const node = path[i];
      if (typeof HTMLElement !== 'undefined' && node instanceof HTMLElement) {
        if (node !== this.host && isMenuElement(node)) {
          return false;
        }
        if (
          node.slot === 'item' &&
          node.parentElement &&
          isSubMenuElement(node.parentElement)
        ) {
          return true;
        }
      }
      if (
        typeof HTMLSlotElement !== 'undefined' &&
        typeof ShadowRoot !== 'undefined' &&
        node instanceof HTMLSlotElement
      ) {
        const root = node.getRootNode();
        if (root instanceof ShadowRoot && isSubMenuElement(root.host)) {
          if (node.name === 'item') return true;
          if (node.name === 'menu') return false;
        }
      }
    }
    return false;
  }

  /**
   * Returns true if the event originated within this item (or its interactive
   * element) without passing through a focusable or interactive slotted
   * descendant before reaching the host.
   */
  private isActivatableTarget(
    event: KeyboardEvent,
    interactiveElement: HTMLElement | null,
  ): boolean {
    const path = event.composedPath();
    const hostIndex = path.indexOf(this.host);
    const interactiveIndex = interactiveElement
      ? path.indexOf(interactiveElement)
      : -1;
    if (hostIndex === -1 && interactiveIndex === -1) {
      return (
        event.target === this.host ||
        (interactiveElement !== null && event.target === interactiveElement)
      );
    }

    const boundaryIndex = hostIndex !== -1 ? hostIndex : interactiveIndex;
    for (let i = 0; i < boundaryIndex; i++) {
      const node = path[i];
      if (node === interactiveElement) {
        continue;
      }
      if (
        typeof HTMLElement !== 'undefined' &&
        node instanceof HTMLElement &&
        isFocusableOrInteractiveElement(node)
      ) {
        return false;
      }
    }
    return true;
  }
}

function isFocusableOrInteractiveElement(element: HTMLElement): boolean {
  return (
    element.tabIndex >= 0 ||
    element.hasAttribute('tabindex') ||
    element.isContentEditable ||
    Boolean(element.shadowRoot?.delegatesFocus)
  );
}

function isMenuElement(element: Element): boolean {
  return element.localName === 'md-menu' || element.hasAttribute('md-menu');
}

function isSubMenuElement(element: Element): boolean {
  return (
    element.localName === 'md-sub-menu' || element.hasAttribute('md-sub-menu')
  );
}
