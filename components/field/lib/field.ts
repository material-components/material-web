/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAsync, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

import {FieldState, LabelType} from './state';

/** @soyCompatible */
export class Field extends LitElement implements FieldState {
  // FieldState
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) error = false;
  @property({type: Boolean}) focused = false;
  @property({type: String}) label?: string;
  @state() labelText = '';
  @property({type: Boolean}) populated = false;
  @property({type: Boolean}) required = false;
  @state() visibleLabelType = LabelType.RESTING;
  get floatingLabelRect() {
    return this.floatingLabelEl.then(el => el.getBoundingClientRect());
  }
  get restingLabelRect() {
    return this.restingLabelEl.then(el => el.getBoundingClientRect());
  }

  @queryAsync('.md3-field__label--floating')
  protected readonly floatingLabelEl!: Promise<HTMLElement>;
  @queryAsync('.md3-field__label--resting')
  protected readonly restingLabelEl!: Promise<HTMLElement>;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <span class="md3-field ${classMap(this.getRenderClasses())}">
        ${this.renderContainer()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderContainer(): TemplateResult {
    return html`
      <span class="md3-field__container">
        ${this.renderContainerContents()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-field--disabled': this.disabled,
      'md3-field--error': this.error,
      'md3-field--focus': this.focused,
      'md3-field--populated': this.populated,
      'md3-field--required': this.required,
      'md3-field--no-label': !this.label,
    };
  }

  /** @soyTemplate */
  protected renderContainerContents(): TemplateResult {
    return html`
      <span class="md3-field__start">
        <slot name="start"></slot>
      </span>
      <span class="md3-field__middle">${this.renderMiddleContents()}</span>
      <span class="md3-field__end">
        <slot name="end"></slot>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderMiddleContents(): TemplateResult {
    return html`
      <span class="md3-field__content"><slot></slot></span>
    `;
  }

  /** @soyTemplate */
  protected renderLabel(labelType: LabelType): TemplateResult {
    return html`
      <span class="md3-field__label ${
        classMap(this.getRenderLabelClasses(labelType))}"
        aria-hidden=${labelType !== this.visibleLabelType}
      >${this.labelText}</span>
    `;
  }

  /** @soyTemplate */
  protected getRenderLabelClasses(labelType: LabelType): ClassInfo {
    return {
      'md3-field__label--floating': labelType === LabelType.FLOATING,
      'md3-field__label--resting': labelType === LabelType.RESTING,
      'md3-field__label--hidden': labelType !== this.visibleLabelType,
    };
  }

  protected async animateLabel(...args: Parameters<Animatable['animate']>) {
    const labelEl = await this.restingLabelEl;
    return labelEl.animate(...args);
  }
}
