/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TabScroller} from '@material/mwc-tab-scroller/mwc-tab-scroller';

describe('mwc-tab-scroller', () => {
  let element: TabScroller;
  beforeEach(() => {
    element = document.createElement('mwc-tab-scroller');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('initializes as an mwc-tab-scroller', () => {
    expect(element).toBeInstanceOf(TabScroller);
  });
});
