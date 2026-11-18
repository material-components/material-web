/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-button.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type ButtonElement} from './button-element.js';

function inner(b: ButtonElement): HTMLElement {
  return b.shadowRoot!.querySelector('[part="btn"]') as HTMLElement;
}

describe('<md-gb-button>', () => {
  const env = new Environment();

  beforeAll(() => {
    adoptStyles(document, [m3Styles]);
  });

  describe('outline width scoping', () => {
    it('sets 0px border width on non-outlined buttons across sizes', async () => {
      const root = env.render(html`
        <div>
          <md-gb-button id="text-sm" color="text" size="sm">Text</md-gb-button>
          <md-gb-button id="filled-sm" color="filled" size="sm"
            >Filled</md-gb-button
          >
          <md-gb-button id="elevated-sm" color="elevated" size="sm"
            >Elevated</md-gb-button
          >
          <md-gb-button id="tonal-sm" color="tonal" size="sm"
            >Tonal</md-gb-button
          >
          <md-gb-button id="filled-lg" color="filled" size="lg"
            >Filled LG</md-gb-button
          >
          <md-gb-button id="filled-xl" color="filled" size="xl"
            >Filled XL</md-gb-button
          >
        </div>
      `);
      await env.waitForStability();

      for (const id of [
        '#text-sm',
        '#filled-sm',
        '#elevated-sm',
        '#tonal-sm',
        '#filled-lg',
        '#filled-xl',
      ]) {
        const btn = root.querySelector(id) as ButtonElement;
        const style = getComputedStyle(inner(btn));
        expect(style.borderLeftWidth).withContext(id).toBe('0px');
        expect(style.borderRightWidth).withContext(id).toBe('0px');
      }
    });

    it('sets 1px, 2px, and 3px border widths on outlined buttons by size', async () => {
      const root = env.render(html`
        <div>
          <md-gb-button id="out-xs" color="outlined" size="xs">XS</md-gb-button>
          <md-gb-button id="out-sm" color="outlined" size="sm">SM</md-gb-button>
          <md-gb-button id="out-md" color="outlined" size="md">MD</md-gb-button>
          <md-gb-button id="out-lg" color="outlined" size="lg">LG</md-gb-button>
          <md-gb-button id="out-xl" color="outlined" size="xl">XL</md-gb-button>
        </div>
      `);
      await env.waitForStability();

      expect(
        getComputedStyle(inner(root.querySelector('#out-xs') as ButtonElement))
          .borderLeftWidth,
      ).toBe('1px');
      expect(
        getComputedStyle(inner(root.querySelector('#out-sm') as ButtonElement))
          .borderLeftWidth,
      ).toBe('1px');
      expect(
        getComputedStyle(inner(root.querySelector('#out-md') as ButtonElement))
          .borderLeftWidth,
      ).toBe('1px');
      expect(
        getComputedStyle(inner(root.querySelector('#out-lg') as ButtonElement))
          .borderLeftWidth,
      ).toBe('2px');
      expect(
        getComputedStyle(inner(root.querySelector('#out-xl') as ButtonElement))
          .borderLeftWidth,
      ).toBe('3px');
    });
  });
});
