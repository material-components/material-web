/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {isDisabled} from './pseudo-classes.js';

describe('pseudo-classes', () => {
  const env = new Environment();

  describe('isDisabled()', () => {
    it('returns true for elements with .disabled class', () => {
      const root = env.render(html`<div class="disabled"></div>`);
      expect(isDisabled(root.firstElementChild!)).toBeTrue();
    });

    it('returns true for elements with :disabled pseudo-class', () => {
      const root = env.render(html`<button disabled></button>`);
      expect(isDisabled(root.firstElementChild!)).toBeTrue();
    });

    it('returns true for elements with [disabled] attribute', () => {
      const root = env.render(html`<div disabled></div>`);
      expect(isDisabled(root.firstElementChild!)).toBeTrue();
    });

    it('returns true for elements with [aria-disabled=true] attribute', () => {
      const root = env.render(html`<div aria-disabled="true"></div>`);
      expect(isDisabled(root.firstElementChild!)).toBeTrue();
    });

    it('returns false for non-disabled elements', () => {
      const root = env.render(html`<div></div>`);
      expect(isDisabled(root.firstElementChild!)).toBeFalse();
    });
  });
});
