/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';

import {internals, mixinElementInternals} from './element-internals.js';

describe('mixinElementInternals()', () => {
  @customElement('test-element-internals')
  class TestElementInternals extends mixinElementInternals(LitElement) {}

  const env = new Environment();

  async function setupTest() {
    const root = env.render(
      html`<test-element-internals></test-element-internals>`,
    );
    const element = root.querySelector(
      'test-element-internals',
    ) as TestElementInternals;
    await env.waitForStability();
    return element;
  }

  it('should provide an `ElementInternals` instance', async () => {
    const element = await setupTest();
    expect(element[internals]).toBeInstanceOf(ElementInternals);
  });
});
