/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

/**
 * SpyObj with "and" for chaining a group of spies.
 */
export type SpyGroup<T> = jasmine.SpyObj<T>&{
  and: SpyGroupAnd<T>;
};

/**
 * SpyAnd for group of multiple spies.
 */
export interface SpyGroupAnd<T> {
  callThrough(): jasmine.SpyObj<T>;
  stub(): jasmine.SpyObj<T>;
}

/**
 * A more versatile `spyOnAllFunctions()` that allows chaining `callThrough()`
 * and `stub()` for all function spies.
 *
 * Spies on all functions, including those from the prototype chain (useful for
 * class instance objects).
 *
 * @param obj The object to spy on all functions.
 * @return The spied object.
 */
export function spyOnAllFunctions<T extends object>(obj: T) {
  const functionKeys = new Set<keyof T>();
  let target: object|null = obj;
  while (target) {
    const keys =
        Object.getOwnPropertyNames(target) as Array<keyof typeof target>;
    for (const key of keys) {
      if (target.hasOwnProperty(key) && typeof target[key] === 'function') {
        functionKeys.add(key);
      }
    }
    target = Object.getPrototypeOf(target);
  }
  for (const key of functionKeys) {
    spyOn(obj, key);
  }

  const spyObj = obj as SpyGroup<T>;
  spyObj.and = {
    callThrough() {
      for (const key of functionKeys) {
        (spyObj[key] as jasmine.Spy).and.callThrough();
      }
      return spyObj;
    },
    stub() {
      for (const key of functionKeys) {
        (spyObj[key] as jasmine.Spy).and.stub();
      }
      return spyObj;
    },
  };

  return spyObj;
}
