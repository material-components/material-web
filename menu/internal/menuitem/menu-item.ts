/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../ripple/ripple.js';
import '../../../focus/md-focus-ring.js';
import '../../../item/item.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal, StaticValue} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';
import {CLOSE_REASON, createDefaultCloseMenuEvent, isClosableKey, MenuItem} from '../shared.js';

/**
 * Supported behaviors for a menu item.
 */
export type MenuItemType = 'menuitem'|'option'|'button'|'link';

/**
 * @fires close-menu {CloseMenuEvent}
 */
export class MenuItemEl extends LitElement implements MenuItem {
  static {
    requestUpdateOnAriaChange(MenuItemEl);
  }

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /**
   * Disables the item and makes it non-selectable and non-interactive.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Sets the behavior and role of the menu item, defaults to "menuitem".
   */
  @property() type: MenuItemType = 'menuitem';

  /**
   * Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
   */
  @property() href = '';

  /**
   * Sets the underlying `HTMLAnchorElement`'s `target` attribute when `href` is
   * set.
   */
  @property() target: '_blank'|'_parent'|'_self'|'_top'|'' = '';

  /**
   * READONLY: self-identifies as a menu item and sets its identifying attribute
   */
  @property({type: Boolean, attribute: 'md-menu-item', reflect: true})
  isMenuItem = true;

  /**
   * Keeps the menu open if clicked or keyboard selected.
   */
  @property({type: Boolean, attribute: 'keep-open'}) keepOpen = false;

  /**
   * Sets the item in the selected visual state when a submenu is opened.
   */
  @property({type: Boolean}) selected = false;

  @query('.list-item') protected readonly listItemRoot!: HTMLElement|null;

  @queryAssignedElements({slot: 'headline'})
  protected readonly headlineElements!: HTMLElement[];

  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot.
   */
  get typeaheadText() {
    if (this.internalTypeaheadText !== null) {
      return this.internalTypeaheadText;
    }

    const headlineElements = this.headlineElements;

    let text = '';
    headlineElements.forEach((headlineElement) => {
      if (headlineElement.textContent && headlineElement.textContent.trim()) {
        text += ` ${headlineElement.textContent.trim()}`;
      }
    });

    return '';
  }

  set typeaheadText(text: string) {
    this.internalTypeaheadText = text;
  }

  private internalTypeaheadText: string|null = null;

  protected override willUpdate(changed: PropertyValues<MenuItemEl>) {
    if (this.href) {
      this.type = 'link';
    }

    super.willUpdate(changed);
  }

  protected override render() {
    return this.renderListItem(html`
      <md-item>
        <div slot="container">
          ${this.renderRipple()}
          ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
  }

  /**
   * Renders the root list item.
   *
   * @param content the child content of the list item.
   */
  protected renderListItem(content: unknown) {
    const isAnchor = this.type === 'link';
    let tag: StaticValue;
    let role: 'menuitem'|'option' = 'menuitem';
    switch (this.type) {
      case 'link':
        tag = literal`a`;
        break;
      case 'button':
        tag = literal`button`;
        break;
      default:
      case 'menuitem':
        tag = literal`li`;
        break;
      case 'option':
        tag = literal`li`;
        role = 'option';
        break;
    }

    // TODO(b/265339866): announce "button"/"link" inside of a list item. Until
    // then all are "menuitem" roles for correct announcement.
    const target = isAnchor && !!this.target ? this.target : nothing;
    return staticHtml`
      <${tag}
        id="item"
        tabindex=${this.disabled && !isAnchor ? -1 : 0}
        role=${role}
        aria-label=${(this as ARIAMixinStrict).ariaLabel || nothing}
        aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
        aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
        aria-expanded=${(this as ARIAMixinStrict).ariaExpanded || nothing}
        aria-haspopup=${(this as ARIAMixinStrict).ariaHasPopup || nothing}
        class="list-item ${classMap(this.getRenderClasses())}"
        href=${this.href || nothing}
        target=${target}
        @click=${this.onClick}
        @keydown=${this.onKeydown}
      >${content}</${tag}>
    `;
  }

  /**
   * Handles rendering of the ripple element.
   */
  protected renderRipple(): TemplateResult|typeof nothing {
    return html`
      <md-ripple
          part="ripple"
          for="item"
          ?disabled=${this.disabled}></md-ripple>`;
  }

  /**
   * Handles rendering of the focus ring.
   */
  protected renderFocusRing(): TemplateResult|typeof nothing {
    return html`
      <md-focus-ring
          part="focus-ring"
          for="item"
          inward></md-focus-ring>`;
  }

  /**
   * Classes applied to the list item root.
   */
  protected getRenderClasses(): ClassInfo {
    return {
      'disabled': this.disabled,
      'selected': this.selected,
    };
  }

  /**
   * Handles rendering the headline and supporting text.
   */
  protected renderBody() {
    return html`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot name="trailing-supporting-text"
          slot="trailing-supporting-text"></slot>
    `;
  }

  override focus() {
    // TODO(b/300334509): needed for some cases where delegatesFocus doesn't
    // work programmatically like in FF and select-option
    this.listItemRoot?.focus();
  }

  protected onClick() {
    if (this.keepOpen) return;

    this.dispatchEvent(createDefaultCloseMenuEvent(
        this, {kind: CLOSE_REASON.CLICK_SELECTION}));
  }

  protected onKeydown(event: KeyboardEvent) {
    if (this.keepOpen || event.defaultPrevented) return;
    const keyCode = event.code;

    if (!event.defaultPrevented && isClosableKey(keyCode)) {
      event.preventDefault();
      this.dispatchEvent(createDefaultCloseMenuEvent(
          this, {kind: CLOSE_REASON.KEYDOWN, key: keyCode}));
    }
  }
}
