/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdFilterChip} from './filter-chip.js';

describe('<md-filter-chip>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilterChip.styles);
  });
});
