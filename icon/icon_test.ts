/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './icon.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdIcon} from './icon.js';

describe('<md-icon>', () => {
  const env = new Environment();

  describe('.styles', () => {
    createTokenTests(MdIcon.styles);
  });

  describe('accessiblity', () => {
    it('sets aria-hidden to true by default', async () => {
      const root = env.render(html` <md-icon>check</md-icon>`);
      const icon = root.querySelector('md-icon')!;

      await env.waitForStability();

      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    it('sets aria-hidden is removed when initalized as false', async () => {
      const root = env.render(html` <md-icon aria-hidden="false"
        >check</md-icon
      >`);
      const icon = root.querySelector('md-icon')!;

      await env.waitForStability();

      expect(icon.hasAttribute('aria-hidden')).toBe(false);
    });

    it('allows overriding aria-hidden after first render', async () => {
      const root = env.render(html` <md-icon>check</md-icon>`);
      const icon = root.querySelector('md-icon')!;

      await env.waitForStability();

      expect(icon.getAttribute('aria-hidden')).toBe('true');

      icon.removeAttribute('aria-hidden');
      await env.waitForStability();

      expect(icon.hasAttribute('aria-hidden')).toBe(false);
    });

    it('overrides invalid aria-hidden values to true', async () => {
      const root =
        env.render(html` <!-- @ts-ignore:disable-next-line:no-incompatible-type-binding -->
          <md-icon aria-hidden="foo">check</md-icon>`);
      const icon = root.querySelector('md-icon')!;

      await env.waitForStability();

      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
