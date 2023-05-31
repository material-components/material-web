/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {effect} from '@preact/signals-core';
import type {ReactiveElement} from 'lit';

export {signal} from '@preact/signals-core';

// tslint:disable-next-line:no-any We do not know the types of constructor
// params that are going to be passed into any child extending SignalElement
type ReactiveElementConstructor = new (...args: any[]) => ReactiveElement;

/**
 * A mixin that hooks Preact signal changes to ReactiveElement.
 *
 * @param Base The class to mix-in and listen to Preact signal changes.
 */
export function SignalElement<T extends ReactiveElementConstructor>(Base: T):
    T {
  return class SignalElement extends Base {
    private _disposeEffect?: () => void;

    performUpdate() {
      if (!this.isUpdatePending) {
        return;
      }
      this._disposeEffect?.();
      this._disposeEffect = effect(() => {
        this.isUpdatePending = true;
        super.performUpdate();
      });
    }
  };
}