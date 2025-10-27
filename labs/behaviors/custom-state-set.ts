/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';

import {internals, WithElementInternals} from './element-internals.js';
import {MixinBase, MixinReturn} from './mixin.js';

/**
 * A unique symbol used to check if an element's `CustomStateSet` has a state.
 *
 * Provides compatibility with legacy dashed identifier syntax (`:--state`) used
 * by the element-internals-polyfill for Chrome extension support.
 *
 * @example
 * ```ts
 * const baseClass = mixinCustomStateSet(mixinElementInternals(LitElement));
 *
 * class MyElement extends baseClass {
 *   get checked() {
 *     return this[hasState]('checked');
 *   }
 *   set checked(value: boolean) {
 *     this[toggleState]('checked', value);
 *   }
 * }
 * ```
 */
export const hasState = Symbol('hasState');

/**
 * A unique symbol used to add or delete a state from an element's
 * `CustomStateSet`.
 *
 * Provides compatibility with legacy dashed identifier syntax (`:--state`) used
 * by the element-internals-polyfill for Chrome extension support.
 *
 * @example
 * ```ts
 * const baseClass = mixinCustomStateSet(mixinElementInternals(LitElement));
 *
 * class MyElement extends baseClass {
 *   get checked() {
 *     return this[hasState]('checked');
 *   }
 *   set checked(value: boolean) {
 *     this[toggleState]('checked', value);
 *   }
 * }
 * ```
 */
export const toggleState = Symbol('toggleState');

/**
 * An instance with `[hasState]()` and `[toggleState]()` symbol functions that
 * provide compatibility with `CustomStateSet` legacy dashed identifier syntax,
 * used by the element-internals-polyfill and needed for Chrome extension
 * compatibility.
 */
export interface WithCustomStateSet {
  /**
   * Checks if the state is active, returning true if the element matches
   * `:state(customstate)`.
   *
   * @param customState the `CustomStateSet` state to check. Do not use the
   *     `--customstate` dashed identifier syntax.
   * @return true if the custom state is active, or false if not.
   */
  [hasState](customState: string): boolean;

  /**
   * Toggles the state to be active or inactive based on the provided value.
   * When active, the element matches `:state(customstate)`.
   *
   * @param customState the `CustomStateSet` state to check. Do not use the
   *     `--customstate` dashed identifier syntax.
   * @param isActive true to add the state, or false to delete it.
   */
  [toggleState](customState: string, isActive: boolean): void;
}

// Private symbols
const privateUseDashedIdentifier = Symbol('privateUseDashedIdentifier');
const privateGetStateIdentifier = Symbol('privateGetStateIdentifier');

/**
 * Mixes in compatibility functions for access to an element's `CustomStateSet`.
 *
 * Use this mixin's `[hasState]()` and `[toggleState]()` symbol functions for
 * compatibility with `CustomStateSet` legacy dashed identifier syntax.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet#compatibility_with_dashed-ident_syntax.
 *
 * The dashed identifier syntax is needed for element-internals-polyfill, a
 * requirement for Chome extension compatibility.
 *
 * @example
 * ```ts
 * const baseClass = mixinCustomStateSet(mixinElementInternals(LitElement));
 *
 * class MyElement extends baseClass {
 *   get checked() {
 *     return this[hasState]('checked');
 *   }
 *   set checked(value: boolean) {
 *     this[toggleState]('checked', value);
 *   }
 * }
 * ```
 *
 * @param base The class to mix functionality into.
 * @return The provided class with `[hasState]()` and `[toggleState]()`
 *     functions mixed in.
 */
export function mixinCustomStateSet<
  T extends MixinBase<LitElement & WithElementInternals>,
>(base: T): MixinReturn<T, WithCustomStateSet> {
  abstract class WithCustomStateSetElement
    extends base
    implements WithCustomStateSet
  {
    [hasState](state: string) {
      state = this[privateGetStateIdentifier](state);
      return this[internals].states.has(state);
    }

    [toggleState](state: string, isActive: boolean) {
      state = this[privateGetStateIdentifier](state);
      if (isActive) {
        this[internals].states.add(state);
      } else {
        this[internals].states.delete(state);
      }
    }

    [privateUseDashedIdentifier]: boolean | null = null;

    [privateGetStateIdentifier](state: string) {
      if (this[privateUseDashedIdentifier] === null) {
        // Check if `--state-string` needs to be used. See
        // https://developer.mozilla.org/en-US/docs/Web/API/CustomStateSet#compatibility_with_dashed-ident_syntax
        try {
          const testState = '_test';
          this[internals].states.add(testState);
          this[internals].states.delete(testState);
          this[privateUseDashedIdentifier] = false;
        } catch {
          this[privateUseDashedIdentifier] = true;
        }
      }

      return this[privateUseDashedIdentifier] ? `--${state}` : state;
    }
  }

  return WithCustomStateSetElement;
}
