import type {ReactiveElement} from 'lit';
import {effect} from '@preact/signals-core';
export {signal} from '@preact/signals-core';

type ReactiveElementConstructor = new (...args: any[]) => ReactiveElement;

export function SignalElement<T extends ReactiveElementConstructor>(
    Base: T
): T {
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