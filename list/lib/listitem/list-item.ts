/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/ripple/ripple';
import '@material/web/focus/focus-ring';

import {ActionElement, BeginPressConfig, EndPressConfig} from '@material/web/actionelement/action-element';
import {pointerPress, shouldShowStrongFocus} from '@material/web/focus/strong-focus';
import {MdRipple} from '@material/web/ripple/ripple';
import {ARIARole} from '@material/web/types/aria';
import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

/** @soyCompatible */
export class ListItem extends ActionElement {
  @property({type: String}) supportingText = '';
  @property({type: String}) multiLineSupportingText = '';
  @property({type: String}) trailingSupportingText = '';
  @property({type: Boolean}) disabled = false;
  @property({type: Number}) itemTabIndex = -1;
  @property({type: String}) headline = '';
  @query('md-ripple') ripple!: MdRipple;
  @query('[data-query-md3-list-item]') listItemRoot!: HTMLElement;
  @state() protected showFocusRing = false;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <li
          tabindex=${this.itemTabIndex}
          role=${this.getAriaRole()}
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
    // TODO(b/240124486): Replace with beginPress provided by action element.
    this.ripple.beginPress(e);
  }

  protected handleKeyUp(e: KeyboardEvent) {
    if (e.key !== ' ' && e.key !== 'Enter') return;

    e.preventDefault();
    // TODO(b/240124486): Replace with beginPress provided by action element.
    this.ripple.endPress();
  }

  activate() {
    this.itemTabIndex = 0;
    this.listItemRoot.focus();
    this.showFocusRing = true;
  }

  isActive() {
    return this.itemTabIndex === 0 && this.showFocusRing;
  }

  deactivate() {
    this.itemTabIndex = -1;
  }
}
