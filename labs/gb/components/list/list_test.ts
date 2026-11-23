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
  });
});
