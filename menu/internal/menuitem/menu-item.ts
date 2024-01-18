/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../focus/md-focus-ring.js';
import '../../../labs/item/item.js';
import '../../../ripple/ripple.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {
  property,
  query,
  queryAssignedElements,
  queryAssignedNodes,
} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {literal, html as staticHtml, StaticValue} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';
import {
  MenuItem,
  MenuItemController,
  type MenuItemType,
} from '../controllers/menuItemController.js';

/**
 * @fires close-menu {CustomEvent<{initiator: SelectOption, reason: Reason, itemPath: SelectOption[]}>}
 * Closes the encapsulating menu on closable interaction. --bubbles --composed
 */
export class MenuItemEl extends LitElement implements MenuItem {
  static {
    requestUpdateOnAriaChange(MenuItemEl);
  }

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
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
  @property() target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

  /**
   * Keeps the menu open if clicked or keyboard selected.
   */
  @property({type: Boolean, attribute: 'keep-open'}) keepOpen = false;

  /**
   * Sets the item in the selected visual state when a submenu is opened.
   */
  @property({type: Boolean}) selected = false;

  @query('.list-item') protected readonly listItemRoot!: HTMLElement | null;

  @queryAssignedElements({slot: 'headline'})
  protected readonly headlineElements!: HTMLElement[];
  @queryAssignedElements({slot: 'supporting-text'})
  protected readonly supportingTextElements!: HTMLElement[];
  @queryAssignedNodes({slot: ''})
  protected readonly defaultElements!: Node[];

  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot.
   */
  get typeaheadText() {
    return this.menuItemController.typeaheadText;
  }

  @property({attribute: 'typeahead-text'})
  set typeaheadText(text: string) {
    this.menuItemController.setTypeaheadText(text);
  }

  private readonly menuItemController = new MenuItemController(this, {
    getHeadlineElements: () => {
      return this.headlineElements;
    },
    getSupportingTextElements: () => {
      return this.supportingTextElements;
    },
    getDefaultElements: () => {
      return this.defaultElements;
    },
    getInteractiveElement: () => this.listItemRoot,
  });

  protected override render() {
    return this.renderListItem(html`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
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
    switch (this.menuItemController.tagName) {
      case 'a':
        tag = literal`a`;
        break;
      case 'button':
        tag = literal`button`;
        break;
      default:
      case 'li':
        tag = literal`li`;
        break;
    }

    // TODO(b/265339866): announce "button"/"link" inside of a list item. Until
    // then all are "menuitem" roles for correct announcement.
    const target = isAnchor && !!this.target ? this.target : nothing;
    return staticHtml`
      <${tag}
        id="item"
        tabindex=${this.disabled && !isAnchor ? -1 : 0}
        role=${this.menuItemController.role}
        aria-label=${(this as ARIAMixinStrict).ariaLabel || nothing}
        aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
        aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
        aria-expanded=${(this as ARIAMixinStrict).ariaExpanded || nothing}
        aria-haspopup=${(this as ARIAMixinStrict).ariaHasPopup || nothing}
        class="list-item ${classMap(this.getRenderClasses())}"
        href=${this.href || nothing}
        target=${target}
        @click=${this.menuItemController.onClick}
        @keydown=${this.menuItemController.onKeydown}
      >${content}</${tag}>
    `;
  }

  /**
   * Handles rendering of the ripple element.
   */
  protected renderRipple(): TemplateResult | typeof nothing {
    return html` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`;
  }

  /**
   * Handles rendering of the focus ring.
   */
  protected renderFocusRing(): TemplateResult | typeof nothing {
    return html` <md-focus-ring
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
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
  }

  override focus() {
    // TODO(b/300334509): needed for some cases where delegatesFocus doesn't
    // work programmatically like in FF and select-option
    this.listItemRoot?.focus();
  }
}
