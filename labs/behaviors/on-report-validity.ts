/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, isServer} from 'lit';

import {ConstraintValidation} from './constraint-validation.js';
import {MixinBase, MixinReturn} from './mixin.js';

/**
 * A constraint validation element that has a callback for when the element
 * should report validity styles and error messages to the user.
 *
 * This is commonly used in text-field-like controls that display error styles
 * and error messages.
 */
export interface OnReportValidity extends ConstraintValidation {
  /**
   * A callback that is invoked when validity should be reported. Components
   * that can display their own error state can use this and update their
   * styles.
   *
   * If an invalid event is provided, the element is invalid. If `null`, the
   * element is valid.
   *
   * The invalid event's `preventDefault()` may be called to stop the platform
   * popup from displaying.
   *
   * @param invalidEvent The `invalid` event dispatched when an element is
   *     invalid, or `null` if the element is valid.
   */
  [onReportValidity](invalidEvent: Event | null): void;

  // `mixinOnReportValidity()` implements this optional method. If overriden,
  // call `super.formAssociatedCallback(form)`.
  // (inherit jsdoc from `FormAssociated`)
  formAssociatedCallback(form: HTMLFormElement | null): void;
}

/**
 * A symbol property used for a callback when validity has been reported.
 */
export const onReportValidity = Symbol('onReportValidity');

// Private symbol members, used to avoid name clashing.
const privateCleanupFormListeners = Symbol('privateCleanupFormListeners');
const privateDoNotReportInvalid = Symbol('privateDoNotReportInvalid');

/**
 * Mixes in a callback for constraint validation when validity should be
 * styled and reported to the user.
 *
 * This is commonly used in text-field-like controls that display error styles
 * and error messages.
 *
 * @example
 * ```ts
 * const baseClass = mixinOnReportValidity(
 *   mixinConstraintValidation(
 *     mixinFormAssociated(mixinElementInternals(LitElement)),
 *   ),
 * );
 *
 * class MyField extends baseClass {
 *   \@property({type: Boolean}) error = false;
 *   \@property() errorMessage = '';
 *
 *   [onReportValidity](invalidEvent: Event | null) {
 *     this.error = !!invalidEvent;
 *     this.errorMessage = this.validationMessage;
 *
 *     // Optionally prevent platform popup from displaying
 *     invalidEvent?.preventDefault();
 *   }
 * }
 * ```
 *
 * @param base The class to mix functionality into.
 * @return The provided class with `OnReportValidity` mixed in.
 */
export function mixinOnReportValidity<
  T extends MixinBase<LitElement & ConstraintValidation>,
