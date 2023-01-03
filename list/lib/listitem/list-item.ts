/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../../ripple/ripple.js';
import '../../../focus/focus-ring.js';

import {ActionElement, BeginPressConfig, EndPressConfig} from '../../../actionelement/action-element.js';
import {ariaProperty} from '../../../decorators/aria-property.js';
import {pointerPress, shouldShowStrongFocus} from '../../../focus/strong-focus.js';
import {MdRipple} from '../../../ripple/ripple.js';
import {ARIARole} from '../../../types/aria.js';
import {html, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

/** @soyCompatible */
export class ListItem extends ActionElement {
  @ariaProperty  // tslint:disable-line:no-new-decorators
  // tslint:disable-next-line:decorator-placement
  @property({type: String, attribute: 'data-role', noAccessor: true})
  // @ts-ignore(b/264292293): Use `override` with TS 4.9+
  role: ARIARole = 'listitem';

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'data-aria-selected', noAccessor: true})
  override ariaSelected!: 'true'|'false';

  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'data-aria-checked', noAccessor: true})
  override ariaChecked!: 'true'|'false';

  @property({type: String}) itemId!: string;

  @property({type: String}) supportingText = '';
  @property({type: String}) multiLineSupportingText = '';
  @property({type: String}) trailingSupportingText = '';
  @property({type: Boolean}) disabled = false;
  @property({type: Number}) itemTabIndex = -1;
  @property({type: String}) headline = '';
  @query('md-ripple') ripple!: MdRipple;
  @query('[data-query-md3-list-item]') listItemRoot!: HTMLElement;
  @property({type: Boolean}) showFocusRing = false;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <li
          tabindex=${this.itemTabIndex}
          role=${this.role}
          aria-selected=${ifDefined(this.ariaSelected || undefined)}
          aria-checked=${ifDefined(this.ariaChecked || undefined)}
          id=${ifDefined(this.itemId || undefined)}
          data-query-md3-list-item
          class="md3-list-item ${classMap(this.getRenderClasses())}"
          @pointerdown=${this.handlePointerDown}
          @pointerenter=${this.handlePointerEnter}
          @pointerup=${this.handlePointerUp}
          @pointercancel=${this.handlePointerCancel}
          @pointerleave=${this.handlePointerLeave}
          @keydown=${this.handleKeyDown}
          @keyup=${this.handleKeyUp}
          @click=${this.handleClick}
          @contextmenu=${this.handleContextMenu}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          >
        ${this.renderStart()}
        ${this.renderBody()}
        ${this.renderEnd()}
        <div class="md3-list-item__ripple">
          ${this.renderRipple()}
        </div>
        <div class="md3-list-item__focus-ring">
          ${this.renderFocusRing()}
        </div>
      </li>`;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return html`<md-ripple ?disabled="${this.disabled}"></md-ripple>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`<md-focus-ring .visible="${
        this.showFocusRing}"></md-focus-ring>`;
  }

  /** @soyTemplate */
  protected getAriaRole(): ARIARole {
    return 'listitem';
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-list-item--with-one-line':
          this.supportingText === '' && this.multiLineSupportingText === '',
      'md3-list-item--with-two-line':
          this.supportingText !== '' && this.multiLineSupportingText === '',
      'md3-list-item--with-three-line': this.multiLineSupportingText !== '',
      'md3-list-item--disabled': this.disabled,
      'md3-list-item--enabled': !this.disabled,
    };
  }

  /** @soyTemplate */
  protected renderStart(): TemplateResult {
    return html`<div class="md3-list-item__start"><!--
      --><slot name="start" @slotchange=${this.handleSlotChange}></slot><!--
    --></div>`;
  }

  /** @soyTemplate */
  protected renderBody(): TemplateResult {
    return html`<div class="md3-list-item__body"><!--
       --><span class="md3-list-item__label-text"><!--
          -->${this.headline}<!--
       --></span><!--
        -->${
        this.multiLineSupportingText !== '' ?
            this.renderMultiLineSupportingText() :
            this.supportingText !== '' ? this.renderSupportingText() :
                                         ''}<!--
    --></div>`;
  }

  /** @soyTemplate */
  protected renderSupportingText(): TemplateResult {
    return html`<span class="md3-list-item__supporting-text"><!--
          -->${this.supportingText}<!--
       --></span>`;
  }

  /** @soyTemplate */
  protected renderMultiLineSupportingText(): TemplateResult {
    return html`<span class="md3-list-item__supporting-text md3-list-item__supporting-text--multi-line"><!--
          -->${this.multiLineSupportingText}<!--
       --></span>`;
  }

  /** @soyTemplate */
  protected renderEnd(): TemplateResult {
    return html`<div class="md3-list-item__end"><!--
      --><slot name="end" @slotchange=${this.handleSlotChange}><!--
        -->${
        this.trailingSupportingText !== '' ?
            this.renderTrailingSupportingText() :
            ''}<!--
      --></slot><!--
    --></div>`;
  }

  /** @soyTemplate */
  protected renderTrailingSupportingText(): TemplateResult {
    return html`<span class="md3-list-item__trailing-supporting-text"><!--
          -->${this.trailingSupportingText}<!--
       --></span>`;
  }

  protected handleSlotChange() {
    this.requestUpdate();
  }

  override beginPress({positionEvent}: BeginPressConfig) {
    this.ripple.beginPress(positionEvent);
  }

  override endPress({cancelled}: EndPressConfig) {
    this.ripple.endPress();

    if (cancelled) return;

    super.endPress({cancelled, actionData: {item: this}});
  }

  protected handleFocus() {
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handleBlur() {
    this.showFocusRing = false;
  }

  override handlePointerDown(e: PointerEvent) {
    super.handlePointerDown(e);

    pointerPress();
    this.showFocusRing = shouldShowStrongFocus();
  }

  protected handlePointerEnter(e: PointerEvent) {
    this.ripple.beginHover(e);
  }

  override handlePointerLeave(e: PointerEvent) {
    super.handlePointerLeave(e);

    this.ripple.endHover();
  }

  /** @bubbleWizEvent */
  protected handleKeyDown(e: KeyboardEvent) {
    if (e.key !== ' ' && e.key !== 'Enter') return;

    e.preventDefault();
    // TODO(b/240124486): Replace with beginPress provided by action
    // element.
    this.ripple.beginPress(e);
  }

  protected handleKeyUp(e: KeyboardEvent) {
    if (e.key !== ' ' && e.key !== 'Enter') return;

    e.preventDefault();
    // TODO(b/240124486): Replace with beginPress provided by action element.
    super.endPress({cancelled: false, actionData: {item: this}});
    this.ripple.endPress();
  }

  /**
   * Focuses list item and makes list item focusable via keyboard.
   */
  activate() {
    this.itemTabIndex = 0;
    this.listItemRoot.focus();
    this.showFocusRing = true;
  }

  /**
   * Returns true if list item is currently focused and is focusable.
   */
  isActive() {
    return this.itemTabIndex === 0 && this.showFocusRing;
  }

  /**
   * Removes list item from sequential keyboard navigation.
   */
  deactivate() {
    this.itemTabIndex = -1;
  }
}
