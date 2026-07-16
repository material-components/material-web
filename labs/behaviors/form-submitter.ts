/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {isServer, LitElement} from 'lit';
import {property} from 'lit/decorators.js';

import {
  afterDispatch,
  setupDispatchHooks,
} from '../../internal/events/dispatch-hooks.js';
import {internals, WithElementInternals} from './element-internals.js';
import {MixinBase, MixinReturn} from './mixin.js';

/**
 * A string indicating the form submission behavior of the element.
 *
 * - submit: The element submits the form. This is the default value if the
 * attribute is not specified, or if it is dynamically changed to an empty or
 * invalid value.
 * - reset: The element resets the form.
 * - button: The element does nothing.
 */
export type FormSubmitterType = 'button' | 'submit' | 'reset';

/**
 * An element that can submit or reset a `<form>`, similar to
 * `<button type="submit">`.
 */
export interface FormSubmitter {
  /**
   * A string indicating the form submission behavior of the element.
   *
   * - submit: The element submits the form. This is the default value if the
   * attribute is not specified, or if it is dynamically changed to an empty or
   * invalid value.
   * - reset: The element resets the form.
   * - button: The element does nothing.
   */
  type: string;

  /**
   * The HTML name to use in form submission. When combined with a `value`, the
   * submitting button's name/value will be added to the form.
   *
   * Names must reflect to a `name` attribute for form integration.
   */
  name: string;

  /**
   * The value of the button. When combined with a `name`, the submitting
   * button's name/value will be added to the form.
   */
  value: string;
}

/**
 * Mixes in form submitter behavior for a class.
 *
 * A click listener is added to each element instance. If the click is not
 * default prevented, it will submit the element's form, if any.
 *
 * @example
 * ```ts
 * const base = mixinFormSubmitter(mixinElementInternals(LitElement));
 * class MyButton extends base {
 *   static formAssociated = true;
 * }
 * ```
 *
 * @param base The class to mix functionality into.
 * @return The provided class with `FormSubmitter` mixed in.
 */
export function mixinFormSubmitter<
  T extends MixinBase<LitElement & WithElementInternals>,
>(base: T): MixinReturn<T, FormSubmitter> {
  abstract class FormSubmitterElement extends base implements FormSubmitter {
    @property() type = 'submit';
    @property({reflect: true}) value = '';

    // Name attribute must reflect synchronously for form integration.
    get name() {
      return this.getAttribute('name') ?? '';
    }
    set name(name: string) {
      this.setAttribute('name', name);
    }

    // Mixins must have a constructor with `...args: any[]`
    // tslint:disable-next-line:no-any
    constructor(...args: any[]) {
      super(...args);
      if (isServer) return;
      setupDispatchHooks(this, 'click');
      this.addEventListener('click', async (event: Event) => {
        const isReset = this.type === 'reset';
        const isSubmit = this.type === 'submit';
        const elementInternals = this[internals];
        const {form} = elementInternals;
        if (!form || !(isSubmit || isReset)) {
          return;
        }

        afterDispatch(event, () => {
          if (event.defaultPrevented) {
            return;
          }

          if (isReset) {
            form.reset();
            return;
          }

          // form.requestSubmit(submitter) does not work with form associated custom
          // elements. This patches the dispatched submit event to add the correct
          // `submitter`.
          // See https://github.com/WICG/webcomponents/issues/814
          form.addEventListener(
            'submit',
            (submitEvent: Event) => {
              Object.defineProperty(submitEvent, 'submitter', {
                configurable: true,
                enumerable: true,
                get: () => this,
              });
            },
            {capture: true, once: true},
          );

          elementInternals.setFormValue(this.value);
          form.requestSubmit();
        });
      });
    }
  }

  return FormSubmitterElement;
}
