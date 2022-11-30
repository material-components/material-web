/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {bound} from '../bound.js';

describe('@bound', () => {
  class MyClass {
    @bound
    property = function(this: unknown) {
      return this as MyClass;
    };

    propertyGetAndSetValue = function(this: unknown) {
      return this as MyClass;
    };
    @bound
    get propertyGetAndSet() {
      return this.propertyGetAndSetValue;
    }
    set propertyGetAndSet(value: () => MyClass) {
      this.propertyGetAndSetValue = value;
    }

    @bound
    get propertyGetOnly() {
      return function(this: unknown) {
        return this as MyClass;
      };
    }

    @bound
    set propertySetOnly(value: () => MyClass) {
      this.propertySetOnlyValue = value;
    }

    propertySetOnlyValue: () => MyClass = () => this;

    @bound
    method() {
      return this;
    }
  }


  let instanceOne: MyClass;
  let instanceTwo: MyClass;

  beforeEach(() => {
    instanceOne = new MyClass();
    instanceTwo = new MyClass();
  });

  it('should bind methods', () => {
    const instanceOneFn = instanceOne.method;
    const instanceTwoFn = instanceTwo.method;
    expect(instanceOneFn()).toBe(instanceOne);
    expect(instanceTwoFn()).toBe(instanceTwo);
  });

  it('should bind properties', () => {
    const instanceOneFn = instanceOne.property;
    const instanceTwoFn = instanceTwo.property;
    expect(instanceOneFn()).toBe(instanceOne);
    expect(instanceTwoFn()).toBe(instanceTwo);
  });

  it('should bind properties with getter and setter', () => {
    let instanceOneFn = instanceOne.propertyGetAndSet;
    let instanceTwoFn = instanceTwo.propertyGetAndSet;
    expect(instanceOneFn()).toBe(instanceOne);
    expect(instanceTwoFn()).toBe(instanceTwo);

    function newValue(this: MyClass) {
      return this;
    }

    instanceOne.propertyGetAndSet = newValue;
    instanceTwo.propertyGetAndSet = newValue;
    instanceOneFn = instanceOne.propertyGetAndSet;
    instanceTwoFn = instanceTwo.propertyGetAndSet;
    expect(instanceOneFn()).toBe(instanceOne);
    expect(instanceTwoFn()).toBe(instanceTwo);
  });

  it('should bind properties with getter only', () => {
    const instanceOneFn = instanceOne.propertyGetOnly;
    const instanceTwoFn = instanceTwo.propertyGetOnly;
    expect(instanceOneFn()).toBe(instanceOne);
    expect(instanceTwoFn()).toBe(instanceTwo);
  });

  it('should bind properties with setter only', () => {
    function newValue(this: MyClass) {
      return this;
    }

    instanceOne.propertySetOnly = newValue;
    instanceTwo.propertySetOnly = newValue;
    const instanceOneFn = instanceOne.propertySetOnlyValue;
    const instanceTwoFn = instanceTwo.propertySetOnlyValue;
    expect(instanceOneFn()).toBe(instanceOne);
    expect(instanceTwoFn()).toBe(instanceTwo);
  });
});
