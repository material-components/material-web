/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdInputChip} from './input-chip.js';

describe('<md-input-chip>', () => {
  describe('.styles', () => {
    createTokenTests(MdInputChip.styles);
  });
});
