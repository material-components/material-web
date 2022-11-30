/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {observeProperty, setObserversEnabled} from './observer.js';

describe('observeProperty()', () => {
  it('should call Observer when property value changes', () => {
    const state = {foo: 'value'};
    const observer = jasmine.createSpy('observer');
    observeProperty(state, 'foo', observer);
    // observer should not be called before property changes
    expect(observer).not.toHaveBeenCalled();
    state.foo = 'newValue';
    expect(observer).toHaveBeenCalledOnceWith('newValue', 'value');
    observer.calls.reset();
    state.foo = 'newValue';
    // observer should not be called if property is set to a value that
    // does not change
    expect(observer).not.toHaveBeenCalled();
  });

  it('should stop observing when returned function is called', () => {
    const state = {foo: 'value'};
    const observer = jasmine.createSpy('observer');
    const unobserve = observeProperty(state, 'foo', observer);
    unobserve();
    state.foo = 'newValue';
    // observer should not be called after cleaning up
    expect(observer).not.toHaveBeenCalled();
  });

  it('cleanup function does not stop other observers', () => {
    const state = {foo: 'value', bar: 1};
    const observer = jasmine.createSpy('observer');
    const otherObserver = jasmine.createSpy('otherObserver');
    const unobserve = observeProperty(state, 'foo', observer);
    observeProperty(state, 'bar', otherObserver);
    unobserve();
    state.bar = 2;
    // other observer should continue to work
    expect(otherObserver).toHaveBeenCalledOnceWith(2, 1);
  });

  it('should handle multiple Observers on the same property', () => {
    const state = {foo: 'value'};
    const observerOne = jasmine.createSpy('observerOne');
    const observerTwo = jasmine.createSpy('observerTwo');
    const unobserveOne = observeProperty(state, 'foo', observerOne);
    observeProperty(state, 'foo', observerTwo);
    state.foo = 'newValue';
    expect(observerOne).toHaveBeenCalledOnceWith('newValue', 'value');
    expect(observerTwo).toHaveBeenCalledOnceWith('newValue', 'value');
    unobserveOne();
    state.foo = 'anotherValue';
    // First observer should stop listening
    expect(observerOne).toHaveBeenCalledTimes(1);
    // Second observer should continue listening
    expect(observerTwo).toHaveBeenCalledTimes(2);
    expect(observerTwo).toHaveBeenCalledWith('anotherValue', 'newValue');
  });

  it('should observe superclass properties', () => {
    const superClassGetter = jasmine.createSpy('superClassGetter');
    const superClassSetter = jasmine.createSpy('superClassSetter');
    class SuperClass {
      privateProp = false;
      get prop() {
        superClassGetter();
        return this.privateProp;
      }
      set prop(prop: boolean) {
        this.privateProp = prop;
        superClassSetter();
      }
    }

    class SubClass extends SuperClass {}

    const state = new SubClass();
    const observer = jasmine.createSpy('observer');
    observeProperty(state, 'prop', observer);
    state.prop = true;
    expect(observer).toHaveBeenCalledOnceWith(true, false);
    // SuperClass getter/setter functionality should be preserved
    expect(superClassSetter).toHaveBeenCalledTimes(1);
    superClassGetter.calls.reset();
    expect(state.prop).toBe(true);
    expect(superClassGetter).toHaveBeenCalledTimes(1);
  });

  it('should preserve `this` context in getters/setters', () => {
    const getter = jasmine.createSpy('getter');
    const setter = jasmine.createSpy('setter');
    class TargetClass {
      privateProp = false;
      get prop() {
        getter(this);
        return this.privateProp;
      }
      set prop(prop: boolean) {
        this.privateProp = prop;
        setter(this);
      }
    }

    const state = new TargetClass();
    observeProperty(state, 'prop', jasmine.createSpy('observer'));
    state.prop = true;
    getter.calls.reset();
    expect(state.prop).toBe(true);
    expect(getter)
        .withContext('`this` in getter should be the instance')
        .toHaveBeenCalledOnceWith(state);
    expect(setter)
        .withContext('`this` in setter should be the instance')
        .toHaveBeenCalledOnceWith(state);
  });
});

describe('setObserversEnabled()', () => {
  it('should disable or enable all observers for a target', () => {
    const state = {string: 'value', number: 0};
    const stringObserver = jasmine.createSpy('stringObserver');
    const numberObserver = jasmine.createSpy('numberObserver');
    observeProperty(state, 'string', stringObserver);
    observeProperty(state, 'number', numberObserver);
    state.string = 'newValue';
    state.number = 1;
    stringObserver.calls.reset();
    numberObserver.calls.reset();
    // Test disabled
    setObserversEnabled(state, false);
    state.string = 'anotherValue';
    state.number = 2;
    expect(stringObserver).not.toHaveBeenCalled();
    expect(numberObserver).not.toHaveBeenCalled();
    // Test disabled
    setObserversEnabled(state, true);
    state.string = 'thirdValue';
    state.number = 3;
    expect(stringObserver)
        .toHaveBeenCalledOnceWith('thirdValue', 'anotherValue');
    expect(numberObserver).toHaveBeenCalledOnceWith(3, 2);
  });
});
