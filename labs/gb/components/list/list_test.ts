/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-list.js';
import './md-gb-list-item.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {type ListItemElement} from './list-item-element.js';

describe('<md-gb-list-item>', () => {
  const env = new Environment();

  describe('state attributes', () => {
    it('reflects checked and disabled to host attributes', async () => {
      const root = env.render(html`
        <md-gb-list>
          <md-gb-list-item>Item</md-gb-list-item>
        </md-gb-list>
      `);
      await env.waitForStability();
      const item = root.querySelector<ListItemElement>('md-gb-list-item')!;

      expect(item.hasAttribute('checked')).toBeFalse();
      expect(item.hasAttribute('disabled')).toBeFalse();

      item.checked = true;
      item.disabled = true;
      await env.waitForStability();
      expect(item.hasAttribute('checked')).toBeTrue();
      expect(item.hasAttribute('disabled')).toBeTrue();

      item.checked = false;
      item.disabled = false;
      await env.waitForStability();
      expect(item.hasAttribute('checked')).toBeFalse();
      expect(item.hasAttribute('disabled')).toBeFalse();
    });

    it('lets outside CSS style checked and disabled items', async () => {
      const root = env.render(html`
        <style>
          .styled md-gb-list-item[checked]::part(list-item) {
            --container-color: rgb(1, 2, 3);
          }
          .styled md-gb-list-item[disabled]::part(list-item) {
            --label-text-color: rgb(4, 5, 6);
          }
        </style>
        <md-gb-list class="styled">
          <md-gb-list-item id="checked">Checked</md-gb-list-item>
          <md-gb-list-item id="disabled">Disabled</md-gb-list-item>
          <md-gb-list-item id="plain">Plain</md-gb-list-item>
        </md-gb-list>
      `);
      await env.waitForStability();
      root.querySelector<ListItemElement>('#checked')!.checked = true;
      root.querySelector<ListItemElement>('#disabled')!.disabled = true;
      await env.waitForStability();
      const inner = (id: string) =>
        getComputedStyle(
          root.querySelector(id)!.shadowRoot!.querySelector('.list-item')!,
        );

      expect(inner('#checked').backgroundColor).toBe('rgb(1, 2, 3)');
      expect(inner('#disabled').color).toBe('rgb(4, 5, 6)');
      expect(inner('#plain').backgroundColor).not.toBe('rgb(1, 2, 3)');
      expect(inner('#plain').color).not.toBe('rgb(4, 5, 6)');
    });
  });
});
