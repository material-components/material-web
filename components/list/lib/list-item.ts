/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAssignedNodes} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

import {ListItemIcon} from './list-item-icon';

/** @soyCompatible */
export class ListItem extends LitElement {
  @property({type: String}) supportingText = '';
  @property({type: String}) trailingSupportingText = '';

  @queryAssignedNodes('start', true)
  protected startElement!: HTMLElement[]|null;

  @queryAssignedNodes('end', true) protected endElement!: HTMLElement[]|null;

  get leadingIcon() {
    return this.startElement?.find((el) => el instanceof ListItemIcon) ?? null;
  }

  get leadingAvatar() {
    return this.startElement?.find(
               (el) => el.classList.contains('md3-list-item__avatar')) ??
        null;
  }

  get leadingThumbnail() {
    return this.startElement?.find(
               (el) => el.classList.contains('md3-list-item__thumbnail')) ??
        null;
  }

  get leadingImage() {
    return this.startElement?.find(
               (el) => el.classList.contains('md3-list-item__image')) ??
        null;
  }

  get leadingVideo() {
    return this.startElement?.find(
               (el) => el.classList.contains('md3-list-item__video')) ??
        null;
  }

  get trailingIcon() {
    return this.endElement?.find((el) => el instanceof ListItemIcon) ?? null;
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    // TODO(b/182405623): restore whitespace
    return html`
      <li
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
      'md3-list-item--with-leading-icon': !!this.leadingIcon,
      'md3-list-item--with-leading-avatar': !!this.leadingAvatar,
      'md3-list-item--with-leading-thumbnail': !!this.leadingThumbnail,
      'md3-list-item--with-leading-image': !!this.leadingImage,
      'md3-list-item--with-leading-video': !!this.leadingVideo,
      'md3-list-item--with-trailing-icon': !!this.trailingIcon,
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
}
