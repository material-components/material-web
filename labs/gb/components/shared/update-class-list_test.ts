/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {updateClassList} from './update-class-list.js';

describe('updateClassList()', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });

  it('adds classes for truthy values', () => {
    updateClassList(element, {
      'foo': true,
      'bar': 'truthy string',
      'baz': 1,
    });

    expect(element.classList.contains('foo')).toBeTrue();
    expect(element.classList.contains('bar')).toBeTrue();
    expect(element.classList.contains('baz')).toBeTrue();
  });

  it('removes classes for falsy values', () => {
    element.classList.add('foo', 'bar', 'baz');

    updateClassList(element, {
      'foo': false,
      'bar': '',
      'baz': 0,
    });

    expect(element.classList.contains('foo')).toBeFalse();
    expect(element.classList.contains('bar')).toBeFalse();
    expect(element.classList.contains('baz')).toBeFalse();
  });

  it('preserves unspecified classes', () => {
    element.classList.add('existing');

    updateClassList(element, {
      'foo': true,
    });

    expect(element.classList.contains('existing')).toBeTrue();
    expect(element.classList.contains('foo')).toBeTrue();
  });

  it('handles repeated calls toggling the same keys true->false->true', () => {
    updateClassList(element, {'selected': true, 'active': false});
    expect(element.classList.contains('selected')).toBeTrue();
    expect(element.classList.contains('active')).toBeFalse();

    updateClassList(element, {'selected': false, 'active': true});
    expect(element.classList.contains('selected')).toBeFalse();
    expect(element.classList.contains('active')).toBeTrue();

    updateClassList(element, {'selected': true, 'active': false});
    expect(element.classList.contains('selected')).toBeTrue();
    expect(element.classList.contains('active')).toBeFalse();
  });
});
