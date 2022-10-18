/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FunctionKeys} from '../types/keys.js';

/**
 * Binds a class's method to its instance.
 *
 * @example
 * class MyClass {
 *   \@bound
 *   foo() { return this; }
 * }
 *
 * const instance = new MyClass();
 * const reference = instance.foo;
 * foo(); // MyClass
 *
 * @category Decorator
 * @ExportDecoratedItems
 */
export function bound<V extends Function>(
    target: object, propertyKey: string|symbol,
    methodDescriptor: TypedPropertyDescriptor<V>): TypedPropertyDescriptor<V>;
/**
 * Binds a class's function property to its instance.
 *
 * @example
 * class MyClass {
 *   \@bound
 *   foo = function(this: MyClass) { return this; }
 * }
 *
 * const instance = new MyClass();
 * const reference = instance.foo;
 * foo(); // MyClass
 *
 * @category Decorator
 * @ExportDecoratedItems
 */
export function bound<T extends object>(
    target: T, propertyKey: FunctionKeys<T>): any;
export function
bound<T extends object, K extends FunctionKeys<T>, V extends T[K]&Function>(
    target: T, propertyKey: K, methodDescriptor?: TypedPropertyDescriptor<V>):
    TypedPropertyDescriptor<V> {
  const descriptor: TypedPropertyDescriptor<V> = methodDescriptor || {
    configurable: true,
    enumerable: true,
    writable: true,
  };

  const memoizedBoundValues = new WeakMap<object, V>();
  let get: TypedPropertyDescriptor<V>['get']|undefined;
  let set: TypedPropertyDescriptor<V>['set']|undefined;

  if (descriptor.get || descriptor.writable) {
    get = function(this: T): V {
      const self = this as T;  // Needed for closure conformance
      if (descriptor.get) {
        // Separate variables needed for closure conformance
        const getter = descriptor.get;
        const value = getter.call(self);
        return value.bind(self);
      }

      if (!memoizedBoundValues.has(self)) {
        const bound =
            (descriptor.value || self[propertyKey] as V)?.bind(self) as V;
        memoizedBoundValues.set(self, bound);
        return bound;
      }

      return memoizedBoundValues.get(self)!;
    };
  }

  if (descriptor.set || descriptor.writable) {
    set = function(this: T, value: V) {
      const self = this as T;  // Needed for closure conformance
      value = value.bind(self);
      if (descriptor.set) {
        descriptor.set.call(self, value);
      }

      memoizedBoundValues.set(self, value);
    };
  }

  return {
    get,
    set,
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
  };
}
