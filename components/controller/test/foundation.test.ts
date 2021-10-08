/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {Foundation} from '../foundation';

describe('Foundation', () => {
  it('#init() should be called on construction', () => {
    spyOn(Foundation.prototype, 'init');
    const instance = new Foundation({});
    expect(instance.init).toHaveBeenCalled();
  });
});
