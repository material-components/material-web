/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdDivider} from './divider.js';

describe('<md-divider>', () => {
  describe('.styles', () => {
    createTokenTests(MdDivider.styles);
  });
});
