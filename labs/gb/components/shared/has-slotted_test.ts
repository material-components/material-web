/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';
import {Environment} from '../../../../testing/environment.js';

import {hasSlotted} from './has-slotted.js';

describe('hasSlotted()', () => {
  const env = new Environment();
  let host: HTMLElement;
  let shadowRoot: ShadowRoot;
  let slot: HTMLSlotElement;

  beforeEach(() => {
    host = document.createElement('div');
    shadowRoot = host.attachShadow({mode: 'open'});
    render(html`<slot ${hasSlotted()} name="test"></slot>`, shadowRoot);
    slot = shadowRoot.querySelector('slot')!;
    env.render(html`${host}`);
  });

  it('throws an error if used on a non-<slot> element', () => {
    expect(() => {
      env.render(html`<div ${hasSlotted()}></div>`);
    }).toThrowError('hasSlotted() must be used on a <slot> element.');
  });

  it('does not add .has-slotted class when slot has no assigned nodes', async () => {
    expect(slot.classList)
      .withContext('slot classList')
      .not.toContain('has-slotted');
  });

  it('adds .has-slotted class when slot has assigned nodes', async () => {
    render(html`<span slot="test">Content</span>`, host);
    await env.waitForStability();

    expect(slot.classList)
      .withContext('slot classList')
      .toContain('has-slotted');
  });

  it('toggles .has-slotted class on slot content change', async () => {
    render(html`<span slot="test">Content</span>`, host);
    await env.waitForStability();

    expect(slot.classList)
      .withContext('slot classList')
      .toContain('has-slotted');

    host.firstElementChild?.remove();
    await env.waitForStability();

    expect(slot.classList)
      .withContext('slot classList')
      .not.toContain('has-slotted');
  });
});
