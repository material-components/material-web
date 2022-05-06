/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, queryAssignedElements, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

import {ARIARole} from '../../types/aria.js';

/** @soyCompatible */
export class ListItem extends LitElement {
  @property({type: String}) supportingText = '';
  @property({type: String}) trailingSupportingText = '';

  @queryAssignedElements(
      {slot: 'start', flatten: true, selector: '[media=icon]'})
  protected leadingIcon!: HTMLElement[];

  @queryAssignedElements({slot: 'end', flatten: true, selector: '[media=icon]'})
  protected trailingIcon!: HTMLElement[];

  @property() hasLeadingIcon = false;
  @property() hasTrailingIcon = false;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <li
          tabindex="0"
          role=${this.getAriaRole()}
          class="md3-list-item ${classMap(this.getRenderClasses())}"
          @click=${this.handleClick}>
        ${this.renderStart()}
        ${this.renderBody()}
        ${this.renderEnd()}
      </li>`;
  }

  /** @soyTemplate */
  protected getAriaRole(): ARIARole {
    return 'listitem';
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-list-item--with-one-line': this.supportingText === '',
      'md3-list-item--with-two-lines': this.supportingText !== '',
      'md3-list-item--with-leading-icon': this.hasLeadingIcon,
      'md3-list-item--with-trailing-icon': this.hasTrailingIcon,
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
          --><slot @slotchange=${this.handleSlotChange}></slot><!--
       --></span><!--
        -->${this.supportingText !== '' ? this.renderSupportingText() : ''}<!--
    --></div>`;
  }

  /** @soyTemplate */
  protected renderSupportingText(): TemplateResult {
    return html`<span class="md3-list-item__supporting-text"><!--
          -->${this.supportingText}<!--
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

  handleClick() {}

  override update(changedProperties: PropertyValues<this>) {
    this.updateMetadata();
    super.update(changedProperties);
  }

  private updateMetadata() {
    this.hasLeadingIcon = this.leadingIcon.length > 0;
    this.hasTrailingIcon = this.trailingIcon.length > 0;
  }
}
