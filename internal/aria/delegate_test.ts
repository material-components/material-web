/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, nothing} from 'lit';
import {customElement, queryAsync} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';

import {requestUpdateOnAriaChange} from './delegate.js';

declare global {
  interface HTMLElementTagNameMap {
    'test-aria-delegate': AriaDelegateElement;
  }
}

@customElement('test-aria-delegate')
class AriaDelegateElement extends LitElement {
  static {
    requestUpdateOnAriaChange(AriaDelegateElement);
  }

  @queryAsync('button') readonly button!: Promise<HTMLButtonElement | null>;

  protected override render() {
    return html`<button aria-label=${this.ariaLabel || nothing}>Label</button>`;
  }
}

describe('aria', () => {
  const env = new Environment();

  async function setupTest({ariaLabel}: {ariaLabel?: string} = {}) {
    const root = env.render(html`
      <test-aria-delegate
        aria-label=${ariaLabel || nothing}></test-aria-delegate>
    `);

    const host = root.querySelector('test-aria-delegate');
    if (!host) {
      throw new Error('Could not query rendered <test-aria-delegate>');
    }

    await host.updateComplete;
    const child = await host.button;
    if (!child) {
      throw new Error('Could not query rendered <button>');
    }

    return {host, child};
  }

  describe('requestUpdateOnAriaChange()', () => {
    it('should add role="presentation" to the host', async () => {
      const {host} = await setupTest();

      expect(host.getAttribute('role'))
        .withContext('host role')
        .toEqual('presentation');
    });

    it('should not change or remove host aria attributes', async () => {
      const ariaLabel = 'Descriptive label';
      const {host} = await setupTest({ariaLabel});

      expect(host.getAttribute('aria-label'))
        .withContext('host aria-label')
        .toEqual(ariaLabel);
    });

    it('should delegate aria attributes to child element', async () => {
      const ariaLabel = 'Descriptive label';
      const {child} = await setupTest({ariaLabel});

      expect(child.getAttribute('aria-label'))
        .withContext('child aria-label')
        .toEqual(ariaLabel);
    });

    it('should update delegated aria attributes when host attribute changes', async () => {
      const {host, child} = await setupTest({ariaLabel: 'First aria label'});

      host.setAttribute('aria-label', 'Second aria label');
      await env.waitForStability();
      expect(child.getAttribute('aria-label'))
        .withContext('child aria-label')
        .toEqual('Second aria label');
    });

    it('should remove delegated aria attributes when host attribute is removed', async () => {
      const {host, child} = await setupTest({ariaLabel: 'First aria label'});

      host.removeAttribute('aria-label');
      await env.waitForStability();
      expect(child.hasAttribute('aria-label'))
        .withContext('child has aria-label')
        .toBeFalse();
    });
  });
});
