/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';

import {isFocusable, mixinFocusable} from './focusable.js';

describe('mixinFocusable()', () => {
  // tslint:disable-next-line:enforce-name-casing MixinClassCase
  const FocusableLitElement = mixinFocusable(LitElement);
  @customElement('test-focusable')
  class TestFocusable extends FocusableLitElement {}

  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`<test-focusable></test-focusable>`);
    const element = root.querySelector('test-focusable') as TestFocusable;
    await env.waitForStability();
    return element;
  }

  it('isFocusable should be true by default', async () => {
    const element = await setupTest();
    expect(element[isFocusable]).withContext('isFocusable').toBeTrue();
  });

  it('should set tabindex="0" when isFocusable is true', async () => {
    const element = await setupTest();
    element[isFocusable] = true;
    expect(element.tabIndex).withContext('tabIndex').toBe(0);
    expect(element.getAttribute('tabindex'))
      .withContext('tabindex attribute')
      .toBe('0');
  });

  it('should set tabindex="-1" when isFocusable is false', async () => {
    const element = await setupTest();
    element[isFocusable] = false;
    expect(element.tabIndex).withContext('tabIndex').toBe(-1);
    expect(element.getAttribute('tabindex'))
      .withContext('tabindex attribute')
      .toBe('-1');
  });

  it('should re-render when tabIndex changes', async () => {
    const element = await setupTest();
    spyOn(element, 'requestUpdate').and.callThrough();
    element.tabIndex = 2;
    expect(element.requestUpdate).toHaveBeenCalled();
  });

  it('should not override user-set tabindex="0" when isFocusable is false', async () => {
    const element = await setupTest();
    element[isFocusable] = false;
    element.tabIndex = 0;
    expect(element[isFocusable]).withContext('isFocusable').toBeFalse();
    expect(element.tabIndex).withContext('tabIndex').toBe(0);
    expect(element.getAttribute('tabindex'))
      .withContext('tabindex attribute')
      .toBe('0');
  });

  it('should not override user-set tabindex="-1" when isFocusable is true', async () => {
    const element = await setupTest();
    element.tabIndex = -1;
    expect(element[isFocusable]).withContext('isFocusable').toBeTrue();
    expect(element.tabIndex).withContext('tabIndex').toBe(-1);
    expect(element.getAttribute('tabindex'))
      .withContext('tabindex attribute')
      .toBe('-1');
  });

  it('should restore default tabindex when user-set tabindex attribute is removed', async () => {
    const element = await setupTest();
    element.tabIndex = -1;
    element.removeAttribute('tabindex');
    expect(element.tabIndex).withContext('tabIndex').toBe(0);
    expect(element.getAttribute('tabindex'))
      .withContext('tabindex attribute')
      .toBe('0');
  });

  it('should not throw attribute hydration errors on construction', () => {
    expect(() => {
      // We do not need to assign a variable to test construction.
      // tslint:disable-next-line:no-unused-expression
      new TestFocusable();
    }).not.toThrow();
  });

  it('should not add tabindex until after the element is connected', async () => {
    const element = new TestFocusable();

    expect(element.hasAttribute('tabindex'))
      .withContext('has tabindex attribute synchronously after construction')
      .toBeFalse();

    await env.waitForStability();

    // To avoid attribute hydration errors, we wait until the element is
    // connected before we update the tabindex.
    expect(element.hasAttribute('tabindex'))
      .withContext('has tabindex attribute after task but before connected')
      .toBeFalse();

    env.render(html`${element}`);

    expect(element.isConnected).withContext('element.isConnected').toBeTrue();
    expect(element.hasAttribute('tabindex'))
      .withContext('has tabindex attribute after connected to dom')
      .toBeTrue();
  });
});
