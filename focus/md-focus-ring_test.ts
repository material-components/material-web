/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdFocusRing} from './md-focus-ring.js';

describe('<md-focus-ring>', () => {
  describe('.styles', () => {
    createTokenTests(MdFocusRing.styles);
  });
});
