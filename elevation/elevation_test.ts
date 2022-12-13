/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdElevation} from './elevation.js';

describe('<md-elevation>', () => {
  describe('.styles', () => {
    createTokenTests(MdElevation.styles);
  });
});
