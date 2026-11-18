/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-radio.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {type RadioElement} from './radio-element.js';

describe('<md-gb-radio>', () => {
  const env = new Environment();

  describe(':state(checked)', () => {
    it('matches the default checked attribute', async () => {
      const root = env.render(html`
        <md-gb-radio id="on" name="default" checked></md-gb-radio>
        <md-gb-radio id="off" name="default"></md-gb-radio>
      `);
      await env.waitForStability();

      expect(root.querySelector('#on')!.matches(':state(checked)')).toBeTrue();
      expect(
        root.querySelector('#off')!.matches(':state(checked)'),
      ).toBeFalse();
    });

    it('follows the checked property and user selection', async () => {
      const root = env.render(html`
        <md-gb-radio id="a" name="group"></md-gb-radio>
        <md-gb-radio id="b" name="group"></md-gb-radio>
      `);
      await env.waitForStability();
      const a = root.querySelector<RadioElement>('#a')!;
      const b = root.querySelector<RadioElement>('#b')!;

      a.checked = true;
      expect(a.matches(':state(checked)')).toBeTrue();
      expect(b.matches(':state(checked)')).toBeFalse();

      b.click();
      await env.waitForStability();
      expect(b.checked).toBeTrue();
      expect(b.matches(':state(checked)')).toBeTrue();
      expect(a.checked).toBeFalse();
      expect(a.matches(':state(checked)')).toBeFalse();
    });

    it('lets outside CSS style only the checked radio', async () => {
      const root = env.render(html`
        <style>
          .styled md-gb-radio:state(checked)::part(radio) {
            --icon-color: rgb(1, 2, 3);
          }
        </style>
        <div class="styled">
          <md-gb-radio id="first" name="styled" checked></md-gb-radio>
          <md-gb-radio id="second" name="styled"></md-gb-radio>
        </div>
      `);
      await env.waitForStability();
      const iconColor = (id: string) =>
        getComputedStyle(
          root.querySelector(id)!.shadowRoot!.querySelector('.radio')!,
          '::before',
        ).color;

      expect(iconColor('#first')).toBe('rgb(1, 2, 3)');
      expect(iconColor('#second')).not.toBe('rgb(1, 2, 3)');

      root.querySelector<HTMLElement>('#second')!.click();
      await env.waitForStability();
      expect(iconColor('#first')).not.toBe('rgb(1, 2, 3)');
      expect(iconColor('#second')).toBe('rgb(1, 2, 3)');
    });
  });
});
