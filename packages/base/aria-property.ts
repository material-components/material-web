/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
// tslint:disable:no-any
// eslint-disable @typescript-eslint/no-explicit-any

import {PropertyDeclaration, ReactiveElement} from '@lit/reactive-element';

/**
 * A value for the `aria-haspopup` ARIA attribute.
 */
export type AriaHasPopup =
    'false'|'true'|'menu'|'listbox'|'tree'|'grid'|'dialog';

/**
 * Expose protected statics on ReactiveElement
 */
interface ReactiveElementInternals {
  getPropertyDescriptor(name: PropertyKey, key: string): PropertyDescriptor;
  getPropertyOptions(name: PropertyKey): PropertyDeclaration;
}

/**
 * TypeScript version of the decorator
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
 */
function tsDecorator(
    prototype: {}, name: string, descriptor?: PropertyDescriptor) {
  const constructor =
      (prototype.constructor as unknown as ReactiveElementInternals);
  if (!descriptor) {
    /**
     * lit-element uses internal properties with two leading underscores to
     * provide storage for accessors
     */
    const litInternalPropertyKey = `__${name}`;
    descriptor =
        constructor.getPropertyDescriptor(name, litInternalPropertyKey);
    if (!descriptor) {
      throw new Error('@ariaProperty must be used after a @property decorator');
    }
  }

  // descriptor must exist at this point, reassign so typescript understands
  const propDescriptor = descriptor;
  let attribute = '';

  if (!propDescriptor.set) {
    throw new Error(`@ariaProperty requires a setter for ${name}`);
  }

  const wrappedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true,
    set(this: ReactiveElement, value: unknown) {
      if (attribute === '') {
        const options = constructor.getPropertyOptions(name);
        // the attribute will be a string at runtime
        attribute = (options.attribute as string);
      }
      if (this.hasAttribute(attribute)) {
        this.removeAttribute(attribute);
      }
      propDescriptor.set!.call(this, value);
    }
  };

  if (propDescriptor.get) {
    wrappedDescriptor.get = function(this: ReactiveElement) {
      return propDescriptor.get!.call(this);
    };
  }

  return wrappedDescriptor;
}

/**
 * A property decorator proxies an aria attribute to an internal node
 *
 * This decorator is only intended for use with ARIA attributes, such as `role`
 * and `aria-label` due to screenreader needs.
 *
 * Upon first render, `@ariaProperty` will remove the attribute from the host
 * element to prevent screenreaders from reading the host instead of the
 * internal node.
 *
 * This decorator should only be used for non-Symbol public fields decorated
 * with `@property`, or on a setter with an optional getter.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @ariaProperty
 *   @property({ type: String, attribute: 'aria-label' })
 *   ariaLabel!: string;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
export function ariaProperty(
    protoOrDescriptor: {}, name?: string,
    descriptor?: PropertyDescriptor): any {
  if (name !== undefined) {
    return tsDecorator(protoOrDescriptor, name, descriptor);
  } else {
    throw new Error('@ariaProperty only supports TypeScript Decorators');
  }
}
