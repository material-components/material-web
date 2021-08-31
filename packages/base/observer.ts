/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
// tslint:disable:no-any

import {PropertyValues, ReactiveElement} from '@lit/reactive-element';

/**
 * Observer function type.
 */
export interface Observer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (value: any, old: any): void;
}

type ReactiveElementClass = typeof ReactiveElement;
interface ReactiveElementClassWithObservers extends ReactiveElementClass {
  // tslint:disable-next-line:enforce-name-casing
  _observers: Map<PropertyKey, Observer>;
}

/**
 * Specifies an observer callback that is run when the decorated property
 * changes. The observer receives the current and old value as arguments.
 */
export const observer = (observer: Observer) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (proto: any, propName: PropertyKey) => {
      // if we haven't wrapped `updated` in this class, do so
      if (!(proto.constructor as ReactiveElementClassWithObservers)
               ._observers) {
        proto.constructor._observers = new Map<PropertyKey, Observer>();
        const userUpdated = proto.updated;
        proto.updated = function(
            this: ReactiveElement, changedProperties: PropertyValues) {
          userUpdated.call(this, changedProperties);
          const changedPropNames = changedProperties.keys();
          for (const changedProp of changedPropNames) {
            const propertyValue = changedProperties.get(changedProp);
            const observers =
                (this.constructor as ReactiveElementClassWithObservers)
                    ._observers;
            const observer = observers.get(changedProp);
            if (observer !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              observer.call(this, (this as any)[changedProp], propertyValue);
            }
          }
        };
        // clone any existing observers (superclasses)
        // eslint-disable-next-line no-prototype-builtins
      } else if (!proto.constructor.hasOwnProperty('_observers')) {
        const observers = proto.constructor._observers;
        proto.constructor._observers = new Map();
        observers.forEach(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (v: any, k: PropertyKey) => proto.constructor._observers.set(k, v));
      }
      // set this method
      proto.constructor._observers.set(propName, observer);
    };
