/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Validator} from './validator.js';

/**
 * Constraint validation properties for a radio.
 */
export interface RadioState {
  /**
   * Whether the radio is checked.
   */
  readonly checked: boolean;

  /**
   * Whether the radio is required.
   */
  readonly required: boolean;
}

/**
 * Radio constraint validation properties for a single radio and its siblings.
 */
export type RadioGroupState = readonly [RadioState, ...RadioState[]];

/**
 * A validator that provides constraint validation that emulates
 * `<input type="radio">` validation.
 */
export class RadioValidator extends Validator<RadioGroupState> {
  private radioElement?: HTMLInputElement;

  protected override computeValidity(states: RadioGroupState) {
    if (!this.radioElement) {
      // Lazily create the radio element
      this.radioElement = document.createElement('input');
      this.radioElement.type = 'radio';
      // A name is required for validation to run
      this.radioElement.name = 'group';
    }

    let isRequired = false;
    let isChecked = false;
    for (const {checked, required} of states) {
      if (required) {
        isRequired = true;
      }

      if (checked) {
        isChecked = true;
      }
    }

    // Firefox v119 doesn't compute grouped radio validation correctly while
    // they are detached from the DOM, which is why we don't render multiple
    // virtual <input>s. Instead, we can check the required/checked states and
    // grab the i18n'd validation message if the value is missing.
    this.radioElement.checked = isChecked;
    this.radioElement.required = isRequired;
    return {
      validity: {
        valueMissing: isRequired && !isChecked,
      },
      validationMessage: this.radioElement.validationMessage,
    };
  }

  protected override equals(
    prevGroup: RadioGroupState,
    nextGroup: RadioGroupState,
  ) {
    if (prevGroup.length !== nextGroup.length) {
      return false;
    }

    for (let i = 0; i < prevGroup.length; i++) {
      const prev = prevGroup[i];
      const next = nextGroup[i];
      if (prev.checked !== next.checked || prev.required !== next.required) {
        return false;
      }
    }

    return true;
  }

  protected override copy(states: RadioGroupState): RadioGroupState {
    // Cast as unknown since typescript does not have enough information to
    // infer that the array always has at least one element.
    return states.map(({checked, required}) => ({
      checked,
      required,
    })) as unknown as RadioGroupState;
  }
}
