/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {isServer, ReactiveElement} from 'lit';

import {internals, WithInternals} from './element-internals.js';

/**
 * A string indicating the form submission behavior of the element.
 *
 * - submit: The element submits the form. This is the default value if the
 * attribute is not specified, or if it is dynamically changed to an empty or
 * invalid value.
 * - reset: The element resets the form.
 * - button: The element does nothing.
 */
export type FormSubmitterType = 'button'|'submit'|'reset';

/**
 * An element that can submit or reset a `<form>`, similar to
 * `<button type="submit">`.
 */
export interface FormSubmitter extends ReactiveElement, WithInternals {
  /**
   * A string indicating the form submission behavior of the element.
   *
   * - submit: The element submits the form. This is the default value if the
   * attribute is not specified, or if it is dynamically changed to an empty or
   * invalid value.
   * - reset: The element resets the form.
   * - button: The element does nothing.
   */
  type: FormSubmitterType;
}

type FormSubmitterConstructor =
    (new () => FormSubmitter)|(abstract new () => FormSubmitter);

/**
 * Sets up an element's constructor to enable form submission. The element
 * instance should be form associated and have a `type` property.
 *
 * A click listener is added to each element instance. If the click is not
 * default prevented, it will submit the element's form, if any.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   static {
 *     setupFormSubmitter(MyElement);
 *   }
 *
 *   static formAssociated = true;
 *
 *   type: FormSubmitterType = 'submit';
 *
 *   [internals] = this.attachInternals();
 * }
 * ```
 *
 * @param ctor The form submitter element's constructor.
 */
export function setupFormSubmitter(ctor: FormSubmitterConstructor) {
  if (isServer) {
    return;
  }

  (ctor as unknown as typeof ReactiveElement).addInitializer(instance => {
    const submitter = instance as FormSubmitter;
    submitter.addEventListener('click', async event => {
      const {type, [internals]: {form}} = submitter;
      if (!form || type === 'button') {
        return;
      }

      // Wait a microtask for event bubbling to complete.
      await new Promise<void>(resolve => {
        resolve();
      });

      if (event.defaultPrevented) {
        return;
      }

      if (type === 'reset') {
        form.reset();
        return;
      }

      // form.requestSubmit(submitter) does not work with form associated custom
      // elements. This patches the dispatched submit event to add the correct
      // `submitter`.
      // See https://github.com/WICG/webcomponents/issues/814
      form.addEventListener('submit', submitEvent => {
        Object.defineProperty(submitEvent, 'submitter', {
          configurable: true,
          enumerable: true,
          get: () => submitter,
        });
      }, {capture: true, once: true});

      form.requestSubmit();
    });
  });
}
