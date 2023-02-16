/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdRipple} from './ripple.js';

describe('<md-ripple>', () => {
  describe('.styles', () => {
    createTokenTests(MdRipple.styles);
  });
});
