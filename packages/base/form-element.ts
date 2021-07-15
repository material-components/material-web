/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {addHasRemoveClass, BaseElement, CustomEventListener, EventType, SpecificEventListener} from './base-element';
import {RippleInterface} from './utils';

export {
  addHasRemoveClass,
  BaseElement,
  CustomEventListener,
  EventType,
  RippleInterface,
  SpecificEventListener,
};

/** @soyCompatible */
export abstract class FormElement extends BaseElement {
  static shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /**
   * Form-capable element in the component ShadowRoot.
   *
   * Define in your component with the `@query` decorator
   */
  protected abstract formElement: HTMLElement;

  /**
   * Implement ripple getter for Ripple integration with mwc-formfield
   */
  readonly ripple?: Promise<RippleInterface|null>;

  click() {
    if (this.formElement) {
      this.formElement.focus();
      this.formElement.click();
    }
  }

  setAriaLabel(label: string) {
    if (this.formElement) {
      this.formElement.setAttribute('aria-label', label);
    }
  }

  protected firstUpdated() {
    super.firstUpdated();
    if (this.shadowRoot) {
      this.mdcRoot.addEventListener('change', (e) => {
        this.dispatchEvent(new Event('change', e));
      });
    }
  }
}
