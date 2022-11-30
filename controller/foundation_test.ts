/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {Foundation} from './foundation.js';

describe('Foundation', () => {
  it('#init() should be called on construction', () => {
    class MyFoundation extends Foundation<{}> {
      // Make init public to test
      override init() {}
    }

    spyOn(MyFoundation.prototype, 'init');
    const instance = new MyFoundation({});
    expect(instance.init).toHaveBeenCalled();
  });
});
