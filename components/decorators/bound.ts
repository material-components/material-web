/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {FunctionKeys} from '../types/keys';

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
export function bound<T extends object, K extends keyof T, V extends Function>(
    target: T, propertyKey: K,
    methodDescriptor?: TypedPropertyDescriptor<V>): TypedPropertyDescriptor<V> {
  const descriptor = methodDescriptor || {
    configurable: true,
    enumerable: true,
    writable: true,
  };

  const memoizedBoundValues = new WeakMap<object, V>();
  let get: TypedPropertyDescriptor<V>['get']|undefined;
  let set: TypedPropertyDescriptor<V>['set']|undefined;

  if (descriptor.get || descriptor.writable) {
    get = function(this: T) {
      if (descriptor.get) {
        return descriptor.get.call(this).bind(this);
      }

      if (!memoizedBoundValues.has(this)) {
        const bound =
            (descriptor.value || this[propertyKey] as unknown as V)?.bind(this);
        memoizedBoundValues.set(this, bound);
        return bound;
      }

      return memoizedBoundValues.get(this);
    };
  }

  if (descriptor.set || descriptor.writable) {
    set = function(this: T, value: V) {
      value = value.bind(this);
      if (descriptor.set) {
        descriptor.set.call(this, value);
      }

      memoizedBoundValues.set(this, value);
    };
  }

  return {
    get,
    set,
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
  };
}
