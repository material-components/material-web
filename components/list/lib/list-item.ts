/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, queryAssignedNodes, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

/** @soyCompatible */
export class ListItem extends LitElement {
  @property({type: String}) supportingText = '';
  @property({type: String}) trailingSupportingText = '';

  @queryAssignedNodes('start', true) protected startElement!: HTMLElement[];

  @queryAssignedNodes('end', true) protected endElement!: HTMLElement[];

  @property() hasLeadingIcon = false;
  @property() hasTrailingIcon = false;
  @state() protected hasLeadingAvatar = false;
  @state() protected hasLeadingThumbnail = false;
  @state() protected hasLeadingImage = false;
  @state() protected hasLeadingVideo = false;

  /** @soyTemplate */
  override render(): TemplateResult {
    // TODO(b/182405623): restore whitespace
    return html`
      <li
          tabindex="0"
          class="md3-list-item ${classMap(this.getRenderClasses())}"><!--
        -->${this.renderStart()}<!--
        -->${this.renderBody()}<!--
        -->${this.renderEnd()}<!--
      --></li>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-list-item--with-one-line': this.supportingText === '',
      'md3-list-item--with-two-lines': this.supportingText !== '',
      'md3-list-item--with-leading-icon': this.hasLeadingIcon,
      'md3-list-item--with-leading-avatar': this.hasLeadingAvatar,
      'md3-list-item--with-leading-thumbnail': this.hasLeadingThumbnail,
      'md3-list-item--with-leading-image': this.hasLeadingImage,
      'md3-list-item--with-leading-video': this.hasLeadingVideo,
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

  override update(changedProperties: PropertyValues<this>) {
    this.updateItemContext();
    super.update(changedProperties);
  }

  private updateItemContext() {
    this.hasLeadingIcon = this.startElement.some(
        (el) => el.classList.contains('md3-list-item__icon'));
    this.hasTrailingIcon = this.endElement.some(
        (el) => el.classList.contains('md3-list-item__icon'));
    this.hasLeadingAvatar = this.startElement.some(
        (el) => el.classList.contains('md3-list-item__avatar'));
    this.hasLeadingThumbnail = this.startElement.some(
        (el) => el.classList.contains('md3-list-item__thumbnail'));
    this.hasLeadingImage = this.startElement.some(
        (el) => el.classList.contains('md3-list-item__image'));
    this.hasLeadingVideo = this.startElement.some(
        (el) => el.classList.contains('md3-list-item__video'));
  }
}
