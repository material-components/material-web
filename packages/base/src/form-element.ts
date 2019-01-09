/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { BaseElement } from './base-element';
export * from './base-element';

export interface RippleSurface {
  activate(): void;
  deactivate(): void;
}

export interface HTMLElementWithRipple extends HTMLElement {
  ripple?: RippleSurface;
}

export abstract class FormElement extends BaseElement {
  /**
   * Form-capable element in the component ShadowRoot.
   *
   * Define in your component with the `@query` decorator
   */
  protected abstract formElement: HTMLElement;

  createRenderRoot() {
    return this.attachShadow({ mode: 'open', delegatesFocus: true });
  }

  /**
   * Implement ripple getter for Ripple integration with mwc-formfield
   */
  readonly ripple?: RippleSurface;

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
}
