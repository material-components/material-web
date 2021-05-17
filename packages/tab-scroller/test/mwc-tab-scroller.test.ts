/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TabScroller} from '@material/mwc-tab-scroller/mwc-tab-scroller';

suite('mwc-tab-scroller', () => {
  let element: TabScroller;
  setup(() => {
    element = document.createElement('mwc-tab-scroller');
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-tab-scroller', () => {
    assert.instanceOf(element, TabScroller);
  });
});
