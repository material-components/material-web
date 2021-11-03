/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';

import {FieldFoundation} from './foundation';
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

  protected foundation = new FieldFoundation({state: this});

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <span class="mdc-field ${classMap(this.getRenderClasses())}">
        <span class="mdc-field__container">
          ${this.renderContainerContents()}
        </span>
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
}
