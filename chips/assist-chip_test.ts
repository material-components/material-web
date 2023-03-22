/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {createTokenTests} from '../testing/tokens.js';

import {MdAssistChip} from './assist-chip.js';

describe('<md-assist-chip>', () => {
  describe('.styles', () => {
    createTokenTests(MdAssistChip.styles);
  });
});
