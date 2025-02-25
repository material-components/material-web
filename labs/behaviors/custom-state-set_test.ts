/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import {hasState, mixinCustomStateSet, toggleState} from './custom-state-set.js';
import {mixinElementInternals} from './element-internals.js';

@customElement('test-custom-state-set')
class TestCustomStateSet extends mixinCustomStateSet(
  mixinElementInternals(LitElement),
) {}

for (const testWithPolyfill of [false, true]) {
  const describeSuffix = testWithPolyfill
    ? ' (with element-internals-polyfill)'
    : '';

  describe(`mixinCustomStateSet()${describeSuffix}`, () => {
    const nativeAttachInternals = HTMLElement.prototype.attachInternals;

    beforeAll(() => {
      if (testWithPolyfill) {
        // A more reliable test would use `forceElementInternalsPolyfill()` from
        // `element-internals-polyfill`, but our GitHub test build doesn't
        // support it since the polyfill changes global types.

        /* A simplified version of element-internal-polyfill CustomStateSet. */
        class PolyfilledCustomStateSet extends Set<string> {
          constructor(private readonly ref: HTMLElement) {
            super();
          }

          override add(state: string) {
            if (!/^--/.test(state) || typeof state !== 'string') {
              throw new DOMException(
                `Failed to execute 'add' on 'CustomStateSet': The specified value ${state} must start with '--'.`,
              );
            }
            const result = super.add(state);
            this.ref.toggleAttribute(`state${state}`, true);
            return result;
          }

          override clear() {
            for (const [entry] of this.entries()) {
              this.delete(entry);
            }
            super.clear();
          }

          override delete(state: string) {
            const result = super.delete(state);
            this.ref.toggleAttribute(`state${state}`, false);
            return result;
          }
        }

        HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
          const internals = nativeAttachInternals.call(this);
          Object.defineProperty(internals, 'states', {
            enumerable: true,
            configurable: true,
            value: new PolyfilledCustomStateSet(this),
          });

          return internals;
        };
      }
    });

    afterAll(() => {
      if (testWithPolyfill) {
        HTMLElement.prototype.attachInternals = nativeAttachInternals;
      }
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
