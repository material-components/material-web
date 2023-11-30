/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, render} from 'lit';

import {Validator} from './validator.js';

/**
 * Constraint validation properties for a select dropdown.
 */
export interface SelectState {
  /**
   * The current selected value.
   */
  readonly value: string;

  /**
   * Whether the select is required.
   */
  readonly required: boolean;
}

/**
 * A validator that provides constraint validation that emulates `<select>`
 * validation.
 */
export class SelectValidator extends Validator<SelectState> {
  private selectControl?: HTMLSelectElement;

  protected override computeValidity(state: SelectState) {
    if (!this.selectControl) {
      // Lazily create the platform select
      this.selectControl = document.createElement('select');
    }

    render(html`<option value=${state.value}></option>`, this.selectControl);

    this.selectControl.value = state.value;
    this.selectControl.required = state.required;
    return {
      validity: this.selectControl.validity,
      validationMessage: this.selectControl.validationMessage,
    };
  }

  protected override equals(prev: SelectState, next: SelectState) {
    return prev.value === next.value && prev.required === next.required;
  }

  protected override copy({value, required}: SelectState) {
    return {value, required};
  }
}
