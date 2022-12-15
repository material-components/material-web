/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * FormAssociatedElement interface
 */
export interface FormAssociatedElement extends HTMLElement {}

declare var FormAssociatedElement: {
  new (): FormAssociatedElement; prototype: FormAssociatedElement;
  readonly formAssociated?: boolean;
};

/**
 * Returns true if the element is a form associated custom element (FACE).
 */
export function isFormAssociated(element: FormAssociatedElement) {
  return (element.constructor as typeof FormAssociatedElement).formAssociated;
}
