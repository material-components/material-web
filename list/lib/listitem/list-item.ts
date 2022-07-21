/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '@material/web/types/aria';
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

/** @soyCompatible */
export class ListItem extends LitElement {
  @property({type: String}) supportingText = '';
  @property({type: String}) multiLineSupportingText = '';
  @property({type: String}) trailingSupportingText = '';
  @property({type: Boolean}) disabled = false;

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
      'md3-list-item--with-one-line':
          this.supportingText === '' && this.multiLineSupportingText === '',
      'md3-list-item--with-two-line':
          this.supportingText !== '' && this.multiLineSupportingText === '',
      'md3-list-item--with-three-line': this.multiLineSupportingText !== '',
      'md3-list-item--disabled': this.disabled,
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

  handleClick() {}
}
