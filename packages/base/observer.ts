/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
// tslint:disable:no-any

import {PropertyValues, UpdatingElement} from 'lit-element/lib/updating-element';

/**
 * Observer function type.
 */
export interface Observer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (value: any, old: any): void;
}

type UpdatingElementClass = typeof UpdatingElement;
interface UpdatingElementClassWithObservers extends UpdatingElementClass {
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
      if (!(proto.constructor as UpdatingElementClassWithObservers)
               ._observers) {
        proto.constructor._observers = new Map<PropertyKey, Observer>();
        const userUpdated = proto.updated;
        proto.updated = function(
            this: UpdatingElement, changedProperties: PropertyValues) {
          userUpdated.call(this, changedProperties);
          changedProperties.forEach((v, k) => {
            const observers =
                (this.constructor as UpdatingElementClassWithObservers)
                    ._observers;
            const observer = observers.get(k);
            if (observer !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              observer.call(this, (this as any)[k], v);
            }
          });
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
