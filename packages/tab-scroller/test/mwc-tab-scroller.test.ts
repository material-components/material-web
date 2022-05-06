/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {TabScroller} from '@material/mwc-tab-scroller/mwc-tab-scroller.js';

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
