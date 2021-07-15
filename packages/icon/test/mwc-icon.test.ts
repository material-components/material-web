/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {Icon} from '@material/mwc-icon';


describe('mwc-icon', () => {
  let element: Icon;

  beforeEach(() => {
    element = document.createElement('mwc-icon');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('initializes as an mwc-icon', () => {
    expect(element).toBeInstanceOf(Icon);
  });
});
