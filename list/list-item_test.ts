/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdListItem} from './list-item.js';

describe('<md-list-item>', () => {
  describe('.styles', () => {
    createTokenTests(MdListItem.styles);
  });

  describe('href', () => {
    it('sanitizes javascript: URLs in href', async () => {
      const item = new MdListItem();
      item.href = 'javascript:alert(1)';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('href')).toBeNull();
      item.remove();
    });
  });

  describe('rel and referrerpolicy', () => {
    it('omits rel and referrerpolicy when unset', async () => {
      const item = new MdListItem();
      item.type = 'link';
      item.href = 'https://example.com';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
      expect(anchor.hasAttribute('referrerpolicy')).toBeFalse();
      item.remove();
    });

    it('does not default rel when target="_blank"', async () => {
      const item = new MdListItem();
      item.type = 'link';
      item.href = 'https://example.com';
      item.target = '_blank';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
      item.remove();
    });

    it('propagates rel and referrerpolicy to the anchor tag', async () => {
      const item = new MdListItem();
      item.type = 'link';
      item.href = 'https://example.com';
      item.rel = 'noopener noreferrer';
      item.referrerPolicy = 'no-referrer';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe('no-referrer');
      item.remove();
    });

    it('reflects rel and referrerpolicy attributes to properties and anchor', async () => {
      const item = new MdListItem();
      item.setAttribute('type', 'link');
      item.setAttribute('href', 'https://example.com');
      item.setAttribute('rel', 'noreferrer');
      item.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      document.body.appendChild(item);
      await item.updateComplete;

      expect(item.rel).toBe('noreferrer');
      expect(item.referrerPolicy).toBe('strict-origin-when-cross-origin');

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe(
        'strict-origin-when-cross-origin',
      );
      item.remove();
    });
  });
});
