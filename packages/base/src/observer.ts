/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {PropertyValues} from 'lit-element/lib/updating-element';

export interface Observer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (value: any, old: any): void;
}

export const observer = (observer: Observer) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (proto: any, propName: PropertyKey) => {
      // if we haven't wrapped `updated` in this class, do so
      if (!proto.constructor._observers) {
        proto.constructor._observers = new Map<PropertyKey, Observer>();
        const userUpdated = proto.updated;
        proto.updated = function(changedProperties: PropertyValues) {
          userUpdated.call(this, changedProperties);
          changedProperties.forEach((v, k) => {
            const observer = this.constructor._observers.get(k);
            if (observer !== undefined) {
              observer.call(this, this[k], v);
            }
          });
        };
        // clone any existing observers (superclasses)
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
