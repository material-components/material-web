/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {stringConverter} from './string-converter.js';

describe('stringConverter', () => {
  describe('.fromAttribute', () => {
    it('should return an empty string if string is empty or null', () => {
      expect(stringConverter.fromAttribute('')).toBe('');
      expect(stringConverter.fromAttribute(null)).toBe('');
    });

    it('should return value of string if not empty', () => {
      expect(stringConverter.fromAttribute('foo')).toBe('foo');
    });
  });

  describe('.toAttribute', () => {
    it('should return null if string is empty', () => {
      expect(stringConverter.toAttribute('')).toBeNull();
    });

    it('should return value of string if not empty', () => {
      expect(stringConverter.toAttribute('foo')).toBe('foo');
    });
  });
});
