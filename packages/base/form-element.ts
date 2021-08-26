/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {property} from 'lit-element';

import {addHasRemoveClass, BaseElement, CustomEventListener, EventType, SpecificEventListener} from './base-element';
import {RippleInterface} from './utils';

export {
  addHasRemoveClass,
  BaseElement,
  CustomEventListener,
  EventType,
  RippleInterface,
  SpecificEventListener
};

declare global {
  interface FormDataEvent extends Event {
    formData: FormData;
  }

  interface HTMLElementEventMap {
    formdata: FormDataEvent;
  }
}

// ShadyDOM should submit <input> elements in component internals
const USING_SHADY_DOM = window.ShadyDOM?.inUse ?? false;

/** @soyCompatible */
export abstract class FormElement extends BaseElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /**
   * Form-capable element in the component ShadowRoot.
   *
   * Define in your component with the `@query` decorator
   */
  protected abstract formElement: HTMLElement;

  /**
   * Disabled state for the component. When `disabled` is set to `true`, the
   * component will not be added to form submission.
   */
  @property({type: Boolean}) disabled = false;

  /**
   * Implement ripple getter for Ripple integration with mwc-formfield
   */
  readonly ripple?: Promise<RippleInterface|null>;

  /**
   * Form element that contains this element
   */
  protected containingForm: HTMLFormElement|null = null;
  protected formDataListener = (ev: FormDataEvent) => {
    if (!this.disabled) {
      this.setFormData(ev.formData);
    }
  };

  protected findFormElement(): HTMLFormElement|null {
    // If the component internals are not in Shadow DOM, subscribing to form
    // data events could lead to duplicated data, which may not work correctly
    // on the server side.
    if (!this.shadowRoot || USING_SHADY_DOM) {
      return null;
    }
    const root = this.getRootNode() as HTMLElement;
    const forms = root.querySelectorAll('form');
    for (const form of Array.from(forms)) {
      if (form.contains(this)) {
        return form;
      }
    }
    return null;
  }

  /**
   * Implement this callback to submit form data
   */
  protected abstract setFormData(formData: FormData): void;

  override connectedCallback() {
    super.connectedCallback();
    this.containingForm = this.findFormElement();
    this.containingForm?.addEventListener('formdata', this.formDataListener);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.containingForm?.removeEventListener('formdata', this.formDataListener);
    this.containingForm = null;
  }

  override click() {
    if (this.formElement && !this.disabled) {
      this.formElement.focus();
      this.formElement.click();
    }
  }

  protected override firstUpdated() {
    super.firstUpdated();
    if (this.shadowRoot) {
      this.mdcRoot.addEventListener('change', (e) => {
        this.dispatchEvent(new Event('change', e));
      });
    }
  }
}
