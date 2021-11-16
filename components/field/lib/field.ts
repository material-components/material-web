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

  @queryAsync('.mdc-field__label--floating')
  protected readonly floatingLabelEl!: Promise<HTMLElement>;
  @queryAsync('.mdc-field__label--resting')
  protected readonly restingLabelEl!: Promise<HTMLElement>;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <span class="mdc-field ${classMap(this.getRenderClasses())}">
        ${this.renderContainer()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderContainer(): TemplateResult {
    return html`
      <span class="mdc-field__container">
        ${this.renderContainerContents()}
      </span>
    `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'mdc-field--disabled': this.disabled,
      'mdc-field--error': this.error,
      'mdc-field--focus': this.focused,
      'mdc-field--populated': this.populated,
      'mdc-field--required': this.required,
      'mdc-field--no-label': !this.label,
    };
  }

  /** @soyTemplate */
  protected renderContainerContents(): TemplateResult {
    return html`
      <span class="mdc-field__start">
        <slot name="start"></slot>
      </span>
      <span class="mdc-field__middle">${this.renderMiddleContents()}</span>
      <span class="mdc-field__end">
        <slot name="end"></slot>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderMiddleContents(): TemplateResult {
    return html`
      <span class="mdc-field__content"><slot></slot></span>
    `;
  }

  /** @soyTemplate */
  protected renderLabel(labelType: LabelType): TemplateResult {
    return html`
      <span class="mdc-field__label
        ${classMap(this.getRenderLabelClasses(labelType))}"
      >${this.labelText}</span>
    `;
  }

  /** @soyTemplate */
  protected getRenderLabelClasses(labelType: LabelType): ClassInfo {
    return {
      'mdc-field__label--floating': labelType === LabelType.FLOATING,
      'mdc-field__label--resting': labelType === LabelType.RESTING,
      'mdc-field__label--hidden': labelType !== this.visibleLabelType,
    };
  }

  protected async animateLabel(...args: Parameters<Animatable['animate']>) {
    const labelEl = await this.restingLabelEl;
    return labelEl.animate(...args);
  }
}
