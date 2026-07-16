/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import {hasState, mixinCustomStateSet, toggleState} from './custom-state-set.js';
import {internals, mixinElementInternals} from './element-internals.js';

// A more reliable test would use `forceElementInternalsPolyfill()` from
// `element-internals-polyfill`, but our GitHub test build doesn't
// support it since the polyfill changes global types.

/* A simplified version of element-internals-polyfill CustomStateSet. */
class PolyfilledCustomStateSet {
  private readonly internalSet = new Set<string>();

  constructor(private readonly ref: HTMLElement) {}

  has(state: string): boolean {
    return this.internalSet.has(state);
  }

  add(state: string): this {
    if (!/^--/.test(state) || typeof state !== 'string') {
      throw new DOMException(
        `Failed to execute 'add' on 'CustomStateSet': The specified value ${state} must start with '--'.`,
      );
    }
    this.internalSet.add(state);
    this.ref.toggleAttribute(`state${state}`, true);
    return this;
  }

  delete(state: string): boolean {
    const result = this.internalSet.delete(state);
    this.ref.toggleAttribute(`state${state}`, false);
    return result;
  }
}

@customElement('test-custom-state-set')
class TestCustomStateSet extends mixinCustomStateSet(
  mixinElementInternals(LitElement),
) {
  static testWithPolyfill = false;

  constructor() {
    super();
    if (TestCustomStateSet.testWithPolyfill) {
      Object.defineProperty(this[internals], 'states', {
        enumerable: true,
        configurable: true,
        value: new PolyfilledCustomStateSet(this),
      });
    }
  }
}

for (const testWithPolyfill of [false, true]) {
  const describeSuffix = testWithPolyfill
    ? ' (with element-internals-polyfill)'
    : '';

  describe(`mixinCustomStateSet()${describeSuffix}`, () => {
    beforeAll(() => {
      TestCustomStateSet.testWithPolyfill = testWithPolyfill;
    });

    describe('[hasState]()', () => {
      it('returns false when the state is not active', () => {
        // Arrange
        const element = new TestCustomStateSet();

        // Assert
        expect(element[hasState]('foo'))
          .withContext("[hasState]('foo')")
          .toBeFalse();
      });

      it('returns true when the state is active', () => {
        // Arrange
        const element = new TestCustomStateSet();

        // Act
        element[toggleState]('foo', true);

        // Assert
        expect(element[hasState]('foo'))
          .withContext("[hasState]('foo')")
          .toBeTrue();
      });

      it('returns false when the state is deactivated', () => {
        // Arrange
        const element = new TestCustomStateSet();
        element[toggleState]('foo', true);

        // Act
        element[toggleState]('foo', false);

        // Assert
        expect(element[hasState]('foo'))
          .withContext("[hasState]('foo')")
          .toBeFalse();
      });
    });

    describe('[toggleState]()', () => {
      const fooStateSelector = testWithPolyfill
        ? `[state--foo]`
        : ':state(foo)';

      it(`matches '${fooStateSelector}' when the state is active`, () => {
        // Arrange
        const element = new TestCustomStateSet();

        // Act
        element[toggleState]('foo', true);

        // Assert
        expect(element.matches(fooStateSelector))
          .withContext(`element.matches('${fooStateSelector}')`)
          .toBeTrue();
      });

      it(`does not match '${fooStateSelector}' when the state is deactivated`, () => {
        // Arrange
        const element = new TestCustomStateSet();
        element[toggleState]('foo', true);

        // Act
        element[toggleState]('foo', false);

        // Assert
        expect(element.matches(fooStateSelector))
          .withContext(`element.matches('${fooStateSelector}')`)
          .toBeFalse();
      });

      it(`does not match '${fooStateSelector}' by default`, () => {
        // Arrange
        const element = new TestCustomStateSet();

        // Assert
        expect(element.matches(fooStateSelector))
          .withContext(`element.matches('${fooStateSelector}')`)
          .toBeFalse();
      });
    });
  });
}
