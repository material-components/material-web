/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {ObserverRecord} from './observer.js';
import {ObserverFoundation} from './observer-foundation.js';

describe('ObserverFoundation', () => {
  class TestObserverFoundation extends ObserverFoundation<{}> {
    override observe<T extends object>(
        target: T, observers: ObserverRecord<T, this>) {
      return super.observe(target, observers);
    }
  }

  let instance!: TestObserverFoundation;
  const initialState = {stringProp: 'value', numberProp: 0};
  let state = {...initialState};
  const stringObserver = jasmine.createSpy('stringObserver');
  const numberObserver = jasmine.createSpy('numberObserver');

  beforeEach(() => {
    instance = new TestObserverFoundation({});
    state = {...initialState};
    stringObserver.and.stub();
    stringObserver.calls.reset();
    numberObserver.and.stub();
    numberObserver.calls.reset();
  });

  it('#observe() should listen to multiple properties', () => {
    instance.observe(state, {
      stringProp: stringObserver,
      numberProp: numberObserver,
    });

    state.stringProp = 'newValue';
    state.numberProp = 1;
    expect(stringObserver)
        .toHaveBeenCalledOnceWith(state.stringProp, initialState.stringProp);
    expect(numberObserver)
        .toHaveBeenCalledOnceWith(state.numberProp, initialState.numberProp);
  });

  it('#observe() should call Observers with instance as `this`', () => {
    let observerThis: unknown;
    stringObserver.and.callFake(function(this: unknown) {
      observerThis = this;
    });

    instance.observe(state, {
      stringProp: stringObserver,
    });

    state.stringProp = 'newValue';
    expect(observerThis)
        .withContext('observer `this` should be instance')
        .toBe(instance);
  });

  it('#observe() cleanup function stops Observers', () => {
    const unobserve = instance.observe(
        state, {stringProp: stringObserver, numberProp: numberObserver});

    state.stringProp = 'newValue';
    state.numberProp = 1;
    stringObserver.calls.reset();
    numberObserver.calls.reset();
    unobserve();
    state.stringProp = 'anotherValue';
    state.numberProp = 2;
    expect(stringObserver).not.toHaveBeenCalled();
    expect(numberObserver).not.toHaveBeenCalled();
  });

  it('#observe() cleanup function does not stop Observers from other invocations',
     () => {
       const otherStringObserver = jasmine.createSpy('otherStringObserver');
       const unobserve = instance.observe(
           state, {stringProp: stringObserver, numberProp: numberObserver});

       instance.observe(state, {stringProp: otherStringObserver});

       state.stringProp = 'newValue';
       state.numberProp = 1;
       unobserve();
       state.stringProp = 'anotherValue';
       state.numberProp = 2;
       expect(otherStringObserver).toHaveBeenCalledTimes(2);
     });
});
