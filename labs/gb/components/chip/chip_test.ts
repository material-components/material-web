/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-chip.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {type ChipElement} from './chip-element.js';

describe('<md-gb-chip>', () => {
  const env = new Environment();

  describe('icon shadow part', () => {
    it('exposes part="icon" on the leading icon wrapper', async () => {
      const root = env.render(html`
        <md-gb-chip type="filter" selected>Filter</md-gb-chip>
      `);
      await env.waitForStability();
      const chip = root.querySelector<ChipElement>('md-gb-chip')!;
      const iconWrapper = chip.shadowRoot!.querySelector('.chip-icon')!;

      expect(iconWrapper.getAttribute('part')).toBe('icon');
      expect(getComputedStyle(iconWrapper).display).toBe('flex');
    });

    it('lets outside CSS style or hide ::part(icon)', async () => {
      const root = env.render(html`
        <style>
          .checkless md-gb-chip[selected]::part(icon) {
            display: none;
          }
        </style>
        <div class="checkless">
          <md-gb-chip id="hidden" type="filter" selected>Checkless</md-gb-chip>
        </div>
        <md-gb-chip id="default" type="filter" selected>Default</md-gb-chip>
      `);
      await env.waitForStability();
      const iconStyle = (id: string) =>
        getComputedStyle(
          root.querySelector(id)!.shadowRoot!.querySelector('.chip-icon')!,
        );

      expect(iconStyle('#hidden').display).toBe('none');
      expect(iconStyle('#default').display).toBe('flex');
    });
  });
});
