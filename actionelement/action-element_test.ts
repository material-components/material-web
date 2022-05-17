/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {Environment} from '@material/web/testing/environment';
import {html} from 'lit';
import {customElement, property} from 'lit/decorators';

import {ActionElement} from './action-element';

declare global {
  interface HTMLElementTagNameMap {
    'test-action-element': TestActionElement;
  }
}

@customElement('test-action-element')
class TestActionElement extends ActionElement {
  @property({type: Boolean}) disabled = false;
}

describe('Action Element', () => {
  const env = new Environment();
  let el!: TestActionElement;

  beforeEach(async () => {
    const root = env.render(html`<test-action-element></test-action-element>`);
    el = root.querySelector('test-action-element')!;
    await env.waitForStability();
  });

  it('fires `pressbegin` event', () => {
    const pressBeginSpy = jasmine.createSpy('pressBeginHandler');
    el.addEventListener('pressbegin', pressBeginSpy);

    el.beginPress({positionEvent: new CustomEvent('click')});

    expect(pressBeginSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
  });

  it('fires `pressbegin` event with detail', () => {
    const pressBeginSpy = jasmine.createSpy('pressBeginHandler');
    el.addEventListener('pressbegin', pressBeginSpy);

    el.beginPress({positionEvent: new CustomEvent('click')});

    expect(pressBeginSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: {positionEvent: jasmine.anything()},
    }));
  });

  it('fires `pressend` event', () => {
    const pressEndSpy = jasmine.createSpy('pressend');
    el.addEventListener('pressend', pressEndSpy);

    el.endPress({cancelled: false});

    expect(pressEndSpy).toHaveBeenCalledWith(jasmine.any(CustomEvent));
  });

  it('fires `pressend` event with detail', () => {
    const pressEndSpy = jasmine.createSpy('pressend');
    el.addEventListener('pressend', pressEndSpy);

    el.endPress({cancelled: false});

    expect(pressEndSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: {cancelled: false},
    }));
  });

  it('fires `pressend` event with {cancelled: true}', () => {
    const pressEndSpy = jasmine.createSpy('pressend');
    el.addEventListener('pressend', pressEndSpy);

    el.endPress({cancelled: true});

    expect(pressEndSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: {cancelled: true}
    }));
  });
});