>(base: T): MixinReturn<T, OnReportValidity> {
  abstract class OnReportValidityElement
    extends base
    implements OnReportValidity
  {
    /**
     * Used to clean up event listeners when a new form is associated.
     */
    [privateCleanupFormListeners] = new AbortController();

    /**
     * Used to determine if an invalid event should report validity. Invalid
     * events from `checkValidity()` do not trigger reporting.
     */
    [privateDoNotReportInvalid] = false;

    // Mixins must have a constructor with `...args: any[]`
    // tslint:disable-next-line:no-any
    constructor(...args: any[]) {
      super(...args);
      if (isServer) {
        return;
      }

      this.addEventListener(
        'invalid',
        (invalidEvent) => {
          // Listen for invalid events dispatched by a `<form>` when it tries to
          // submit and the element is invalid. We ignore events dispatched when
          // calling `checkValidity()` as well as untrusted events, since the
          // `reportValidity()` and `<form>`-dispatched events are always
          // trusted.
          if (this[privateDoNotReportInvalid] || !invalidEvent.isTrusted) {
            return;
          }

          this.addEventListener(
            'invalid',
            () => {
              // A normal bubbling phase event listener. By adding it here, we
              // ensure it's the last event listener that is called during the
              // bubbling phase.
              if (!invalidEvent.defaultPrevented) {
                this[onReportValidity](invalidEvent);
              }
            },
            {once: true},
          );
        },
        {
          // Listen during the capture phase, which will happen before the
          // bubbling phase. That way, we can add a final event listener that
          // will run after other event listeners, and we can check if it was
          // default prevented. This works because invalid does not bubble.
          capture: true,
        },
      );
    }

    override checkValidity() {
      this[privateDoNotReportInvalid] = true;
      const valid = super.checkValidity();
      this[privateDoNotReportInvalid] = false;
      return valid;
    }

    override reportValidity() {
      const valid = super.reportValidity();
      // Constructor's invalid listener will handle reporting invalid events.
      if (valid) {
        this[onReportValidity](null);
      }

      return valid;
    }

    [onReportValidity](invalidEvent: Event | null) {
      throw new Error('Implement [onReportValidity]');
    }

    override formAssociatedCallback(form: HTMLFormElement | null) {
      // can't use super.formAssociatedCallback?.() due to closure
      if (super.formAssociatedCallback) {
        super.formAssociatedCallback(form);
      }

      // Clean up previous submit listener
      this[privateCleanupFormListeners].abort();
      if (!form) {
        return;
      }

      this[privateCleanupFormListeners] = new AbortController();
      // If the element's form submits, then all controls are valid. This lets
      // the element remove its error styles that may have been set when
      // `reportValidity()` was called.
      form.addEventListener(
        'submit',
        () => {
          this[onReportValidity](null);
        },
        {
          signal: this[privateCleanupFormListeners].signal,
        },
      );

      // Inject a callback when `form.reportValidity()` is called and the form
      // is valid. There isn't an event that is dispatched to alert us (unlike
      // the 'invalid' event), and we need to remove error styles when
      // `form.reportValidity()` is called and returns true.
      let reportedInvalidEventFromForm = false;
      let formReportValidityCleanup = new AbortController();
      injectFormReportValidityHooks({
        form,
        cleanup: this[privateCleanupFormListeners].signal,
        beforeReportValidity: () => {
          reportedInvalidEventFromForm = false;
          this.addEventListener(
            'invalid',
            () => {
              reportedInvalidEventFromForm = true;
              // Constructor's invalid listener will handle reporting invalid
              // events.
            },
            {signal: formReportValidityCleanup.signal},
          );
        },
        afterReportValidity: () => {
          formReportValidityCleanup.abort();
          formReportValidityCleanup = new AbortController();
          if (reportedInvalidEventFromForm) {
            reportedInvalidEventFromForm = false;
            return;
          }

          // Report successful form validation if an invalid event wasn't
          // fired.
          this[onReportValidity](null);
        },
      });
    }
  }

  return OnReportValidityElement;
}

const FORM_REPORT_VALIDITY_HOOKS = new WeakMap<HTMLFormElement, EventTarget>();

function injectFormReportValidityHooks({
  form,
  beforeReportValidity,
  afterReportValidity,
  cleanup,
}: {
  form: HTMLFormElement;
  beforeReportValidity: () => void;
  afterReportValidity: () => void;
  cleanup: AbortSignal;
}) {
  if (!FORM_REPORT_VALIDITY_HOOKS.has(form)) {
    // Patch form.reportValidity() to add an event target that can be used to
    // react when the method is called.
    // We should only patch this method once, since multiple controls and other
    // forces may want to patch this method. We cannot reliably clean it up by
    // resetting the method to "superReportValidity", which may be a patched
    // function.
    // Instead, we never clean up the patch but add and clean up event listener
    // hooks once it's patched.
    const hooks = new EventTarget();
    const superReportValidity = form.reportValidity;
    form.reportValidity = function (this: HTMLFormElement) {
      hooks.dispatchEvent(new Event('before'));
      const valid = superReportValidity.call(this);
      hooks.dispatchEvent(new Event('after'));
      return valid;
    };

    FORM_REPORT_VALIDITY_HOOKS.set(form, hooks);
  }

  const hooks = FORM_REPORT_VALIDITY_HOOKS.get(form)!;
  hooks.addEventListener('before', beforeReportValidity, {signal: cleanup});
  hooks.addEventListener('after', afterReportValidity, {signal: cleanup});
}
