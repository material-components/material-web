/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../ripple/ripple.js';
import '../../../focus/md-focus-ring.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, literal} from 'lit/static-html.js';

import {ARIAMixinStrict} from '../../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../../internal/aria/delegate.js';

/**
 * Supported roles for a list item.
 */
export type ListItemRole = 'listitem'|'menuitem'|'option'|'link'|'none';

interface ListItemSelf {
  active: boolean;
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
  @property({type: Boolean}) disabled = false;

  /**
   * The tabindex of the underlying item.
   *
   * __NOTE:__ this is overridden by the keyboard behavior of `md-list` and by
   * setting `selected`.
   */
  @property({type: Number, attribute: 'item-tabindex'}) itemTabIndex = -1;

  /**
   * Whether or not the element is actively being interacted with by md-list.
   * When active, tabindex is set to 0, and in some list item variants (like
   * md-list-item), focuses the underlying item.
   */
  @property({type: Boolean, reflect: true}) active = false;

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

  /**
   * Only meant to be overridden by subclassing and not by the user. This is
   * so that we have control over focus on specific variants such as disabling
   * focus on <md-autocomplete-item> but enabling it for <md-menu-item>.
   */
  protected focusOnActivation = true;

  protected isFirstUpdate = true;

  protected override willUpdate(changed: PropertyValues<this>) {
    if (changed.has('active') && !this.disabled) {
      if (this.active) {
        this.itemTabIndex = 0;
      } else if (!this.isFirstUpdate) {
        // Do not reset anything if it's the first render because user could
        // have set `itemTabIndex` manually.
        this.itemTabIndex = -1;
      }
    }
  }

  protected override render() {
    return this.renderListItem(html`
      <div class="container">
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
        tabindex=${this.disabled ? -1 : this.itemTabIndex}
        role=${role}
        aria-selected=${(this as ARIAMixinStrict).ariaSelected || nothing}
        aria-checked=${(this as ARIAMixinStrict).ariaChecked || nothing}
        class="list-item ${classMap(this.getRenderClasses())}"
        href=${this.href || nothing}
        target=${target}
        @click=${this.onClick}
        @pointerenter=${this.onPointerenter}
        @pointerleave=${this.onPointerleave}
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
    return html`<div class="start"><slot name="start"></slot></div>`;
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
    return html`<div class="end"
      ><slot name="end">${supportingText}</slot></div>`;
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
  protected onPointerenter?(event: Event): void;
  protected onPointerleave?(event: Event): void;

  protected override updated(changed: PropertyValues<this>) {
    super.updated(changed);

    // will focus the list item root if it is selected but not on the first
    // update or else it may cause the page to jump on first load.
    if (changed.has('active') && !this.isFirstUpdate && this.active &&
        this.focusOnActivation) {
      this.focus();
    }

    this.isFirstUpdate = false;
  }

  override focus() {
    this.listItemRoot?.focus?.();
  }
}
