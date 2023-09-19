/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../ripple/ripple.js';
import '../../../focus/md-focus-ring.js';

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';

/**
 * Creates an event that requests the parent md-list to deactivate all other
 * items.
 */
export function createDeactivateItemsEvent() {
  return new Event('deactivate-items', {bubbles: true, composed: true});
}

/**
 * The type of the event that requests the parent md-list to deactivate all
 * other items.
 */
export type DeactivateItemsEvent =
    ReturnType<typeof createDeactivateItemsEvent>;

/**
 * Creates an event that requests the menu to set `tabindex=0` on the item and
 * focus it. We use this pattern because List keeps track of what element is
 * active in the List by maintaining tabindex. We do not want list items
 * to set tabindex on themselves or focus themselves so that we can organize all
 * that logic in the parent List and Menus, and list item stays as dumb as
 * possible.
 */
export function createRequestActivationEvent() {
  return new Event('request-activation', {bubbles: true, composed: true});
}

/**
 * The type of the event that requests the list activates and focuses the item.
 */
export type RequestActivationEvent =
    ReturnType<typeof createRequestActivationEvent>;

/**
 * Supported roles for a list item.
 */
export type ListItemRole = 'listitem'|'menuitem'|'option'|'link'|'none';

interface ListItemSelf {
  disabled: boolean;
}

/**
 * The interface of an item that is compatible with md-list. An item that is
 * selectable and disablable.
 */
export type ListItem = ListItemSelf&HTMLElement;

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListItemEl extends LitElement implements ListItem {
  static {
    requestUpdateOnAriaChange(ListItemEl);
  }

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true
  };

  /**
   * The primary, headline text of the list item.
   */
  @property() headline = '';

  /**
   * The one-line supporting text below the headline. Set
   * `multiLineSupportingText` to `true` to support multiple lines in the
   * supporting text.
   */
  @property({attribute: 'supporting-text'}) supportingText = '';

  /**
   * Modifies `supportingText` to support multiple lines.
   */
  @property({type: Boolean, attribute: 'multi-line-supporting-text'})
  multiLineSupportingText = false;

  /**
   * The supporting text placed at the end of the item. Overridden by elements
   * slotted into the `end` slot.
   */
  @property({attribute: 'trailing-supporting-text'})
  trailingSupportingText = '';

  /**
   * Disables the item and makes it non-selectable and non-interactive.
   */
  @property({type: Boolean, reflect: true}) disabled = false;

  /**
   * Sets the role of the list item. Set to 'nothing' to clear the role. This
   * property will be ignored if `href` is set since the underlying element will
   * be a native anchor tag.
   */
  @property() type: ListItemRole = 'listitem';

  /**
   * READONLY. Sets the `md-list-item` attribute on the element.
   */
  @property({type: Boolean, attribute: 'md-list-item', reflect: true})
  isListItem = true;

  /**
   * Sets the underlying `HTMLAnchorElement`'s `href` resource attribute.
   */
  @property() href = '';

  /**
   * Sets the underlying `HTMLAnchorElement`'s `target` attribute when `href` is
   * set.
   */
  @property() target: '_blank'|'_parent'|'_self'|'_top'|'' = '';

  @query('.list-item') protected readonly listItemRoot!: HTMLElement|null;

  protected override render() {
    return this.renderListItem(html`
      <div class="content-wrapper">
        ${this.renderStart()}
        ${this.renderBody()}
        ${this.renderEnd()}
        ${this.renderRipple()}
        ${this.renderFocusRing()}
      </div>
    `);
  }

  /**
   * Renders the root list item.
   *
   * @param content the child content of the list item.
   */
  protected renderListItem(content: unknown) {
    const isAnchor = !!this.href;
    const tag = isAnchor ? literal`a` : literal`li`;
    const role = isAnchor || this.type === 'none' ? nothing : this.type;
    const target = isAnchor && !!this.target ? this.target : nothing;
    return staticHtml`
      <${tag}
        id="item"
        tabindex="${this.disabled ? -1 : 0}"
        role=${role}
        aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
        aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
        class="list-item ${classMap(this.getRenderClasses())}"
        href=${this.href || nothing}
        target=${target}
        @focus=${this.onFocus}
        @click=${this.onClick}
        @mouseenter=${this.onMouseenter}
        @mouseleave=${this.onMouseleave}
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
          @visibility-changed=${this.onFocusRingVisibilityChanged}
          class="focus-ring"
          part="focus-ring"
          for="item"
          inward></md-focus-ring>`;
  }

  protected onFocusRingVisibilityChanged(e: Event) {}

  /**
   * Classes applied to the list item root.
   */
  protected getRenderClasses() {
    return {
      'with-one-line': this.supportingText === '',
      'with-two-line':
          this.supportingText !== '' && !this.multiLineSupportingText,
      'with-three-line':
          this.supportingText !== '' && this.multiLineSupportingText,
      'disabled': this.disabled
    };
  }

  /**
   * The content rendered at the start of the list item.
   */
  protected renderStart() {
    return html`
      <div class="start">
        <slot name="start"></slot>
        <slot name="start-icon"></slot>
        <slot name="start-image"></slot>
        <slot name="start-avatar"></slot>
        <slot name="start-video"></slot>
        <slot name="start-video-large"></slot>
      </div>`;
  }

  /**
   * Handles rendering the headline and supporting text.
   */
  protected renderBody() {
    const supportingText =
        this.supportingText !== '' ? this.renderSupportingText() : '';

    return html`<div class="body"
      ><span class="label-text">${this.headline}</span>${supportingText}</div>`;
  }

  /**
   * Renders the one-line supporting text.
   */
  protected renderSupportingText() {
    return html`<span
        class="supporting-text ${classMap(this.getSupportingTextClasses())}"
      >${this.supportingText}</span>`;
  }

  /**
   * Gets the classes for the supporting text node
   */
  protected getSupportingTextClasses() {
    return {'supporting-text--multi-line': this.multiLineSupportingText};
  }

  /**
   * The content rendered at the end of the list item.
   */
  protected renderEnd() {
    const supportingText = this.trailingSupportingText !== '' ?
        this.renderTrailingSupportingText() :
        '';
    return html`
      <div class="end">
        ${supportingText}
        <slot name="end"></slot>
        <slot name="end-icon"></slot>
      </div>`;
  }

  /**
   * Renders the supporting text at the end of the list item.
   */
  protected renderTrailingSupportingText() {
    return html`<span class="trailing-supporting-text"
      >${this.trailingSupportingText}</span>`;
  }

  // For easier overriding in menu-item
  protected onClick?(event: Event): void;
  protected onKeydown?(event: KeyboardEvent): void;
  protected onMouseenter?(event: Event): void;
  protected onMouseleave?(event: Event): void;
  protected onFocus?(event: FocusEvent): void;

  override focus() {
    // TODO(b/300334509): needed for some cases where delegatesFocus doesn't
    // work programmatically like in FF and select-option
    this.listItemRoot?.focus();
  }
}
