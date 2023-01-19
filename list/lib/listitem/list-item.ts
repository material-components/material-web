/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Required for @ariaProperty
// tslint:disable:no-new-decorators

import '../../../ripple/ripple.js';
import '../../../focus/focus-ring.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAsync, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {ariaProperty} from '../../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../../focus/strong-focus.js';
import {ripple} from '../../../ripple/directive.js';
import {MdRipple} from '../../../ripple/ripple.js';
import {ARIARole} from '../../../types/aria.js';

interface ListItemSelf {
  selected: boolean;
  disabled: boolean;
}

/**
 * The interface of an item that is compatible with md-list. An item that is
 * selectable and disablable.
 */
export type ListItem = ListItemSelf&HTMLElement;

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListItemEl extends LitElement implements ListItem {
  @ariaProperty
  // tslint:disable-next-line
  @property({type: String, attribute: 'data-role', noAccessor: true})
  // @ts-ignore(b/264292293): Use `override` with TS 4.9+
  role: ARIARole = 'listitem';
  @ariaProperty
  @property({type: String, attribute: 'data-aria-selected', noAccessor: true})
  override ariaSelected!: 'true'|'false';
  @ariaProperty
  @property({type: String, attribute: 'data-aria-checked', noAccessor: true})
  override ariaChecked!: 'true'|'false';

  /**
   * The primary, headline text of the list item.
   */
  @property() headline = '';

  /**
   * The one-line supporting text below the headline.
   */
  @property() supportingText = '';

  /**
   * The multi-line supporting text below the headline. __NOTE:__ if set to a
   * truthy value, overrides the visibility and behavior of `supportingText`.
   */
  @property() multiLineSupportingText = '';

  /**
   * The supporting text placed at the end of the item. Overriden by elements
   * slotted into the `end` slot.
   */
  @property() trailingSupportingText = '';

  /**
   * Disables the item and makes it non-selectable and non-interactive.
   */
  @property({type: Boolean}) disabled = false;

  /**
   * The tabindex of the underlying item.
   *
   * __NOTE:__ this is overriden by the keyboard behavior of `md-list` and by
   * setting `selected`.
   */
  @property({type: Number}) itemTabIndex = -1;

  /**
   * Whether or not the element is in the selected state. When selected,
   * tabindex is set to 0, and in some list item variants (like md-list-item),
   * focuses the underlying item.
   */
  @property({type: Boolean, reflect: true}) selected = false;

  /**
   * READONLY. Sets the `md-list-item` attribute on the element.
   */
  @property({type: Boolean, attribute: 'md-list-item', reflect: true})
  isListItem = true;

  @queryAsync('md-ripple') protected ripple!: Promise<MdRipple|null>;
  @query('.list-item') protected listItemRoot!: HTMLElement;

  @state() protected showFocusRing = false;
  @state() protected showRipple = false;

  /**
   * Only meant to be overriden by subclassing and not by the user. This is
   * so that we have control over focus on specific variants such as disabling
   * focus on <md-autocomplete-item> but enabling it for <md-menu-item>.
   */
  protected focusOnSelection = true;

  protected getRipple = () => {
    this.showRipple = true;
    return this.ripple;
  };

  private isFirstUpdate = true;

  override willUpdate(changed: PropertyValues<this>) {
    if (changed.has('selected') && !this.disabled) {
      if (this.selected) {
        this.itemTabIndex = 0;

        if (this.focusOnSelection) {
          this.showFocusRing = shouldShowStrongFocus();
        }

        // Do not reset anything if it's the first render because user could
        // have set `itemTabIndex` manually.
      } else if (!this.isFirstUpdate) {
        this.itemTabIndex = -1;
      }
    }
  }

  override render(): TemplateResult {
    return this.renderListItem(html`
      ${this.renderStart()}
      ${this.renderBody()}
      ${this.renderEnd()}
      <div class="ripple">
        ${this.renderRipple()}
      </div>
      <div class="focus-ring">
        ${this.renderFocusRing()}
      </div>`);
  }

  /**
   * Renders the root list item.
   *
   * @param content {unkown} the child content of the list item.
   */
  protected renderListItem(content: unknown) {
    return html`
      <li
          tabindex=${this.disabled ? -1 : this.itemTabIndex}
          role=${this.role}
          aria-selected=${this.ariaSelected || nothing}
          aria-checked=${this.ariaChecked || nothing}
          class="list-item ${classMap(this.getRenderClasses())}"
          @pointerdown=${this.onPointerdown}
          @focus=${this.onFocus}
          @blur=${this.onBlur}
          @click=${this.onClick}
          @pointerenter=${this.onPointerenter}
          @pointerleave=${this.onPointerleave}
          @keydown=${this.onKeydown}
          ${ripple(this.getRipple)}>${content}</li>`;
  }

  /**
   * Handles rendering of the ripple element.
   */
  protected renderRipple(): TemplateResult|typeof nothing {
    return this.showRipple ?
        html`<md-ripple ?disabled="${this.disabled}"></md-ripple>` :
        nothing;
  }

  /**
   * Handles rendering of the focus ring.
   */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  /**
   * Classes applied to the list item root.
   */
  protected getRenderClasses(): ClassInfo {
    return {
      'with-one-line':
          this.supportingText === '' && this.multiLineSupportingText === '',
      'with-two-line':
          this.supportingText !== '' && this.multiLineSupportingText === '',
      'with-three-line': this.multiLineSupportingText !== '',
      'disabled': this.disabled,
      'enabled': !this.disabled,
    };
  }

  /**
   * The content rendered at the start of the list item.
   */
  protected renderStart(): TemplateResult {
    return html`<div class="start"><slot name="start"></slot></div>`;
  }

  /**
   * Handles rendering the headline and supporting text.
   */
  protected renderBody(): TemplateResult {
    const supportingText = this.multiLineSupportingText !== '' ?
        this.renderMultiLineSupportingText() :
        this.supportingText !== '' ? this.renderSupportingText() :
                                     '';

    return html`<div class="body"
      ><span class="label-text">${this.headline}</span>${supportingText}</div>`;
  }

  /**
   * Renders the one-line supporting text.
   */
  protected renderSupportingText(): TemplateResult {
    return html`<span class="supporting-text">${this.supportingText}</span>`;
  }

  /**
   * Renders the multi-line supporting text
   */
  protected renderMultiLineSupportingText(): TemplateResult {
    return html`<span class="supporting-text supporting-text--multi-line"
      >${this.multiLineSupportingText}</span>`;
  }

  /**
   * The content rendered at the end of the list item.
   */
  protected renderEnd(): TemplateResult {
    const supportingText = this.trailingSupportingText !== '' ?
        this.renderTrailingSupportingText() :
        '';
    return html`<div class="end"
      ><slot name="end">${supportingText}</slot></div>`;
  }

  /**
   * Renders the supporting text at the end of the list item.
   */
  protected renderTrailingSupportingText(): TemplateResult {
    return html`<span class="trailing-supporting-text"
      >${this.trailingSupportingText}</span>`;
  }

  protected onPointerdown() {
    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected onFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected onBlur() {
    this.showFocusRing = false;
  }

  // For easier overriding in menu-item
  protected onClick(e: Event) {}
  protected onKeydown(e: KeyboardEvent) {}
  protected onPointerenter(e: Event) {}
  protected onPointerleave(e: Event) {}

  override updated(changed: PropertyValues<this>) {
    super.updated(changed);

    // will focus the list item root if it is selected but not on the first
    // update or else it may cause the page to jump on first load.
    if (changed.has('selected') && !this.isFirstUpdate && this.selected &&
        this.focusOnSelection) {
      this.listItemRoot.focus();
    }

    this.isFirstUpdate = false;
  }
}
